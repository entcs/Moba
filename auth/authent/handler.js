//auth handler
var appname='auth',
	crypto=require("crypto"),
	loop=require(process.cwd()+'/loop.js').loop,
	fs=require('fs'),
	pth=require('path'),	
	mysql=require('mysql'),	
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'Loikam22',
		database:'auth'
	})
/*	
var hash=crypto.createHash('sha512')
hash.update('add the pasw 111111111111111111')
hash.update('add the salt')
var res=hash.digest("hex")
console.log(res.length,res)
	/**/
	
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
				var data=req.body,
					item=data.item,
					q='insert into '+name+' set ?',
					columns=[],
					values=[]		

				console.log('items add:',q,item.pasw)
				//add salt
				var hash=crypto.createHash('sha1')
				hash.update(new Date().getTime()+'a')
				hash.update(new Date().getTime()+'b')
				item.salt=hash.digest("hex")
				
				hash=crypto.createHash('sha512')				
				hash.update(item.pasw)
				hash.update(item.salt)				
				item.pasw=hash.digest("hex")
				
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
				console.log(q)
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
var handle={}
handle.users={
	login:{
		post:function(req,res,callback){
			var data=req.body
			console.log('data:',data)
			var	pasw=data.pasw,
				url=data.url,
				name=data.name,
				q=[
					"select * from users where name='",
					data.name.replace(/['"]/g, ""),
					"'"
				].join('')
				
			//console.log(q)
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
						//console.log(pasw)
						//console.log(item.pasw)
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
	register:{
		post:function(req,res){
			var data=req.body,
				item=data.item,
				q='insert into users set ?',
				columns=[],
				values=[]		

			//console.log('items add:',q,item.pasw)
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
			
			console.log(item)
			console.log(q)
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
	
	//file
	var path=pth.resolve([__dirname,req.url].join('/'))		
	if(fs.existsSync(path) && fs.statSync(path).isFile()){
		console.log('send file:',path)
		res.sendfile(path)
	} else {
	//action
		if(controller in handle){
			//console.log(action,controller)
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
	}
}