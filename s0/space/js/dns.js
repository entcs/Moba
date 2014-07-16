//dynamic node server - updates modules on change
var fs=require('fs')		
	path=require('path'),
	http = require('http'),
	dirname=process.cwd(),
	dns={
		load: function (name,callback){
			var fpath=path.resolve(dirname+name)
			dns.modules[name]=require(fpath)
			if(callback) {
				callback(dns.modules[name])
				dns.callbacks[name]=callback
			}
			
			fs.unwatchFile(fpath);
			fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
				if (curr.mtime!=prev.mtime){										
					delete require.cache[fpath];
					dns.modules[name]=require(fpath)
					if(callback) {
						callback(dns.modules[name])
						dns.callbacks[name]=callback
					}
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
		callbacks:{},
		customhandler:0,
		defaulthandler: function(req,res){
			if(req.url=='/') {
				req.url='/index.html'
			}
			var rp=path.resolve(dirname+req.url)			
			fs.readFile(rp, function (err, data) {
				//resourse not found
				if (err) {
					if(dns.customhandler){
						dns.customhandler(req,res)
					}else{
						res.writeHead(400)
						res.end('app.sethandler(fn) not set','utf-8')						
					}
				} else {							
					res.writeHead(200,dns.contenttype[dns.extname(req.url)])
					res.end(data,'utf-8')
				}
			})	
		},
		listen:function(port){
			var s=null
			if(port){
				s=http.createServer(dns.defaulthandler)
				s.sethandler=function(fn){
					dns.customhandler=fn.handler
				}
				s.listen(port)
				console.log('server listen:',port)
				return s
			}else{
				console.log('dns.listen(port), port nr missing')
				return s
			}
		}
	}
for(var key in dns){
	exports[key]=dns[key];
}
	
console.log('loaded dns');	