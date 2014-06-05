var g,
	me,
	line,
	rect,
	dot
	
d.on('ready',function(e){
	g={
		run:function(tt){
			g.grav(tt)			
			me.color='yellowgreen'	
			me.col=false
			c0.collide(g.collide)
			g.move(tt)
		},
		grav:function(tt){			
			loop(g.map.pls,function(i,pl){
				pl.vec.y+=tt*0.012
			})
		},
		move:function(tt){
			var dec=0
			loop(g.map.pls,function(i,pl){
				if(pl.vec.x>0){
					dec=-1
				} else if(pl.vec.x<0){
					dec=1
				}				
				if(me.left && me.col){
					pl.vec.x-=tt*0.03
				} else if(me.right && me.col){
					pl.vec.x+=tt*0.03
				}
				if(pl.vec.x>0.35*tt){
					pl.vec.x=0.35*tt
				}
				if(pl.vec.x<-0.35*tt){
					pl.vec.x=-0.35*tt
				}
				if(me.jump && me.col){
					me.vec.y=-0.5*tt
					me.jump=false
				}
				if(me.col){
					pl.vec.x+=dec*tt*0.01
				} else {
					pl.vec.x+=dec*tt*0.001
				}
				pl.x+=pl.vec.x
				pl.y+=pl.vec.y
			})			
		},
		collide:function(col){
			me.col=true
			//col.n1.color='orange'
			var pos=col.n1.getpos(),
				vec=c0.norm(c0.sub(pos,col.hit)),
				an=c0.an(pos,col.hit)
			//dot.pos(col.hit)
			//col.n1.vec=vec
			//col.n1.vec.x+=vec.x
			var dif=me.rad-c0.dist(pos,col.hit)
			//console.log(me.x,col.hit.x)
			if(pos.y<col.hit.y){
				//console.log('me higher')
				me.y-=dif-2
			} else {
				//console.log('me lower')
				me.y+=dif-15
			}
			col.n1.vec.y=0
			
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
			addpl:function(){
				var pl=c0.circ({
						rad:24,
						color:'yellowgreen'
					}).to(this.root)
					
					pl.vec={x:0,y:0}					
				
				pl.enable()
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
	c0.run('resize')
	g.map.gen()
	me=g.map.addpl()
	me.x=443
	me.y=410
	dot=c0.circ({
		rad:10,
		color:'blue'
	}).to(g.map.root)
	c0.ondraw=g.run
	
	d.body.on('keyup',function(e){	
		switch(e.which){
			case 65:
			case 37:
				me.left=false
				break
			case 68:
			case 39:
				me.right=false
				break
			case 87:
			case 32:
			case 38:
				//jump				
				e.preventDefault()
				e.stopPropagation()
				break
		}
	})
	d.body.on('keydown',function(e){	
		switch(e.which){
			case 65:
			case 37:
				me.left=true
				break
			case 68:
			case 39:
				me.right=true
				break
			case 87:
			case 32:
			case 38:
				//jump
				if(me.col){
					me.jump=true
				}
				e.preventDefault()
				e.stopPropagation()
				break
		}
	})	
	//c0.collide(g.collide)
})