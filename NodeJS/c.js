var d=document
d.on('ready', function(){
	console.log('Document ready');
	/*
	dnet.post('load/sapp')
	dnet.post('sethandler/sapp.handler')
	/**/
		
	var logo=d.body.add('div',{
		'class':'logowrap'
	})
	logo.add('div',{
		id: 'logo',
		'class':'logo',
		//html: ('Tëökoda').toUpperCase()
		html: ('Teokoda').toUpperCase()
	})
	logo.add('div',{
		'class':'img'
	})	
			
	var nav=d.body.add('div',{
		'class':'nav'
	});
	var teokoda=ds.add('teokoda'),
		selected=0
	teokoda.add('hoiud')
	teokoda.add('aiad')
	teokoda.add('hoidjad')
	teokoda.add('trennid')
	teokoda.add('ringid')
		
	teokoda.get(function(res){
		var but,
			groups=[];
		loop(JSON.parse(res),function(ind,ele){		
			but=nav.add('button',{
				html: ele.toUpperCase()
			})
			dnet.post(teokoda.add(ele))
			but.on('click',function(){
				if (selected) selected.remclass('selected')
				this.addclass('selected')
				selected=this
				if (activemarker) {
					activemarker.setMap(null)
					activemarker=0
				}		
				getgroup(selected.innerHTML.toLowerCase())				
			})
		})			
	});
	function getgroup(name){
		dnet.post('ds.teokoda.'+name+'.get()',function(res){
			if (res){
				for(var nr in markers) markers[nr].setMap(null)
				markers.length=0
				var data=JSON.parse(res),
					item,
					pos
				for(var nr in data){
					item=JSON.parse(data[nr])
					pos=new google.maps.LatLng(item.pos[0],item.pos[1]);
					var marker = new google.maps.Marker({
						position: pos,
						map: map,
						icon: '/images/'+icomap[selected.innerHTML.toLowerCase()]+'.png',
						shadow: '/images/shadow.png',
						animation: google.maps.Animation.DROP,
						title: item.nimi
					})		
					google.maps.event.addListener(marker, 'click', function(e) {
						console.log('show details');
						mapd.hide()
						modalw.show()								
					})
					markers.push(marker)
				}
			}
		})
	
	}
	
	
	
	var activemarker=0,
		markers=[],
		mapd,
		mapwrap,
		icomap={
			hoidjad: 'hoidja',
			hoiud: 'hoid',
			aiad: 'aed',
			trennid: 'trenn',
			ringid: 'ring',
		};
	(function(){		
		mapwrap=d.body.add('div',{
			'class': 'mapwrap'
		})
		mapd=mapwrap.add('div',{
			id: 'map',
			'class':'map'
		})

		function initialize() {
			var mapOptions = {
				center: new google.maps.LatLng(58.37840540413009, 386.7269734802246),
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			};
			map = new google.maps.Map(document.getElementById("map"),mapOptions);		

			google.maps.event.addListener(map, 'click', function(e) {
				if (selected && !activemarker){
					var marker = new google.maps.Marker({
						position: e.latLng,
						map: map,
						icon: '/images/'+icomap[selected.innerHTML.toLowerCase()]+'-.png',
						shadow: '/images/shadow.png',
						draggable:true,
						animation: google.maps.Animation.DROP,					
						title: 'Lisa uus'
					})		
					google.maps.event.addListener(marker, 'click', function(e) {
						mapd.hide()
						modalw.show()						
					})
					activemarker=marker		
				}
			})
			google.maps.event.addListener(map, 'dragstart', function() {
				if (activemarker) {
					activemarker.setMap(null)
					activemarker=0
				}					
			})
		}
		google.maps.event.addDomListener(window, 'load', initialize);		
	})();	
	//modal
	var modalw=mapwrap.add('div',{
			'class': 'modalwrap'
		}),
		modal=modalw.add('div',{
			'class':'modal'
		})
	modalw.hide()
	var modalh=modal.add('div',{
		'class':'header',
		html: 'modal header',
	})
	var modalc=modal.add('div',{
		'class':'content'
	})
	//form
	var mform=modalc.add('form')
	function addfield(name,tag){
		tag=tag || 'input'
		var field=document.createElement('div')
		field.className='field'				
		field.add('label',{
			'for': 'name',
			html: name,
			style:{
				display: 'block'
			}
		})
		field.add(tag,{
			id: 'name',
			name: name,
			style:{
				display: 'block',
				width: '100%'
			}
			
		})		
		return field
	}
	
	addfield('nimi').to(mform)
	addfield('aadress').to(mform)
	addfield('tel').to(mform)
	addfield('lisa info','textarea').to(mform)
	
	//controls
	var controls=modal.add('div',{
		'class': 'controls'
	})
	controls.add('button',{
		'class':'cancel grey',
		html: ('Katkesta').toUpperCase()
	}).on('click',function(){
		if (activemarker) {
			activemarker.setMap(null)
			activemarker=0
		}
		modalw.hide()
		mapd.show()
	})
	controls.add('button',{
		'class':'save',
		html: ('Salvesta').toUpperCase()
	}).on('click',function(){
		var data=formdata(mform),
			pos
		data.id=selected.innerHTML.toLowerCase()+new Date().getTime()
		pos=activemarker.getPosition()
		data.pos=[pos.jb,pos.kb]
		data=JSON.stringify(data)
		console.log('data:',data)
		
		dnet.post('ds.teokoda.'+selected.innerHTML.toLowerCase()+'.add('+data+')',function(res){
			console.log('added:',res);
			modalw.hide()
			mapd.show()				
			getgroup(selected.innerHTML.toLowerCase())
		})						
		if (activemarker) {
			activemarker.setMap(null)
			activemarker=0
		}		
		
		
	})
	function formdata(form){
		var fields=form.findall('.field'),
			field,
			label,
			inp=[],
			data={}
		for(var nr in fields){
			field=fields[nr]
			inp=field.find('input') || field.find('textarea')				
			data[inp.get('name')]=inp.value				
		}
		return data
	}
	
})