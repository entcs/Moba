var db,ele,e1,e2,ele1,e3,e4,act;
var list;

document.onready(function(){	
	console.log('dom0 ready');
	dh=document.head;
	db=document.body;
	db.add('div',{
		html: 'div1',
		class: 'div1'
	})
	db.add('div',{
		html: 'div2',
		class: 'div2'
	})
	db.add('button',{
		html: 'but1'
	})
	
	//style sheet
	var sh1=dui.addsheet('sh1',{}),
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
