var loop=require('./loop.js').loop,
	http=require('http'),
	crypto=require("crypto"),
	path=require('path'),
	fs=require('fs'),	
	url=require('url'),
	selected={
		base:'',
		table:''
	},
	validatequery=function(str){
		return str
	}
	
//base
var mysql=require('mysql'),
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'Loikam22',
		database:'auth'
	}),
	//post to auth server
	post=function(path,data,fn){		
		if(typeof(data)!='string'){
			data=JSON.stringify(data)
		}
		var opts = {
			host: '88.196.53.29',
			port: 2000,
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
		req.write(data)
		req.end()	
	},
	vq=function(q){		
		if(!(q.match(/['";]/)===null)){
			q=''
		}
		return q
	}

exports.handler=function(req,res){
	req.user=sessions.get(req.cookies.user)
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
			res.writeHead(200, {
				'Content-Type': 'text/html', 
			})
			res.end('<script>location="authent/login"</script>')
			//res.send('{"err":"'+req.route+' forbidden'+'"}','text/html',403)
			//res.send('{"err":"'+req.route+' forbidden'+'"}','text/html',403)
		}				
	} else {
		res.sendfile(req,res)
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
		return this.users[name] || false
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
					return user
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
		var user=filters.isauth()
		if(user && user.name=='admin'){
			return true
		}
		return false
	}
}
var actions={
	add:function(o){
		loop(o,function(k,v){
			actions[k]=v
		})
	}
}
//index
actions.add({
	'/ get':{
		filters:['isauth'],
		fn:function(req,res){
			res.writeHead(200, {
				'Content-Type': 'text/html', 
			})
			var rs = fs.createReadStream('./base/index.html')
			rs.pipe(res)			
		}
	}
})

//base
actions.add({
	//bases
	'/bases/list get':{
		fn:function(req,res){
			var data={}
			connection.query("show databases",function(err,qres){
				data.bases=qres
				connection.query("select database()",function(err,sres){
					loop(qres,function(i,item){
						if(item.Database==sres[0]['database()']){
							item.selected=true
							selected.base=item.Database
							data.selected=item.Database
						}
					})						
					connection.query("show tables",function(err,tables){
						data.tables=tables
						res.send(JSON.stringify(data))
					})									
				})					
			})		
		}
	},
	'/bases/use get':{
		fn:function(req,res){
			var query=validatequery('use '+req.query.base+';')
			connection.query(query,function(err,qres){
				var data={}
				data.tables=qres
				data.selected=query.base
				connection.query("show tables",function(err,tables){
					data.tables=tables
					res.send(JSON.stringify(data))
				})						
			})		
		}
	},
	'/bases/add post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			var query=validatequery('create database '+req.body.base)			
			connection.query(query,function(err,qres){
				if(err) {
					console.log(err)
					res.send(err)
				} else {
					var data={}
					connection.query("show databases",function(err,qres){
						data.bases=qres
						connection.query("select database()",function(err,sres){
							loop(qres,function(i,item){
								if(item.Database==sres[0]['database()']){
									item.selected=true
									selected.base=item.Database
									data.selected=item.Database
								}
							})						
							connection.query("show tables",function(err,tables){
								data.tables=tables
								res.send(JSON.stringify(data))
							})									
						})					
					})					
				}										
			})		
		}
	},
	'/bases/rem post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			var query=validatequery('drop database '+req.body.base)
			connection.query(query,function(err,qres){
				if(err) {
					console.log(err)
					res.send(err)
				} else {
					var data={}
					connection.query("show databases",function(err,qres){
						data.bases=qres
						connection.query("select database()",function(err,sres){
							loop(qres,function(i,item){
								if(item.Database==sres[0]['database()']){
									item.selected=true
									selected.base=item.Database
									data.selected=item.Database
								}
							})						
							connection.query("show tables",function(err,tables){
								data.tables=tables
								res.send(JSON.stringify(data))
							})									
						})					
					})					
				}	
			})		
		}
	},
	'/bases/query get':{
		fn:function(req,res){	
			connection.query(req.query.query,function(err,qres){
				res.send(JSON.stringify({
					data:qres,
					err:err
				}))
			})
		}
	},
	//tables
	'/tables/add post':{
		fn:function(req,res){	
			req.body=JSON.parse(req.data)
			var data=req.body,
				q,
				line
			line=[]	
			q=['create table '+data.tablename],				
			loop(data.schema,function(i,fi){					
				line.push([fi.Field,fi.Type,fi.Extra].join(' '))
			})				
			q.push('('+line.join(',')+')')
			q=q.join(' ')+';'
			connection.query(q,function(err,qres){
				if(err) console.log(err)
				res.send({
					err:err,
					tablename:data.tablename,
					res:q
				})
			})	
		}
	},
	'/tables/rem get':{
		fn:function(req,res){
			var q='drop table '+req.query.tablename
			connection.query(q,function(err,qres){
				if(err) console.log(err)
				res.send({
					err:err,
					res:q
				})
			})		
		}
	},
	'/tables/get get':{
		fn:function(req,res){
			var query="show columns from "+req.query.table
			connection.query(query,function(err,qres){						
				res.send(JSON.stringify(qres))
			})		
		}
	},
	'/tables/set post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			var data=req.body
			
			//get existing columns
			var q="show columns from "+data.tablename				
			connection.query(q,function(err,qres){						
				var todel=[],
					toadd=[],
					tomod=[],
					ind

				loop(data.schema,function(i1,field1){
					if(!field1.action){
						field1.action='add'
						toadd.push(field1)
					}					
					loop(qres,function(i2,field2){
						if(!field2.action){
							field2.action='drop'
							todel.push(field2)
						}
						if(field1.Field==field2.Field){
							field1.action='modify'
							field2.action='modify'
							tomod.push(field1)
							
							ind=todel.indexOf(field2)
							if(ind!=-1){
								todel.splice(ind,1)
							}
							ind=toadd.indexOf(field1)
							if(ind!=-1){
								toadd.splice(ind,1)									
							}																
						}
					})
				})
				
				var query,
					line
					
				if(todel.length){		
					query=['alter table '+data.tablename],
					line=[]						
					loop(todel,function(i,fi){
						line.push('drop column '+fi.Field)
					})						
					query.push(line.join(','))
					query=query.join(' ')+';'
					connection.query(query,function(err,qres){
						if(err) console.log(err)
					})
				}
				if(tomod.length){
					query=['alter table '+data.tablename],
					line=[]
					loop(tomod,function(i,fi){
						line.push(['modify column',fi.Field,fi.Type,fi.Null,fi.Default,fi.Extra].join(' '))
					})
					query.push(line.join(','))
					query=query.join(' ')+';'
					connection.query(query,function(err,qres){
						if(err) console.log(err)
					})
				}
				if(toadd.length){
					query=['alter table '+data.tablename],
					line=[]
					loop(toadd,function(i,fi){
						line.push(['add column',fi.Field,fi.Type,fi.Null,fi.Default,fi.Extra].join(' '))
					})
					query.push(line.join(','))
					query=query.join(' ')+';'
					console.log('add:',query)
					connection.query(query,function(err,qres){
						if(err) console.log(err)
					})
				}
				res.send(data)
						
			})			
		}
	},
	'/tables/tabledata get':{
		fn:function(req,res){
			var table=req.query.table
			connection.query('select * from '+table,function(err,qres){						
				res.send(JSON.stringify(qres))
			})		
		}
	},
	'/tables/list get':{
		fn:function(req,res){
			connection.query("show tables",function(err,qres){
				var data={
					list:qres
				}
				res.send(JSON.stringify(data))
			})
		}
	},
	//items
	'/items/add post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			var data=req.body,
				q='insert into '+data.tablename+' set ?',
				columns=[],
				values=[]		
			console.log('add:',q)
			connection.query(q,data.item,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				if(data.want=='list' && !err){
					actions['/items/list get'].fn(req,res)
				} else {
					res.send(JSON.stringify(data))
				}
			})		
		}
	},
	'/items/rem post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			//DELETE FROM somelog WHERE user = 'jcole'
			var data=req.body,
				q='DELETE from '+data.tablename+' where id='+data.id
			
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				if(data.want=='list' && !err){					
					actions['/items/list get'].fn(req,res)
				} else {
					res.send(JSON.stringify(data))
				}
			})				
			//res.send('not handled')			
		}
	},
	'/items/get get':{
		fn:function(req,res,callback){
			var //q='show columns from '+name,
				data=req.query,
				q='show columns from '+data.tablename
				
			connection.query(q,function(err,qres){						
				if(err){
					console.log(err)
					data.err=err
				} else {
					data.schema=qres
				}
				if(callback){
					callback(err,qres)
				} else {
					res.send(JSON.stringify(data))
				}
			})		
		}
	},
	'/items/set post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			var data=req.body,
				q='UPDATE '+data.tablename+' SET ? '+'where id='+data.item.id
			console.log('q:',q,data.item)
			connection.query(q,data.item,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.res=qres
				}					
				if(data.want=='list'){
					actions['/items/list get'].fn(req,res)
				} else {
					res.send(JSON.stringify(data))
				}
			})			
		}
	},
	'/items/list get':{
		fn:function(req,res){
			var data=req.query
					
			//handle.items.get.get(req,res,function(err,qres){
			actions['/items/get get'].fn(req,res,function(err,qres){
				if(err){
					console.log(err)
					data.err=err
					res.send(JSON.stringify(data))					
				} else {
					data.schema=qres
					q='select * from '+data.tablename					
					connection.query(q,function(err,qres){						
						if(err){
						console.log(err)
							data.err=err
						} else {
							data.list=qres
						}
						res.send(JSON.stringify(data))
					})
				}
			})		
		}
	}
})

