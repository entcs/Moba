var g
d.on('ready',function(e){
	g={
		run:function(){
			
		},
		map:{
			gen:function(){
				var x=d.rng(10)*100,
					y=d.rng(10)*50,
					wid=d.rng(10)*10,
					hig=d.rng(10)*10
					
				loop(10,function(i){
					console.log(x,y,wid,hig)
					c0.rect({
						x:x,
						y:y,
						wid:wid,
						hig:hig,
						color:'grey'
					}).to()
					
				})
			}
		}
	}
	c0.ondraw=g.run()
	c0.run()
	g.map.gen()
	
	window.onresize=function(e){
		console.log('here')
		c0.canvas.width=window.innerWidth
		c0.canvas.height=window.innerHeight		
	}
})