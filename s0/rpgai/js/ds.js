var ds,
	dnet,
	fs,
	path;
	
(function(){
	var isclient=1;
	if (typeof exports !== 'undefined') {
		dnet=require('dnet.js')	
		fs=require('fs')		
		path=require('path')
		isclient=0	
	}
	ds={
		name: 'ds',
		isclient: isclient,
		stores:{},
		conds: {
			'==': function(v1,v2){
				if (v1==v2) return true;
				return false;
			},
			'!=': function(v1,v2){
				if (v1!=v2) return true;
				return false;
			},
			'<': function(v1,v2){
				if (v1<v2) return true;
				return false;
			},
			'>': function(v1,v2){
				if (v1>v2) return true;
				return false;
			}
		},
		dirname: '',
		mkdir: function(cpath,callback){
			fs.exists(cpath,function(exists){
				if(!exists){
					fs.mkdir(cpath);
				}
				callback(exists);
			})			
		},
		rmdir: function(cpath,callback,onlyfiles){
			onlyfiles=onlyfiles || 0;
			var err;
			fs.readdir(cpath,function(err,files){
				err=err;
				for(var nr in files){
					spath=path.resolve(cpath+'/'+files[nr])					
					console.log('spath:',spath);
					var stats=fs.statSync(spath);
					if (stats.isFile()) {
						fs.unlink(spath, function(err) {
							if (err) console.log('ERR:',err);
						});	
						
						err=err;
					} else {
						ds.rmdir(spath,function(err){});
						err=err;
					}						
				}
			})
			if (!onlyfiles) fs.rmdir(cpath,function(err){});
			if (callback) callback(err)
		},
		handler: function(req,res){			
			var p=unescape(req.url).split('/')[1],
				data='unhandled ds command:'+req.url.substring(1),
				ajaxres=0;

			if(p.indexOf('(')!=-1){
				p=p.split('(')
				var s=p[0].split('.'),
					c=s.pop(),
					a=p[1].substr(0,p[1].length-1)
			
				if (s.length==1){
					if (c=='add'){
						ajaxres=1;
						var cpath=path.resolve(ds.dirname+'/'+s.join('/'),a)
						ds.mkdir(cpath,function(err){	
							res.writeHead(200);
							res.end('added store: '+req.url);									
						})
					} 
					else if (c=='get'){
						ajaxres=1;
						var cpath=path.resolve(ds.dirname+'/ds')
						fs.readdir(cpath,function(err,files){
							data=JSON.stringify(files)
							res.writeHead(200);
							res.end(data);	
						})							
					} 
					else if (c=='rem'){
						ajaxres=1
						var cpath=path.resolve(ds.dirname+'/ds/'+a)
						ds.rmdir(cpath,function(err){
							console.log('err:',err)
							res.writeHead(200);
							res.end('removed store: '+req.url);	
						})							
					}
				} 
				else if (s.length==2){
					if (c=='add'){
						ajaxres=1;
						var cpath=path.resolve(ds.dirname+'/'+s.join('/'),a)
						ds.mkdir(cpath,function(err){	
							res.writeHead(200);
							res.end('added set: '+req.url);									
						})					
					} 
					else if (c=='get'){
						ajaxres=1;
						var cpath=path.resolve(ds.dirname+'/'+s.join('/'))
						fs.readdir(cpath,function(err,files){
							data=JSON.stringify(files)
							res.writeHead(200);
							res.end(data);	
						})							
					} 
					else if (c=='rem'){
						ajaxres=1
						var cpath=path.resolve(ds.dirname+'/'+s.join('/'),a)
						console.log('cpath:',cpath);					
						ds.rmdir(cpath,function(err){
							console.log('err:',err)
							res.writeHead(200);
							res.end('removed set: '+req.url);	
						})					
					}		
				}
				else if (s.length==3){
					if (c=='add'){
						ajaxres=1
						var cpath=path.resolve(ds.dirname+'/'+s.join('/'))
						ds.mkdir(cpath,function(err){							
							var item=JSON.parse(a),
								ext=item.ext || '.json',
								fpath=path.resolve(cpath,item.id+ext);
							fs.writeFile(fpath,a,function(err){
								res.writeHead(200);
								res.end('added item: '+item.id);	
								console.log('added item:',item.id)
							})
						})		
					} 
					else if (c=='get' || c=='rem'){
						ajaxres=1;
						var get=1;
						if(c=='rem') get=0;
						if (a==''){					
							var cpath=path.resolve(ds.dirname+'/'+s.join('/'))
							fs.readdir(cpath,function(err,files){
								if (get) {
									//get keys
									//data=JSON.stringify(files)
									data=[]
									var dat,
										pat;
									for(var nr in files){
										pat=path.resolve(cpath+'/'+files[nr])
										dat=fs.readFileSync(pat,'utf-8')
										data.push(dat)
									}
									data=JSON.stringify(data)
								} else {
									ds.rmdir(cpath,0,1)
									data='rem all items'
								}
								res.writeHead(200);
								res.end(data);	
							})								
						} else {
							//solve cond
							var cond='';
							for(cond in ds.conds){
								if(a.indexOf(cond)!=-1) break;
								cond=''
							}
							if (!cond){//get item by id	
								console.log('rem item:',a)
								var cpath=path.resolve(ds.dirname+'/'+s.join('/'),a+'.json')
								fs.exists(cpath,function(exists){
									if(exists){
										//get
										if (get){
											fs.readFile(cpath, function (err, fdata) {
												if (err) {
													throw err
												} else {
													res.writeHead(200);
													res.end(fdata);											
												};
												
											});
										} else {
											fs.unlink(cpath, function(err) {
												if (err) console.log('ERR:',err);
												res.writeHead(200);
												res.end('removed item: '+a);													
											});																		
										}
									} else {
										res.writeHead(200);
										res.end('item not found:'+a);																				
									}
								})								
							} else {
								var cpath=path.resolve(ds.dirname+'/'+s.join('/')),
									fpath,
									stats,
									fdata='',
									fdat='',
									fobj,
									attr,
									val;
								val=a.split(cond);
								attr=val[0]
								val=val[1]
								fs.readdir(cpath,function(err,files){
									for(var nr in files){
										fpath=path.resolve(ds.dirname+'/'+s.join('/'),files[nr])									
										stats=fs.statSync(fpath);
										if (stats.isFile()) {
											fdat=fs.readFileSync(fpath)					
											fobj=JSON.parse(fdat)	
											if(ds.conds[cond](fobj[attr],val)) {
												//get
												if (get){
													fdata+=fdat
												} else {
													fs.unlink(fpath, function(err) {
														if (err) console.log('ERR:',err);
													});												
												}
												
												//rem
												/*
												/**/
											}
										}																		
									}
									if(!get) fdata='removed items: '+a
									res.writeHead(200);
									res.end(fdata);									

								})							
							}
						}
					} 
					else if (c=='rem'){
						if (a){
						} else {
							console.log(req.url,'rem all items');
							var cpath=path.resolve(ds.dirname+'/'+s.join('/'))
							console.log('rm all items:',cpath);
							ds.rmdir(cpath,0,1)
						}
						
					}		
				}			
			}
			if (ajaxres==0){
				res.writeHead(400);
				res.end(data);	
			}
		},
		genid: function(pre,after){
			pre=pre || '';
			after=after || '';
			var id=pre+(new Date().getTime()+after);
			return id;
		}	
	}
	if (isclient){
		ds.add=function(name,callback){
			dnet.post(['ds','add('+name+')'].join('.'),function(res){
				if (callback) callback(res)
			})
			var store=addstore(name)
			ds.stores[name]=store
			return store
		}
		ds.get=function(callback){
			dnet.post('ds.get()',function(res){
				if (callback) callback(res)
			})			
		},
		ds.rem=function(name,callback){						
			if(typeof(name)=='object'){				
				name=name.name				
			}						
			delete this.stores[name]
			dnet.post(['ds','rem('+name+')'].join('.'),function(res){
				if (callback) callback(res)
			})					
		}
		function addstore(name){
			store={
				name: name,
				sets:{},
				add: function(name,callback){
					//console.log('add set:',name);
					dnet.post(['ds',store.name,'add('+name+')'].join('.'),function(res){
						if (callback) callback(res)
					})		
					var set=addset(name)
					set.store=this
					this.sets[name]=set
					return set
				},
				get: function(callback){
					dnet.post(['ds',this.name,'get('+name+')'].join('.'),function(res){
						if (callback) callback(res)
					})					
				},
				rem: function(name,callback){
					if(typeof(name)=='object'){				
						name=name.name				
					}									
					delete this.sets[name]
					dnet.post(['ds',this.name,'rem('+name+')'].join('.'),function(res){
						if (callback) callback(res)
					})
				}
			}			
			return store
		}
		function addset(name){
			set={
				name:name,
				items:{},
				add:function(item,callback){					
					item.id=item.id || ds.genid()
					console.log('add item:',item,item.id);
					this.items[item.id]=item
					item=JSON.stringify(item)
					dnet.post(['ds',this.store.name,this.name,'add('+item+')'].join('.'),function(res){
						if (callback) callback(res)
					})
				},
				rem:function(query,callback){
					if(typeof(query)=='function'){
						callback=query
						query=''
					}
					if(query!=undefined){
					
					} else {
						query=''
						dnet.post(['ds',this.store.name,this.name,'rem('+query+')'].join('.'),function(res){
							if (callback) callback(res)
						})							
					}					
				},
				get:function(query,callback){
					query=query || '';
					if(typeof(query)=='function'){
						callback=query
						query=''
					}
					dnet.post(['ds',this.store.name,this.name,'get('+query+')'].join('.'),function(res){
						callback(res)
					})							
				}
			}
			return set
		}
	}
	
})()	
if (typeof exports !== 'undefined') {
	ds.dirname=process.cwd();
	for(var key in ds){
		exports[key]=ds[key];
	}
	
}
console.log('loaded ds');