//authent
actions.add({
	'/authent/login post':{
		fn:function(req,res,callback){
			req.body=JSON.parse(req.data)
			var data=req.body			
			var	pasw=data.pasw,
				url=data.url,
				name=data.name,
				q=[
					"select * from users where name='",
					data.name.replace(/['"]/g, ""),
					"'"
				].join('')
							
			//q='select * from users where name=1;'
			
			connection.query(q,function(err,qres){								
				var data={
					res:'',
					err:''
				}
				if(err){
					data.err=err					
				} else {
					if(qres.length){
						//validate pasw
						var item=qres[0],
							hash=crypto.createHash('sha512')
						
						hash.update(pasw)
						hash.update(item.salt)				
						pasw=hash.digest('hex')

						//
						if(pasw==item.pasw){
							item.url=url
							data.res=item							
							delete item.pasw
							delete item.salt
							
							
						} else {
							data.err='bad name or pasw'
						}
						
					} else {
						data.err='bad name or pasw'
					}
					
				}
				if(callback){
					callback(data)
				} else {
					res.send(JSON.stringify(data))
				}
			})			
			
		}
	},
	'/authent/register post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			var data=req.body,
				item=data.item,
				q='insert into users set ?',
				columns=[],
				values=[]		

			//add salt
			var hash=crypto.createHash('sha1')
			hash.update(new Date().getTime()+'a')
			hash.update(new Date().getTime()+'b')
			item.salt=hash.digest("hex")
			
			hash=crypto.createHash('sha512')				
			hash.update(item.pasw)
			hash.update(item.salt)				
			item.pasw=hash.digest("hex")
			
			data.err=''
			
			connection.query(q,item,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				delete data.item
				if(data.want=='list' && !err){
					//handle[name].list.get({query:{tablename:data.tablename}},res)
					res.send(JSON.stringify(data))
				} else {
					res.send(JSON.stringify(data))
				}
			})			
		}
	},
	'/authent/exists get':{
		fn:function(req,res){
			
		}
	},
	'/authent/set post':{
		fn:function(req,res){
			req.body=JSON.parse(req.data)
			
			
		}
	}	
})

