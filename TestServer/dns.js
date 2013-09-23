//dynamic node server - updates modules on change
var fs=require('fs')		
	path=require('path'),
	dirname=process.cwd(),
	loop=require('./loop.js').loop,	
	dns={
		open:function(opath,fn){
			var fpath=path.resolve(dirname,opath)				
			fs.readFile(fpath,'utf-8', function (err, data) {
				if (err) throw err
				fn(data)
			})				
			fs.unwatchFile(fpath)			
			fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
				if (curr.mtime!=prev.mtime){
					console.log('dif:',fpath)
					fs.readFile(fpath,'utf-8', function (err, data) {
						if (err) throw err
					    fn(data)
					})
				}
			});				
		},
		require:function(name,fn){
			var fpath=path.resolve(dirname,name),
				module=require(fpath)
			if(fn!=undefined){
				fn(module)
			}
			//dns.modules[name]=module
			fs.unwatchFile(fpath);
			fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
				if (curr.mtime!=prev.mtime){										
					delete require.cache[fpath];
					module=require(fpath)
					if(fn!=undefined){
						fn(module)
					}					
					//dns.modules[name]=module
				}
			});	
			return module
		},
		load: function (name,fn){
			var fpath=path.resolve(dirname,name),
				module=require(fpath)
			if(fn!=undefined){
				fn(module)
			}
			dns.modules[name]=module
			fs.unwatchFile(fpath);
			fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
				if (curr.mtime!=prev.mtime){										
					delete require.cache[fpath];
					module=require(fpath)
					if(fn!=undefined){
						fn(module)
					}					
					dns.modules[name]=module
				}
			});	
			return dns.modules[name];
		},
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
		modules:{},
		handlername:'',
		sethandler:function(fn){			
			//dns.handlername=name
			dns.handler=fn//dns.load(name).handler
			//dns.handler=open(name).handler
		},
		start:function(port){
			port=port || 2222
			var app = require('http').createServer(dns.defaulthandler)							
			app.listen(port)
			console.log('dns started at:',port)
			return app
		},
		defaulthandler: function(req,res){
			if(req.url=='/') req.url='/index.html'
			//json or resource
			var json,
				rp
				
			try{
				json=JSON.parse(unescape(req.url.substr(1)))
			} catch (err){
				rp=path.resolve(dirname+req.url)
				dns.handlefiles(req,res,rp)
			}
			if(json) dns.handlejson(req,res,json)
		},
		handlefiles:function(req,res,rp){
			//dir permissions todo			
			fs.readFile(rp, function (err, data) {
				//resourse not found
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
			if(dns.handler){
				dns.handler(req,res,json)
			} else {
				res.writeHead(400)
				res.end('dns.handler not set','utf-8')				
			}
		},

	}
	//dns.loaddump()
	
for(var key in dns){
	exports[key]=dns[key];
}
console.log('loaded dns 2224')