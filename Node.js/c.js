﻿var socket = io.connect('http://localhost:8080');
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});
socket.on('echo', function (data) {
	document.getElementById('res').innerHTML=data;
});
function send(method){
	var but=document.getElementById('but'),
		inp=document.getElementById('inp');
	Net.get(inp.value,function(){
		console.log('req:', unescape(this.responseText));
	})
}

function sendsock(){
	socket.emit('echo', document.getElementById('inp1').value);
}

//dom0
document.onready(function(){
	var div=document.body.add('div'),
		inp=div.add('input',{
			id: 'inp',
			value: 'DS/users'
		})
	div.add('button',{
		id: 'but',
		html: 'add',		
		onclick: function(){
			Net.post(inp.value,function(){
				console.log('posted:',inp.value,arguments);
			})
		}
	})		
	div.add('button',{
		id: 'but',
		html: 'rem'
	})				
})
/**/
/*
document.onready(function(){
	console.log('document ready');
});
/**/
