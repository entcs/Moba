var fs = require('fs'),
	path=require('path'),
	dns={
		load: function (name){
			dns.modules[name]=require(name);
			var fpath='./node_modules/'+name+'.js';
			fs.unwatchFile(fpath);
			fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
				if (curr.mtime!=prev.mtime){					
					delete require.cache[path.resolve(__dirname, fpath)];
					dns.modules[name]=require(name);
				}
			});	
			return dns.modules[name];
		},
		drop: function(name){
			var fpath='./node_modules/'+name+'.js';
			fs.unwatchFile(fpath);
			delete require.cache[path.resolve(__dirname, fpath)];
			delete dns.modules[name];
			console.log('dropped module:',name);	
		},
		log: function(){
			var list=['server has modules:']
			for(var key in dns.modules){
				list.push(key);
			}
			return list.join('\n');
		},
		contenttype: {
			'html': { 'Content-Type':'text/html'},
			'js':   { 'Content-Type':'text/javascript'},
			'css':  { 'Content-Type':'text/css'},
			'png':  { 'Content-Type':'image/png'},
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
		sethandler: function(str){			
			var p=str.split('.'),
				module=dns.modules[p[0]],
				mes='ok';
				
			if(module){
				var fn=module[p[1]];
				if(fn){
					dns.handler=fn;
					dns.sethandlerstr=str;
				} else {
					mes='module function not found: '+p[1];
				}
			} else {
				mes='module not found: '+p[0];				
			}
			return mes;
		},		
		modules:{},
		dirname: __dirname
	},
	handler=function(req,res){		
		var p=req.url.split('/'),
			inner=0,
			mes='handled inner:'+p[1];
		if (p[1]=='load'){
			dns.load(p[2])
			inner=1;
		} 
		else if(p[1]=='drop'){
			dns.drop(p[2])
			inner=1;
		} 
		else if(p[1]=='log'){
			mes=dns.log()
			inner=1;
		} 
		else if(p[1]=='sethandler'){
			var mes=dns.sethandler(p[2],req,res)
			if(mes!='ok') {
				res.writeHead(404);
				res.end(mes);
			}
			inner=1;
		} 
		
		if(inner==0){
			if (req.url=='/') req.url='/index.html';
			
			ext=dns.extname(req.url);	
			
			if (dns.contenttype[ext]){
				fs.readFile(path.resolve(__dirname+req.url), function (err, data) {
					if (err) {
						res.writeHead(404,{ 'Content-Type':'text/html'});
						res.end('Error loading: '+req.url,'utf-8');				
					} else {
						
						var cpath=req.url.split('/'),
							plen=cpath.length,
							ctype=cpath[plen-1].split();
						
						//ds load
						if (cpath[plen-1]=='ds.js'){
							dns.load('ds');
							fs.mkdir(path.resolve(__dirname+'/ds'));								
						}						
						res.writeHead(200,dns.contenttype[dns.extname(req.url)]);
						res.end(data,'utf-8');
					}
				});	
			} 
			else {				
				//ds				
				if(p[1].substr(0,2)=='ds' && dns.modules.ds){
					dns.modules.ds.handler(req,res)
				//action
				} else if (dns.handler){
					dns.handler(req,res);
				//not handled
				} else {
					res.writeHead(200);
					res.end('handler not defined:'+p[1]);
				}
				
			}
		} 
		else {
			res.writeHead(200);
			res.end(mes);
		}
	},
	app = require('http').createServer(handler)/*,
	io = require('socket.io').listen(app);

io.set('log level', 1);	/**/
app.listen(2222);
/*
var rh=dns.load('rhandler');
dns.handler=rh.handler;
/**/
console.log('SERVER STARTED');