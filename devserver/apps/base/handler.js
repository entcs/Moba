//base handler
var appname='base',
	loop=require(process.cwd()+'/loop.js').loop,
	fs=require('fs'),
	pth=require('path'),	
	mysql=require('mysql'),	
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:''/*,
		database:'basket'/**/
	}),
	selected={
		base:'',
		table:''
	},
	validatequery=function(str){
		return str
	}

/*
ALTER TABLE seasons CHANGE id id INT(10)AUTO_INCREMENT PRIMARY KEY;
/**/
	
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
		add:{
			post:function(req,res){
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
		rem:{
			post:function(req,res){
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
		}
		
	}
/**/
handle.tables={
		add:{
			post:function(req,res){
				var data=req.body,
					query,
					line
				line=[]	
				query=['create table '+data.table],				
				loop(data.columns,function(i,fi){					
					line.push([fi.Field,fi.Type,fi.Extra].join(' '))
				})				
				query.push('('+line.join(',')+')')
				query=query.join(' ')+';'
				console.log('query:',query)
				connection.query(query,function(err,qres){
					if(err) console.log(err)
				})
				res.send('added new table')
			}
		},
		rem:{
			post:function(req,res){
				var query='drop table '+req.body.table
				console.log('query:',query)
				connection.query(query,function(err,qres){
					if(err) console.log(err)
				})				
				res.send('drop table')
			}
		},
		get:{
			get:function(req,res){
				var query="show columns from "+req.query.table
				//console.log(query)
				connection.query(query,function(err,qres){						
					res.send(JSON.stringify(qres))
				})	
			}
		},
		set:{
			post:function(req,res){
				var data=req.body
				//get existing columns
				var query="show columns from "+data.table				
				connection.query(query,function(err,qres){						
					var todel=[],
						toadd=[],
						tomod=[],
						ind
					loop(data.columns,function(i1,field1){
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
					/*
					console.log('todel:',todel.length)
					console.log('tomod:',tomod.length)
					console.log('toadd:',toadd.length)
					/**/
					
					var query,
						line
						
					if(todel.length){		
						query=['alter table '+data.table],
						line=[]						
						loop(todel,function(i,fi){
							line.push('drop column '+fi.Field)
						})						
						query.push(line.join(','))
						query=query.join(' ')+';'
						console.log('query:',query)						
						connection.query(query,function(err,qres){
							if(err) console.log(err)
						})
					}
					console.log(tomod)
					if(tomod.length){
						query=['alter table '+data.table],
						line=[]
						loop(tomod,function(i,fi){
							line.push(['modify column',fi.Field,fi.Type,fi.Extra].join(' '))
						})
						query.push(line.join(','))
						query=query.join(' ')+';'
						console.log('query:',query)
						connection.query(query,function(err,qres){
							if(err) console.log(err)
						})
					}
					
					if(toadd.length){
						query=['alter table '+data.table],
						line=[]
						loop(toadd,function(i,fi){
							line.push(['add column',fi.Field,fi.Type,fi.Extra].join(' '))
						})
						query.push(line.join(','))
						query=query.join(' ')+';'
						console.log('query:',query)
						connection.query(query,function(err,qres){
							if(err) console.log(err)
						})
					}
					
					res.send('alter table')
				})					

			}
		},
		tabledata:{
			get:function(req,res){
				var table=req.query.table
				connection.query('select * from '+table,function(err,qres){						
					res.send(JSON.stringify(qres))
				})				
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
console.log('handle:',handle)	
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