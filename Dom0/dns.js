//dynamic node server - updates modules on change
var fs=require('fs')		
	path=require('path'),
	dirname=process.cwd(),
	app=0,
	dns={
		load: function (name){
			var fpath=path.resolve(dirname+name)
			dns.modules[name]=require(fpath);
			fs.unwatchFile(fpath);
			fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
				if (curr.mtime!=prev.mtime){										
					delete require.cache[fpath];
					dns.modules[name]=require(fpath);
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
		sethandler:function(name){
			
		},
		start:function(port){
			port=port || 2222
			app = require('http').createServer(dns.handler)				
			app.listen(port)
			return app
		},
		handler: function(req,res){
			if(req.url=='/') req.url='/index.html'
			//json or resource
			var json,
				rp
			try{
				json=JSON.parse(req.url.substr(1))
				dns.handlejson(req,res,json)
			} catch (err){
				rp=path.resolve(dirname+req.url)
				dns.handleresources(req,res,rp)
			}
			
			
			
			/*
			if(req.url=='/') {
				req.url='/index.html'
			}
			var rp=path.resolve(dirname+req.url)			
			fs.readFile(rp, function (err, data) {
				//resourse not found
				if (err) {
					var json
					try {
						json=JSON.parse(req.url.substr(1))
						if(json.type){
							dns.handle('auth',function(req,res,json){
								
							})
						}
						
					} catch (err){
						//not json
						res.writeHead(400)
						res.end('Request is not json: '+req.url)
					}
					if (json){
						res.writeHead(200)
						res.end('Request is json: '+req.url)						
					}				
				} else {							
					res.writeHead(200,dns.contenttype[dns.extname(req.url)])
					res.end(data,'utf-8')
				}
			})
			/**/
		},
		handleresources:function(req,res,rp){
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
			if(app && app.handler){
				app.handler(req,res,json)
			} else {
				res.writeHead(400)
				res.end('no handler set','utf-8')				
			}
		}
	}
for(var key in dns){
	exports[key]=dns[key];
}
	
console.log('loaded dns');	