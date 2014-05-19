//gdev handler
var appname='gdev',
	crypto=require("crypto"),
	loop=require(process.cwd()+'/loop.js').loop,
	fs=require('fs'),
	pth=require('path'),	
	mysql=require('mysql'),
	http = require('http'),
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'Loikam22',
		database:'gdev'
	}),
	post=function(path,data,fn){
		if(typeof(data)!='string'){
			data=JSON.stringify(data)
		}
		var opts = {
			host: '88.196.53.29',
			port: 2222,
			path: path,//'/auth',
			method: 'POST',
			headers: {
				'Content-Type':'application/json;charset=UTF-8',
				//'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(data)
			}
		}		
		var req = http.request(opts, function(res) {
			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				if(fn){
					fn(chunk)
				}				
			})
		})		
		console.log('data123:',data)
		req.write(data)
		req.end()	
	}
	
var sessions={
	users:{},
	adduser:function(name,data){
		var d=new Date()
		d.setHours(d.getHours()+2)
		data.time=d.getTime()
		this.users[name]=data
	},
	remuser:function(name){
		delete this.users[name]	
	},
	getuser:function(name){		
		return this.users[name]
	},
	auth:function(name,sid){
		var user=sessions.getuser(name),
			auth=false
		if(user && user.sid==sid){
			auth=true
		}
		return auth
	},
	run:function(){
		setTimeout(function(){
			var now=new Date().getTime(),
				rem=[]
			loop(sessions.users,function(name,user){
				if(now>user.time){
					rem.append(name)
				}
			})
			loop(rem,function(i,name){
				delete session.users[name]
			})
			sessions.run()
		},5000)//3600000)		
	}
}
sessions.run()
	
var argsl=function(name){	
	var a={
		add:{
			get:function(req,res){
				var q='show columns from '+name,
					data={}
				connection.query(q,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					res.send(JSON.stringify(data))
				})
			},
			post:function(req,res){
				var user=sessions.getuser(req.cookies.user)
				console.log('user:',user,req.cookies)
				if(user){
					var data=req.body,
						item=data.item,
						q='insert into '+name+' set ?',
						columns=[],
						values=[]		
					
					console.log(data)
					
					connection.query(q,item,function(err,qres){						
						if(err){
							data.err=err
						} else {
							data.res=qres
						}
						delete data.item
						
						//console.log('data:',err)
						
						if(data.want=='list' && !err){
							handle[name].list.get(req,res)
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
		rem:{
			get:function(req,res){
				var q='show columns from '+name,
					data={}
				connection.query(q,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					res.send(JSON.stringify(data))
				})	
			},
			post:function(req,res){
				//DELETE FROM somelog WHERE user = 'jcole'
				var data=req.body,
					q='DELETE from '+name+' where id='+connection.escape(data.id)
				
				connection.query(q,data.req,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					if(data.want=='list'){
						handle[name].list.get({query:{tablename:data.tablename}},res)
					} else {
						res.send(JSON.stringify(data))
					}
				})				
				//res.send('not handled')
			}
		},
		get:{
			get:function(req,res,callback){
				var query=req.query,
					q=[
						'select * from ',
						name,
						' where name=',
						query.name,
						';'
					].join(''),
					data={}
				//console.log(q)
				//q='select * from users where name=1;'
				
				connection.query(q,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					if(callback){
						callback(data)
					} else {
						res.send(JSON.stringify(data))
					}
				})				
			}
		},
		set:{
			post:function(req,res){
				var data=req.body,
					q='UPDATE '+name+' SET ? '+'where id='+connection.escape(data.id)
				console.log('q:',data)
				connection.query(q,data.item,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}					
					if(data.want=='list'){
						handle[name].list.get({query:{tablename:data.tablename}},res)
					} else {
						res.send(JSON.stringify(data))
					}
				})
			}								
		},
		list:{
			get:function(req,res){
				var q='select * from '+name,
					data={
						list:[],
						fields:{}
					}				
				a.get.get(req,res,function(qres){
					data.fields=qres.res
					connection.query(q,function(err,qres){						
						if(err){
							data.err=err
						} else {
							data.list=qres
						}
						res.send(JSON.stringify(data))
					})									
				})
			}
		}
	}	
	return a
}
var handle={
	games:argsl('games'),
	developers:argsl('developers'),
	events:argsl('events'),
	resources:argsl('resources'),
	auth:{
		login:{
			post:function(req,res){
				var data=req.body				
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
							
							sessions.adduser(data.res.name,{
								name:data.res.name,
								sid:sid,
								time:new Date().getTime()
							})
							
							res.cookie('sid', sid, { maxAge: 900000, httpOnly: false });
							res.cookie('user', data.res.name, { maxAge: 900000, httpOnly: false });
						}
						res.send(sres)
					})
				}
			}
		},
		logout:{			
			get:function(req,res){
				console.log('cookies:',req.cookies,res.cookie)
				
				var sid=req.cookies.sid,
					name=req.cookies.user,
					q=req.query,
					data={
						err:''
					},
					user=sessions.getuser(name)
					
				if(user){
					sessions.remuser(name)
					res.clearCookie('sid')
					res.clearCookie('user')
				} else {
					res.clearCookie('sid')
					res.clearCookie('user')				
					data.err='user not found'
				}
				
				
				res.send(data)
			}
		},
		register:{
			post:function(req,res){
				var data={
					res:'123',
					err:''
				}
				res.send(JSON.stringify(data))
			}
		}
	}
}

exports.handler=function(req,res){
	if(req.url=='' || req.url=='/'){
		req.url='/index.html'
	}
	var parts=req.url.split('?')[0].split('/'),
		controller=parts[1],
		action=parts[2]
		query=req.query,
		method=req.method.toLowerCase(),
		hres='not handled',
		referer=req.headers.referer
		
		//restriction handling
	var authorize={},
		route=[
			controller,
			action,
			method
		].join('/'),
		valid=true,
		auth=authorize[route]
		
	
	//file
	var path=pth.resolve([__dirname,req.url].join('/'))		
	if(fs.existsSync(path) && fs.statSync(path).isFile()){
		//console.log('send file:',path)
		res.sendfile(path)
	} else {
	//action		
		if(!auth){
			valid=true
		} else {
			valid=auth(req,res)
		}
		if(valid===true){
			if(controller in handle){
				//console.log(action,controller,method,handle[controller])
				if(action in handle[controller]){
					if(method in handle[controller][action]){
						handle[controller][action][method](req,res)		
					} else {
						res.send(appname+' '+controller+' '+action+' no method: '+method)
					}
					
				} else {
					res.send( appname+' '+controller+' no action: '+action)
				}
			} else {
				res.send( appname+' no controller: '+controller)
			}		
		} else {
			var data={
				err:'not authorized to access: '+route,
				mes:valid
			}
			res.send(data)
		}
	}
}