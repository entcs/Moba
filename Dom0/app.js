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
	e4=list.add('div').add('div').add('div',{
		class:'class1',
		id:'id1',
		html: 'lalalal',
		style:{
			'background-color': 'red'
		}
	});	
	e4.on('showhide',function(e){
		console.log('showhide');
	});
	e4.show();
	e4.off('showhide');
	e4.show();
	
	/*
	function fireEvent(element,event){
		if (document.createEventObject){
		// dispatch for IE
		var evt = document.createEventObject();
		return element.fireEvent('on'+event,evt)
		}
		else{
		// dispatch for firefox + others
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent(event, true, true ); // event type,bubbling,cancelable
		return !element.dispatchEvent(evt);
		}
	}
	Event.observe(e4,'change',function(){alert('hi');});
	fireEvent(e4,'change');	
	/**/
	/*
	e4.onshowhide=function trigger(e){
		console.log('trigger showhide',e.vis);
	}
	/**/
	/*
	db.onshowhide=function(e){
		console.log('body onshow triggered:',e.target,e.showhide);
	}	
	
	//e4.addEventListener("showhide", e4.onshowhide, false);
	e4.show();
	e4.onshowhide=function(e){
		console.log('onshow triggered:',e.target,e.showhide);
	}
	e4.show();
	e4.on('click',function(e){
		console.log('click',e.target);
		e.target.show();
	})
	e4.on('showhide',function(e){
		console.log('showhide',e.target);
	})
	/*
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent('show', true, true ); // event type,bubbling,cancelable	
	e4.dispatchEvent(evt);
	/**/
})
