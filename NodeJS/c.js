var socket = io.connect('http://localhost:8080');
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
	d.body.add('div').add('button',{
		html: 'require/dnet',		
		onclick: function(){				
			dnet.post(this.innerHTML)/*,function(e){					
				if (e.readyState==4 && e.status==200){
					console.log('res:',e.response);
				}/**/				
		}
	})			
	d.body.add('div').add('button',{
		html: 'drop/dnet',		
		onclick: function(){				
			dnet.post(this.innerHTML)				
		}		
	})			
	
})