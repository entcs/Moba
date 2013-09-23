d.on('ready',function(e){
	//render,html,style
	d.body.r('div class=hello')
		.h('hello')
		.s('background:red')
		.on('mouseover',function(e){
			this.s('background:green')
		})
		.on('mouseout',function(e){
			this.s('background:red')
		})
	//dss
	var sheet1=d.dss.new('sheet1')
	sheet1.new('.hello',
		'border:2px solid blue'
	)
	sheet1.show()
})