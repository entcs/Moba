var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	Net=require('net.js'),
	ds=require('datastore.js'),
	fs = require('fs'),
	contenttype=  {
		'html': { 'Content-Type':'text/html'},
		'js':   { 'Content-Type':'text/javascript'},
		'css':  { 'Content-Type':'text/css'},
		'png':  { 'Content-Type':'image/png'}
		
	};

io.set('log level', 1);
app.listen(8080);
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
		console.log('resource req:',req.url);
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
	//action
	} else {
		var parts=req.url.split('/');
		console.log('parts:',parts);
		switch(parts[1]){
			case 'DS':
				console.log('datastore command',parts);
				res.writeHead(200);
				res.end('datastore command:'+req.url.substring(1));									
				break;
			default:
				res.writeHead(200);
				res.end(req.url.substring(1));					
				break;
		}
	}
	/**/
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
console.log('SERVER STARTED');