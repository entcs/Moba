var d=document,
	maindiv,
	myobj,
	sh
d.on('ready',function (e){
	console.log('document ready')
	
	maindiv=d.body.r('div class=hello')
		.s('')
		.h('hello')
		.r('div html=child')
		.fn(function(o){
			myobj=o
			renderbuttons(o,7)
		}).p
		
	var renderbuttons=function (o,count){
		loop(count,function(i){
			o.r('button')
				.h('buttonnew'+i)
		})
	}
	(function(){
		console.log('bad')
	})()
	
	
	sh=dss.new('sheet1')
	
	
		
	sh.new('body',
		'background:red',
		'margin:0px'		
	)
	
	sh.show()
	
})