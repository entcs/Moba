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
		password:'Loikam22'/*,
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
ALTER TABLE seasons MODIFY COLUMN id VARCHAR(255) NOT NULL DEFAULT 'a' AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE seasons MODIFY COLUMN f int(11) primary key;
ALTER TABLE seasons DROP PRIMARY KEY;
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
	},
	query:{
		get:function(req,res){
			connection.query(req.query.query,function(err,qres){
				res.send(JSON.stringify({
					data:qres,
					err:err
				}))
			})
			/*
			connection.query(req.query.query,function(err,qres){
				console.log('exec query:',req.query.query)					
				res.send(JSON.stringify({res:qres}))
			})
			/**/
		}
	}		
}

handle.tables={
	add:{
		post:function(req,res){
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
			console.log('query:',q)
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
	rem:{
		get:function(req,res){
			var q='drop table '+req.query.tablename
			console.log('q:',q)
			connection.query(q,function(err,qres){
				if(err) console.log(err)
				res.send({
					err:err,
					res:q
				})
			})							
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
			console.log('data:',data)
			
			//get existing columns
			var q="show columns from "+data.tablename	
			console.log('q;',q)
			connection.query(q,function(err,qres){						
				console.log('got qres:',q,qres)
				var todel=[],
					toadd=[],
					tomod=[],
					ind
				console.log('here:',qres)
				loop(data.schema,function(i1,field1){
					if(!field1.action){
						field1.action='add'
						toadd.push(field1)
					}
					console.log('here1:',qres)
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
				
				//console.log('todel:',todel.length)
				//console.log('tomod:',tomod.length)
				//console.log('toadd:',toadd.length)
				
				
				var query,
					line
					
				console.log('del:',tomod)	
				if(todel.length){		
					query=['alter table '+data.tablename],
					line=[]						
					loop(todel,function(i,fi){
						line.push('drop column '+fi.Field)
					})						
					query.push(line.join(','))
					query=query.join(' ')+';'
					console.log('query:',query.split(','))						
					connection.query(query,function(err,qres){
						if(err) console.log(err)
					})
				}
				console.log('mod:',tomod)
				if(tomod.length){
					query=['alter table '+data.tablename],
					line=[]
					loop(tomod,function(i,fi){
						line.push(['modify column',fi.Field,fi.Type,fi.Null,fi.Default,fi.Extra].join(' '))
					})
					query.push(line.join(','))
					query=query.join(' ')+';'
					console.log('query:',query.split(','))
					connection.query(query,function(err,qres){
						if(err) console.log(err)
					})
				}
				console.log('add:',toadd)
				if(toadd.length){
					query=['alter table '+data.tablename],
					line=[]
					loop(toadd,function(i,fi){
						line.push(['add column',fi.Field,fi.Type,fi.Null,fi.Default,fi.Extra].join(' '))
					})
					query.push(line.join(','))
					query=query.join(' ')+';'
					console.log('query:',query.split(','))
					connection.query(query,function(err,qres){
						if(err) console.log(err)
					})
				}
				res.send(data)
						
			})	
			/**/
			//res.send(data)
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
				var data={
					list:qres
				}
				res.send(JSON.stringify(data))
			})
		}
	}
}
handle.items={	
	add:{
		post:function(req,res){
			var data=req.body,
				q='insert into '+data.tablename+' set ?',
				columns=[],
				values=[]		

			console.log('items add:',q,data)
			connection.query(q,data.item,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				if(data.want=='list' && !err){
					handle.items.list.get({query:{tablename:data.tablename}},res)
				} else {
					res.send(JSON.stringify(data))
				}
			})
		}
	},
	rem:{
		post:function(req,res){
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
					handle.items.list.get({query:{tablename:data.tablename}},res)
				} else {
					res.send(JSON.stringify(data))
				}
			})				
			//res.send('not handled')
		}
	},
	get:{
		get:function(req,res,callback){
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
	set:{
		post:function(req,res){
			var data=req.body,
				q='UPDATE '+data.tablename+' SET ? '+'where id='+data.item.id
			
			connection.query(q,data.item,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.res=qres
				}					
				if(data.want=='list'){
					handle.items.list.get(req,res)
				} else {
					res.send(JSON.stringify(data))
				}
			})
		}
	},
	list:{
		get:function(req,res){			
			var data=req.query
					
			handle.items.get.get(req,res,function(err,qres){
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
}
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