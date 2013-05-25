var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	util=require('util.js'),
	fs = require('fs'),
	contenttype=  {
		'html': { 'Content-Type':'text/html'},
		'js':   { 'Content-Type':'text/javascript'},
		'css':  { 'Content-Type':'text/css'},
		'png':  { 'Content-Type':'image/png'}
		
	}
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
	console.log('req url:',req.url,contenttype[ext]);
	if (contenttype[ext]){				
		//if (req.url=='/') req.url='/index.html';
		fs.readFile(__dirname + req.url, function (err, data) {
			if (err) {
			  res.writeHead(500);
			  return res.end('Error loading index.html');
			} else {
				var path=req.url.split('/'),
					plen=path.length,
					ctype=path[plen-1].split();
					
				res.writeHead(200,contenttype[extname(req.url)]);
				res.end(data,'utf-8');
			}
		});
	}
	/**/
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});