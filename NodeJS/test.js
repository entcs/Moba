var http=require('http'),	
	dns=require('./dom0/dns.js'),
	app = http.createServer(dns.handler),
	timer=dns.load('/dom0/loop.js')

var port=2222
app.listen(port);
console.log('SERVER STARTED: '+port);