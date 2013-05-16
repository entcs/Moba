var db,ele,e1,e2,ele1,e3,e4;
var list;
dom0.ready(function(){	
	db=document.body;
	
	document.head.add('script',{
		src: 'dom0ui.js'
	})
	var act=db;
	but=db.add('button',{
		html: 'Prev',
		onclick: function(e){
			act.rem('class','act');
			act=act.find('prev',1);
			act.set('class','act');		
		}
	})
	
	but=db.add('button',{
		html: 'Next',
		class: 'next c1 c2 c3 c4 c5',
		onclick: function(e){
			act.rem('class','act');
			act=act.find('next',1);
			act.add('class','act');		
		}
	})
	
	
	
	list=db.add('div',{
		class: 'list'
	})
	list.add('button',{
		html: 'Add child',
		onclick: function(e){
			loop(5,function(ind){
				list.add('div',{
					html: 'new div '+list.children.length,
					style: {
						border: '1px solid grey'
					}
				})
			})
		}
	})	
	list.add('button',{
		html: 'rem last child',
		onclick: function(){
			list.removeChild(list.children[list.children.length-1])
		}
	})
	e4=list.add('span').add('div').add('span').add('div').add('a').add('span',{
		class:'class1',
		id:'id1',
		html: 'lalalal',
		style:{
			'background-color': 'red'
		}
	}).add('span');	
	e4.on('showhide',function(e){
		console.log('showhide');
	});
	e4.show();
	e4.off('showhide');
	e4.show();
})
