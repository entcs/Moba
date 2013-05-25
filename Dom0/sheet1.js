dom0.ready(function(){	
	var sh1=dom0.addsheet('sh1',{}),
		red='#fa0',
		blu='#0af';
	
	console.log(sh1);

	sh1.addstyle({
		selector: 'body',
		background: red
	});
	sh1.addstyle({
		selector: '.div1',
		background: '#af0'
	});
	sh1.addstyle({
		selector: '.div2',
		background: blu
	});
	
	sh1.render()
})