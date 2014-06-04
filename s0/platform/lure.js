var g,
	me
d.on('ready',function(e){
	g={
		run:function(tt){
			//c0.redraw()
			g.grav(tt)
			g.move(tt)
			c0.collide(g.collide)
		},
		grav:function(dt){			
			loop(g.map.pls,function(i,pl){
				//console.log('pl:',pl)
				pl.vec.y+=dt*0.008
			})
		},
		move:function(){
			loop(g.map.pls,function(i,pl){
				pl.vis.x+=pl.vec.x
				pl.vis.y+=pl.vec.y
				//console.log('pl:',pl)
				//pl.vec.y+=dt*0.001
			})			
		},
		collide:function(col){
			console.log('col',col)
		},
		map:{
			blocks:[],
			addblock:function(a){
				var block=c0.rect().to(this.root)
				block.enable()
				loop(a,function(k,v){
					block[k]=v
				})
				this.blocks.push(block)
			},
			pls:[],
			addpl:function(a){
				var pl={
					vec:{x:0,y:0},
					vis:c0.circ({
						rad:24,
						color:'yellowgreen'
					}).to(this.root)
				}
				pl.vis.enable()
				this.pls.push(pl)
				return pl
			},
			gen:function(){
				this.root=c0.node().to()
				this.objs=[]
				var map=this.root
				var x,y,wid,hig
					
				loop(10,function(i){
					x=d.rng(window.innerWidth/12)*12
					y=d.rng(6)*(window.innerHeight/6)
					wid=240
					hig=40
					g.map.addblock({
						x:x,
						y:y,
						wid:wid,
						hig:hig,
						color:'#aaa'
					})					
				})
				this.addblock({
					x:window.innerWidth/2,
					y:window.innerHeight,
					wid:window.innerWidth,
					hig:40,
					color:'#aaa'
				})
			}
		}
	}
	c0.ondraw=g.run
	c0.run()
	g.map.gen()
	me=g.map.addpl()
	
	function resize(e){
		console.log('here')
		c0.canvas.width=window.innerWidth
		c0.canvas.height=window.innerHeight		
	}
	window.onresize=resize
	resize()
	
})