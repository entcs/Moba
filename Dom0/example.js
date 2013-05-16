//waiting for DOM to be ready
dom0.ready(function(){		
	var db=document.body;
	
	//empty div
	var e1=db.add('div');	
	e1.set('html','hello dom0')
	e1.set('class','mydiv')
	e1.add('class','another')
	
	//input with style
	var e2=e1.add('input',{
		value: 'type here',
		title: 'New Title',
		style: {
			border: '2px solid grey',
			display: 'block'
		}
	})
	
	//add button with trigger before input
	var e3=e2.add('button',{
		class: 'mybut',
		html: 'find divs',
		style: {
			display: 'block'
		},
		onclick: function(e){
			alert('document body has '+db.findall('div').length+' divs')
		}
	},
	'before')
	
	var e4=e1.add('span').add('div',{
		class: 'last'
	})
	e4.add('button',{
		html: 'my parents class',
		onclick: function(e){
			alert(this.parentNode.get('class'));
		}
	})
	
})
