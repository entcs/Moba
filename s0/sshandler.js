var fs = require('fs'),
	users=[],
	sockets=[],
	actions={},
	filters={}
	

exports.handler={
	http:function(req,res){
		console.log('req:')
		res.writeHead(200, { 'Content-type': 'text/html'})
		res.end(fs.readFileSync(__dirname + '/ss.html'))
	},
	socket:function (socket) {		
		socket.on('message', function (msg) {
			console.log('Message Received3: ', msg)
			socket.broadcast.emit('message', msg)
		})
	},
	error:function(e){
		console.log('error',e)
	}
}
console.log('update123')
