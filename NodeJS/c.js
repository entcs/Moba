﻿//var socket = io.connect('http://localhost:8080');
/*
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});
socket.on('echo', function (data) {
	document.getElementById('res').innerHTML=data;
});

function sendsock(){
	socket.emit('echo', document.getElementById('inp1').value);
}
/**/



var d=document;
d.on('ready', function(){
	console.log('Document ready');
	
	dnet.post('load/sapp')
	dnet.post('sethandler/sapp.handler')
	
	ds1=ds.add('ds1')
	users=ds1.add('users')
	users.add({
		name: 'user1'
	})
	users.add({
		id:'user1',
		name: 'user2'
	})
	
	a=ds1.sets.users.items
	console.log(a);
	users.get('name==user1')
	console.log(users.get('user1'));
	users.rem('name==user1')
	console.log(a);
	/*,
		users=ds1.add('users');
	
	users.add({
		name: 'user1',
		satus: 'afk'
	})
	
	/**/
	
	//dnet.post('load/ds')
	d.body.add('input',{
		value: "ds.ds1.get()",
		onkeypress:	function(e){
			if(e.keyCode==13) {
				dnet.post(this.value,function(req){					
					div.innerHTML=req.response.replace(/[\n]/g,'<br>');
					//console.log('div:',div,req.response)
				});
				//this.value='';
			}
		}
	},'last');
	var div=d.body.add('div');
	
	
	
})