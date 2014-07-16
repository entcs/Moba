var fs = require('fs'),
	http = require('http'),
	socketio = require('socket.io'),
	path=require('path'),
	fpath=path.resolve(__dirname+'/sshandler.js'),
	loop=require('loop.js').loop,
	server,
	io
function run(){
	gethandler()
	server = http.createServer(handler.handler.http)
	server.listen(1234, function() {
		console.log('Listening at: http://localhost:1234')
	})
	server.on('error',handler.handler.error)

	io=socketio.listen(server)
	io.on('connection', handler.handler.socket)	
}
function stop(){
	loop(io.sockets.sockets,function(i,socket){
		socket.disconnect()
	})
	server.close()
}
function gethandler(){
	try{
		handler=require(fpath)	
	} catch(err){
		console.log(err.stack)
	}	
}
fs.watch(fpath, function (e, filename) {	
	delete require.cache[fpath]
	try{
		//handler=require(fpath)	
		stop()
		run()
	} catch(err){
		console.log(err.stack)
	}
})
run()
/*
var handler={
	http:function(req,res){
		console.log('req:')
		res.writeHead(200, { 'Content-type': 'text/html'})
		res.end(fs.readFileSync(__dirname + '/ss.html'))
	},
	socket:function (socket) {		
		socket.on('message', function (msg) {
			console.log('Message Received: ', msg)
			socket.broadcast.emit('message', msg)
		})
	},
	error:function(e){
		console.log('error',e)
	}
}
/**/
