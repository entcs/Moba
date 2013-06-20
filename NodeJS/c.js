//var socket = io.connect('http://localhost:8080');
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

var d=document,
	gmap,
	db;
d.on('ready', function(){
	console.log('Document ready');
	db=document.body;
	
	d.body.on('show',function(e){
		console.log('body show');
	})
	d.body.on('hide',function(e){
		console.log('body hide');
	})
	
	d.body.set({
		style:{
			margin: 0
		}
	})
	dnet.post('load/sapp')
	dnet.post('sethandler/sapp.handler')

	d.body.add('div',{
		style:{
			'text-align': 'center'
		}
	}).add('div',{
		id: 'logo',
		html: 'Tëëkond',
		style:{
			'font-family': 'Jolly Lodger',
			'font-size': '76px',
			color:'#6C8541',
			margin: '0 auto'
		}
	})
			
	
	var nav=d.body.add('div',{
		style:{
			'text-align':'center',
			'padding':'10px 30px',
			border: '2px solid #6C8541',
			'border-radius': '64px',
			margin: '10px auto',
			display: 'table'
		}
	});
	var but;
	loop(8,function(){
		but=nav.add('div',{
			'class':'but',
			style: {
				width: '64px',
				height: '64px',
				'border-radius':'74px',
				'background-color':'#6C8541',
				border:'32px solid #9EC261',
				display: 'inline-block',
				cursor: 'pointer',
				margin: '5px',
				'box-sizing':'border-box',
				'vertical-align' : 'top',
				'-webkit-transition': 'all 0.5s'
			}
		})	
		but.onmouseover=function(){
				this.set({
					style: {
						'border-width': '3px'
					}
				})
			}
		but.onmouseout=function(){
				this.set({
					style: {
						'border-width': '32px'
					}
				})
			}
	
	})		

	
	var initmap=function(){		
		d.body.add('div').add('div',{
			style:{
				padding: '10px',
				margin: '50px',
				'border-radius': '15px',
				border: '2px solid #6C8541',
				width: '512px',
				height: '512px',
				margin: '0px auto'
			}
		}).add('div',{
			id: 'gmap',
			style: {
				width: '100%',
				height: '100%'
			}
		})


		function initialize() {
			var mapOptions = {
				center: new google.maps.LatLng(58.37840540413009, 386.7269734802246),
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			};
			gmap = new google.maps.Map(document.getElementById("gmap"),mapOptions);
		}
		google.maps.event.addDomListener(window, 'load', initialize);
	}();
	/**/
	/*
	var ds1=ds.add('ds1',function(res){
		console.log('add:',res);
		var users=ds1.add('users',function(res){
			console.log('add:',res);
			var user=users.add({
				name: 'user3',
				ext:'.js',
				status:'idle'
				
			},function(res){
				console.log('add:',res);
				users.get(function(res){
					console.log('get all items:',JSON.parse(res).length);
					//users.rem()
				});
				
				users.get('1371318555073',function(res){
					console.log('get item by id:',res);
					//users.rem()
				});
				
				
				users.get('name!=user2',function(res){
					console.log('get items by cond:',res);
					//users.rem()
				});

			})					
		})		
	})	
	var hist=[],
		hind=0;
	d.body.add('textarea',{
		value: "",
		id: 'req',
		onkeydown:	function(e){
			if(e.which==13) {
				e.preventDefault()
				
				//console.log(eval(this.value))
				//res.value=eval(this.value)
				
				dnet.post(this.value,function(req){					
					res.value=req;					
				});			
				hist.push(this.value);
				hind=hist.length
				this.value=''
				
			} else if(e.which==38) {
				if (hind) hind-=1;
				req.value=hist[hind]
			} else if(e.which==40) {
				if(hind<hist.length-1) hind+=1
				req.value=hist[hind]
			}
			
		},
		style: {
			width: '512px',
			height: '256px'
		}
	});
	var res=d.body.add('textarea',{
		id: 'res',
		disabled: 'disabled',
		style: {
			width: '512px',
			height: '256px'
		}		
	})
	/**/
	
	
	
	
})