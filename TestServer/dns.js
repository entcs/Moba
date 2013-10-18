//dynamic node server
var fs=require('fs')		
	path=require('path'),	
	loop=require('./loop.js').loop,
	http=require('http'),
	open=require('./open.js').open
	
	dns={
		path:process.cwd(),
		app:false,
		sockets:[],
		contenttype: {
			'html': { 'Content-Type':'text/html'},
			'js':   { 'Content-Type':'text/javascript'},
			'css':  { 'Content-Type':'text/css'},
			'png':  { 'Content-Type':'image/png'},
			'jpg':  { 'Content-Type':'image/jpeg'},
			'ico':  { 'Content-Type':'image/gif'},
			'gif':  { 'Content-Type':'image/gif'}
			
		},	
		extname: function (url){
			var p=url.split('/'),
				lp=p[p.length-1];
			p=lp.split('.');
			lp=p[p.length-1];	
			return lp;
		},		
		sethandler:function(fn){			
			//dns.handlername=name
			dns.handler=fn//dns.load(name).handler
			//dns.handler=open(name).handler
		},
		start:function(port,handler){			
			port=port || 2222
			
			this.app = require('http').createServer(this.defaulthandler)
			this.app.listen(port)
			this.app.on('connection',function(socket){
				socket.on('close', function () {
					dns.sockets.splice(dns.sockets.indexOf(socket), 1)
				});				
				dns.sockets.push(socket)
			})
			console.log('dns started at:',port)
		},
		close:function(callback){
			//force close sockets
			loop(this.sockets,function(i,socket){
				socket.destroy()
			})
			this.app.close(function(){									
				console.log('dns closed')
			})			
		},
		defaulthandler: function(req,res){			
			var method=req.method.toLowerCase(),
				json,
				ajax=req.headers['x-requested-with'] || false
			try{
				json=JSON.parse(unescape(req.url.substr(1)))
			} catch (err){					
				json=false
			}			
			console.log('method:',method)
			console.log('is json:',json)			
			if(!json) console.log('req url:',req.url)
			console.log('is ajax:',ajax)
			console.log('-------------------------')
			if(method=='post'){
				//json only
				var body = '';
				req.on('data', function (data) {
					body += data;
					// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
					if (body.length > 1e6) { 
						// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
						req.connection.destroy();
					}
				})
				req.on('end', function () {
					try{
						json=JSON.parse(unescape(body))
						dns.handlejson(req,res,json)
					} catch (err){
						res.writeHead(400)
						res.end('post data not json','utf-8')							
					}
				})
			} 
			else if (method=='get') {
				if(json){
					dns.handlejson(req,res,json)
				} else {
					dns.handleresources(req,res)
				}
			}
		},
		handleresources:function(req,res){			
			if(req.url=='/') req.url='/index.html'					
			var rpath=path.resolve(dns.path,'resources'+req.url)			
			fs.readFile(rpath, function (err, data) {
				if (err) {
					res.writeHead(404,dns.contenttype[dns.extname(req.url)])
					res.end('Not found: '+req.url,'utf-8')				
				} else {					
					res.writeHead(200,dns.contenttype[dns.extname(req.url)])
					res.end(data,'utf-8')
				}
			})				
		
		},
		handlejson:function(req,res,json){									
			if(json.type=='fs'){
				var fn=dns.fs[json.action],
					data='no result'
				if(fn){
					data=fn(json.path,json.data)
					if(typeof(data)=='object'){
						data=JSON.stringify(data)
					}
				}				
				res.writeHead(200)
				res.end(data,'utf-8')								
			} else {
				if(dns.handler){
					console.log('here')
					dns.handler(req,res,json)
				} else {
					console.log('here2')
					res.writeHead(400)
					res.end('dns.handler not set','utf-8')				
				}
			}
		},
		fs:{
			rem:function(fpath) {
				if(fpath){
					if(fs.statSync(fpath).isDirectory()){
						var files = fs.readdirSync(fpath)
						loop(files,function(i,file){
							var curPath = path.resolve(fpath,file)
							if(fs.statSync(curPath).isDirectory()) {
								dns.fs.rem(curPath)
							} else {
								fs.unlinkSync(curPath)
							}
						})			
						fs.rmdirSync(fpath)
					} else {
						if(fpath.split('/').length>1){
							fs.unlinkSync(fpath)
						}
					}
				}
				return 'fs rem'
			},
			add:function(fpath,fdata){				
				if(fpath){
					var dirs=fpath.split('/'),
						paths=[],
						cpath=dns.path,
						len=dirs.length-1
						
					loop(dirs,function(i,dir){
						cpath=path.resolve(cpath,dir)
						if(len==i && dir.indexOf('.')!=-1){							
							if(fdata && typeof(fdata)=='object'){
								fdata=JSON.stringify(fdata)
							}
							fs.writeFileSync(cpath,fdata || '')
						} else if(!fs.existsSync(cpath)){
							fs.mkdirSync(cpath)
						}
					})
				}
				return 'fs add'
			},			
			get:function(fpath){
				var names=[]
				if(fs.existsSync(fpath)){
					if(fs.statSync(fpath).isDirectory()){
						names=fs.readdirSync(fpath)
					} else {
						names=fs.readFileSync(fpath,'utf-8')
					}
				}
				return names
			},
			getfiles:function(fpath){
				var files=[]
				if(fs.existsSync(fpath)){
					if(fs.statSync(fpath).isDirectory()){
						var names=fs.readdirSync(fpath)
						loop(names,function(i,name){
							files.push(fs.readFileSync(path.resolve(fpath,name),'utf-8'))
						})
					}
				}
				return files
			},			
		},		
		apps:{},
		loadapps:function(){
			var apath=path.resolve(this.path,'apps')
			if(fs.existsSync(apath)){
				var names=fs.readdirSync(apath),
					hpath
				loop(names,function(i,name){
					dns.apps[name]={
						handler:0
					}
					hpath=path.resolve(apath,name+'/'+'handler.js')
					if(fs.existsSync(hpath)){
						open('apps/'+name+'/handler.js',function(o){
							dns.apps[name].handler=o
						})
					}
				})
				console.log(dns.apps)
			}
		}
	}	
dns.loadapps()	
for(var key in dns){
	exports[key]=dns[key];
}
console.log('loaded dns123')