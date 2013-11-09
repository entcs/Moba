//base handler
var appname='base',
	loop=require(process.cwd()+'/loop.js').loop,
	fs=require('fs'),
	pth=require('path'),
	ARGSL=['add','rem','get','set','list'],
	mysql=require('mysql'),	
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'',
		database:'test'
	}),
	selected={
		base:'test',
		table:''
	},
	validatequery=function(str){
		return str
	}
	
var handle={}

handle.bases={
		list:{
			get:function(req,res){				
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
		use:{
			get:function(req,res){
				var query=validatequery('use '+req.query.base)
				//console.log('query:',query)
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
		}
	}
/**/
handle.tables={
		add:{
			get:function(req,res){				
				var query="show columns from "+req.query.table
				//console.log(query)
				connection.query(query,function(err,qres){						
					res.send(JSON.stringify(qres))
				})								
			},
			post:function(req,res){
				res.send(req.url)
			}
		},
		get:{
			get:function(req,res){
				var query="show columns from "+req.query.table
				//console.log(query)
				connection.query(query,function(err,qres){						
					res.send(JSON.stringify(qres))
				})	
			},
			post:function(req,res){
				res.send(req.url)
			}
		},
		set:{
			get:function(req,res){
				res.send(req.url)
			},
			post:function(req,res){
				res.send(req.url)
			}
		},
		list:{
			get:function(req,res){				
				connection.query("show tables",function(err,qres){						
					res.send(JSON.stringify(qres))
				})
			}
		}
	}
/**/	
exports.handler=function(req,res){	
	if(req.url=='' || req.url=='/'){
		req.url='/index.html'
	}
	var //parts=req._parsedUrl.pathname.split('/'),
		parts=req.url.split('?')[0].split('/'),
		//appname=parts[1],
		controller=parts[1],
		action=parts[2]
		query=req.query,
		method=req.method.toLowerCase(),
		hres='not handled',
		referer=req.headers.referer		
	
	//file
	var path=pth.resolve([__dirname,req.url].join('/'))		
	if(fs.existsSync(path) && fs.statSync(path).isFile()){
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