//login
actions.add({
	'/authent/login get':{
		fn:function(req,res){
			res.writeHead(200, {
				'Content-Type': 'text/html', 
			})
			var rs = fs.createReadStream('./authent/index.html')
			//var rs = fs.createReadStream('./auth/auth.js')
			rs.pipe(res)				
		}
	},
	'/login post':{
		fn:function(req,res,callback){
			var data=JSON.parse(req.data)			
			if(data.name && data.pasw){
				post('/authent/login',data,function(sres){					
					//res.send(JSON.stringify(data))
					var data=JSON.parse(sres)
					if(data.err){
						
					} else {
						//add cookie						
						var sid=crypto.createHash('sha1')							
						sid.update(data.res.name)
						sid.update(new Date().getTime().toString())
						sid=sid.digest('hex')
						
						sessions.add(data.res.name,sid)
						res.setcookie('sid',sid)
						res.setcookie('user',data.res.name)
						
						console.log('users:',sessions.users)
					}
					res.send(sres)
				})
			}			
		}
	},
	'/logout get':{		
		fn:function(req,res,callback){
			var user=filters.isauth(req,res)
			console.log('logout:',user)
			if(user=='12345'){
				var q=req.query
				console.log('q:',q)
			} else {
				res.end('good try')
			}
			//req.body=JSON.parse(req.data)
		}
	}	
})

sessions.run()
console.log('auth handler loaded')