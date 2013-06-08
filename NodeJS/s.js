var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),	
	//ds=require('ds.js').ds,	
	fs = require('fs'),
	path=require('path'),
	dn=require('dn.js').dn,
	contenttype=  {
		'html': { 'Content-Type':'text/html'},
		'js':   { 'Content-Type':'text/javascript'},
		'css':  { 'Content-Type':'text/css'},
		'png':  { 'Content-Type':'image/png'}
		
	};

io.set('log level', 1);
app.listen(8080);
var dnet,
	ds,
	sapp;
	
//dn.watch(dnet,'dnet.js')
//dn.watch(ds,'ds.js')
dn.watch('sapp.js')
function handler (req, res) {	
	if(dn.sapp){
		console.log(dn.sapp.mes);
		dn.sapp.handler(req,res);
	} else {
		res.writeHead(404);
		res.end('not there');		
	}
	/*
	req.url='/index.html';
	res.writeHead(200);
	res.end('hello');	
	fs.readFile(__dirname + req.url, function (err, data) {
		if (err) {
			res.writeHead(404,{ 'Content-Type':'text/html'});
			res.end('Error loading: '+req.url,'utf-8');				
		} else {
			var path=req.url.split('/'),
				plen=path.length,
				ctype=path[plen-1].split();
				
			res.writeHead(200,contenttype[extname(req.url)]);
			res.end(data,'utf-8');
		}
	});	
	/**/
}	
/*
fs.watchFile('./node_modules/upd.js', function (curr, prev) {
	if (curr.mtime!=prev.mtime){
		console.log('file changed');
		delete require.cache[path.resolve(__dirname, 'node_modules\\upd.js')];
		upd=require('upd.js').upd;
	}
});
/**/


/*
function extname(url){
	var p=url.split('/'),
		lp=p[p.length-1];
	p=lp.split('.');
	lp=p[p.length-1];	
	return lp;
}
var path,ext;
function handler (req, res) {
	if (req.url=='/') req.url='/index.html';
	ext=extname(req.url);	
	if (contenttype[ext]){
		//console.log('resource req:',req.url);
		fs.readFile(__dirname + req.url, function (err, data) {
			if (err) {
				res.writeHead(404,{ 'Content-Type':'text/html'});
				res.end('Error loading: '+req.url,'utf-8');				
			} else {
				var path=req.url.split('/'),
					plen=path.length,
					ctype=path[plen-1].split();
					
				res.writeHead(200,contenttype[extname(req.url)]);
				res.end(data,'utf-8');
			}
		});	
	} 
	else {//action		
		var parts=req.url.split('/');
		console.log('parts:',parts);
		switch(parts[1]){
			case 'ds':				
				switch(parts[2]){
					//A-R-G-S
					case 'add':						
						break;
					case 'rem':
						break;
					case 'get':
						break;
					case 'set':
						break;
				}
					
				console.log('action:',parts[2],req.url);
				res.writeHead(200);
				res.end('datastore command:'+req.url.substring(1));									
				break;
			case 'require':
				console.log('require:',parts[2]);
				dn[parts[2]]=require(parts[2]+'.js')[parts[2]];				
				break;
			case 'drop':				
				//delete( require.cache[__dirname+'\\'+parts[2]] );
				console.log('drop:',parts[2]);
				delete( require.cache['c:\\Documents and Settings\\hendrik\\My Documents\\GitHub\\Moba\\Node.js\\dnet.js'] );
				//delete dn[parts[2]]
				//delete( require.cache['D:\\hendrik\\WEB\\NODEJS\\server\\data\\'+parts[2]+'.js'] );
				break;
			default:
				res.writeHead(200);
				res.end(req.url.substring(1));					
				break;
		}
	}
}

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		//console.log(data);
	});
	socket.on('echo', function (data) {
		socket.emit('echo', data);
	});
});
/**/
console.log('SERVER STARTED');