var loop=require('loop.js').loop,
	http=require('http'),
	crypto=require("crypto"),
	path=require('path'),
	fs=require('fs'),	
	url=require('url'),
	util = require('util')
	
exports.handler=function(req,res){	
	res.isauth=filters.isauth(req,res)
	var act=actions[req.route]
	if(act){
		var auth=true,
			filter
			
		if(act.filters){
			loop(act.filters,function(i,filtername){
				filter=filters[filtername]
				if(filter){
					auth=filter(req,res)
				} else {
					console.log('missing filter:',filtername)
				}
			})
		}
		//handle action
		if(auth){
			act.fn(req,res)
		} else {			
			res.send('{"err":"'+req.route+' forbidden'+'"}','text/html',403)
		}				
	} else {
		//file request
		var filename = path.join(process.cwd(), req.pathname),			
			ext=path.extname(req.pathname),
			dirname
		if(ext){
			dirname=path.dirname(filename)
		} else {
			dirname=filename
		}
		if(filename.indexOf('handler.js')!=-1 || filename.indexOf('server.js')!=-1){
			res.send("{'err':'You are not here'}",403)
			return
		}
		fs.exists(filename, function(exists) {
			if(!exists) {
				res.send('"err":{"They are not here"}',404)
				return
			}
			if (fs.statSync(filename).isDirectory()) filename += '/index.html'
			fs.readFile(filename, "binary", function(err, file) {
				if(err) {     
					res.send('{"err":'+err+'}',500)
					return
				}				
				var ex=ext.replace('.','')
				switch(ex){
					case 'wav':
					case 'ogg':
						var stat = fs.statSync(filename)    
						res.writeHead(200, {
							'Content-Type': 'audio/'+ex, 
							'Content-Length': stat.size,
							'Accept-Ranges': 'bytes',
							'Content-Range': ['bytes 0-',stat.size-1,'/',stat.size-1].join('')
						})					
						var rs = fs.createReadStream(filename)
						rs.pipe(res)					
						break
					default:
						res.send(file,'200',ext)
						break
				}
				if(ext=='.ogg'){
				} else {
					
				}
			})			
		})
	}
}

var sessions={
	users:{},
	add:function(name,sid){
		var time=new Date()
		time.setHours(time.getHours()+8)
		var user={
			name:name,
			sid:sid,
			time:time.getTime()
		}
		this.users[name]=user
		return user
	},
	rem:function(name){
		delete this.users[name]
	},
	get:function(name){
		return this.users[name]
	},
	run:function(){
		setTimeout(function(){
			console.log('rem users')
			var time=new Date().getTime(),
				rem=[]
			loop(sessions.users,function(name,user){
				if(time>user.time){
					rem.push(name)
				}
			})
			loop(rem,function(i,name){
				delete session.users[name]
			})
			sessions.run()
		},28800*1000)//8h
	}
}
var filters={
	'isauth':function(req,res){		
		var user=sessions.get(req.cookies.user),
			sid=req.cookies.sid,
			time=new Date().getTime()
			
		if(user){
			if(user.sid==sid){
				if(time<user.time){
					return true
				} else {
					sessions.rem(user.name)
				}
			} 
		}
		//clear cookies
		res.setcookie('sid','expired',-1)
		res.setcookie('user','expired',-1)		
		return false
	},	
	'isadmin':function(req,res){
		return true
	}
}
var actions={
	'/login post':{
		//filters:['isguest'],
		fn:function(req,res){			
			var data=JSON.parse(req.data)			
			if(data.name && data.pasw){				
				post('/auth/users/login',data,function(sres){					
					//res.send(JSON.stringify(data))
					var data=JSON.parse(sres)
					if(data.err){
						
					} else {
						//add cookie
						//console.log('datad:',data)
						var sid=crypto.createHash('sha1')							
						sid.update(data.res.name)
						sid.update(new Date().getTime().toString())
						sid=sid.digest('hex')
						
						sessions.add(data.res.name,sid)
						res.setcookie('sid',sid)
						res.setcookie('user',data.res.name)
						
						console.log(sessions.users)
					}
					res.send(sres)
				})
			}		
		}		
	},
	'/logout get':{
		filters:['isauth'],
		fn:function(req,res){
			//console.log('cookies:',req.cookies,res.cookie)
			
			var sid=req.cookies.sid,
				name=req.cookies.user,
				q=req.query,
				user=sessions.get(name)
				
			if(user){
				sessions.rem(name)
			} else {				
			}
			res.setcookie('sid','expired',-1)
			res.setcookie('user','expired',-1)
			
			
			res.send('{res:"ok"}')			
		}		
	},
	'/register post':{
		fn:function(req,res){
			res.send('register not available')
		}
	},
	'/games/add get':{
		//filters:['isauth'],
		fn:function(req,res){
			connection.query('show columns from games',function(err,qres){						
				var data={}
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},
	'/games/add post':{
		filters:['isauth'],
		fn:function(req,res){
			var user=sessions.get(req.cookies.user)
			if(user){
				var data=JSON.parse(req.data),
					item=data.item,
					columns=[],
					values=[]		
				
				item.owner=user.name
				
				connection.query('insert into games set ?',item,function(err,qres){											
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					delete data.item
					
					//console.log('data:',err)
					
					if(data.want=='list' && !err){
						actions['/games/list get'].fn(req,res)
						//handle[name].list.get(req,res)
						//res.send(JSON.stringify(data))
					} else {
						res.send(JSON.stringify(data))
					}
				})
			} else {
				res.send(JSON.stringify({
					err:'forbidden'
				}))
			}		
		}
	},
	'/games/list get':{
		filers:['isauth'],
		fn:function(req,res){
			connection.query('select * from games',function(err,qres){						
				var data={
					err:'',
					list:'',
					schema:''
				}
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},
	'/developers/list get':{
		filers:['isauth'],
		fn:function(req,res){
			var q='select * from developers',
				data={
					list:[],
					fields:{}
				}				
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},
	'/events/list get':{
		filers:['isauth'],
		fn:function(req,res){
			var q='select * from events',
				data={
					list:[],
					fields:{}
				}				
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},	
	'/resources/list get':{
		filers:['isauth'],
		fn:function(req,res){
			var q='select * from resources',
				data={
					list:[],
					fields:{}
				}				
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	}
}	
actions['/doit/now get']={
	//filters:['isauth'],
	fn:function(req,res){
		res.send(req.route)
	}
}

sessions.run()


console.log('s0 handler')