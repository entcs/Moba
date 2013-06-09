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
	dnet.post('load/sapp')
	dnet.post('sethandler/sapp.handler')		
	d.body.add('input',{
		onkeypress:	function(e){
			console.log(e.keyCode);
			if(e.keyCode==13) {
				dnet.post(this.value,function(req){
					
					div.innerHTML=req.response.replace(/[\n]/g,'<br>');
					console.log('div:',div,req.response)
				});
				this.value='';
			}
		}
	},'last');
	var div=d.body.add('div');
	
	
	
})