//basket handler
var appname='basket',
	loop=require(process.cwd()+'/loop.js').loop,
	fs=require('fs'),
	pth=require('path'),	
	mysql=require('mysql'),	
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'',
		database:'basket'
	}),	
	selected={
		base:'',
		table:''
	},
	validatequery=function(str){
		return str
	}

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
				var q='insert into '+name+' set ?',
					data=req.body,
					columns=[],
					values=[]				
				connection.query(q,data.req,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					if(data.want=='list'){
						a.list.get(req,res)
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
					q='DELETE from '+name+' where id='+connection.escape(data.req.id)
				
				connection.query(q,data.req,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					if(data.want=='list'){
						a.list.get(req,res)
					} else {
						res.send(JSON.stringify(data))
					}
				})				
				//res.send('not handled')
			}
		},
		get:{
			get:function(req,res,callback){
				var q='show columns from '+name,
					data={}
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
			},
			post:function(req,res){
				res.send('not handled')
			}
		},
		set:{
			get:function(req,res){
				res.send('not handled')
			},
			post:function(req,res){
				var data=req.body,
					q='UPDATE '+name+' SET ? '+'where id='+connection.escape(data.req.id)
				
				connection.query(q,data.req,function(err,qres){						
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					if(data.want=='list'){
						a.list.get(req,res)
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
			},
			post:function(req,res){
				return g.list.get(req,res)
			}
		}
	}	
	return a
}
var handle={
	seasons:argsl('seasons'),
	leagues:argsl('leagues'),
	games:argsl('games'),
	players:argsl('players'),
	teams:argsl('teams'),
	actions:argsl('actions')	
}
console.log(handle)	
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