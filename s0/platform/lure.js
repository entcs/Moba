var g,
	me,
	line,
	rect,
	dot,
	foods=[],
	food=0
	
d.on('ready',function(e){
	g={
		run:function(tt){
			g.grav(tt)			
			me.color='yellowgreen'						
			g.move(tt)
			me.col=false
			c0.collide(g.collide)
			g.dofood()
		},
		dofood:function(){
			var now=new Date().getTime()
			loop(foods,function(i,fo){
				if(now-food.start>3000){
					foods.splice(i,1)
					fo.rem()
					food=foods[0]
					me.left=false
					me.jump=false
					me.right=false
					
				}
			})
		},
		grav:function(tt){			
			loop(g.map.pls,function(i,pl){
				pl.vec.y+=tt*0.02
				if(pl.vec.y>me.rad){
					pl.vec.y=me.rad/4
				}
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
					me.vec.y=-12//0.7*tt
					me.jump=false
				}
				if(me.col){
					pl.vec.x+=dec*tt*0.01
				} else {
					pl.vec.x+=dec*tt*0.001
				}
				/*
				var vec=c0.sub(c0.m,me.getpos())
				vec.x/=8
				vec.y/=8				
				pl.vec=vec
				/**/
				pl.x+=pl.vec.x
				pl.y+=pl.vec.y
			})			
		
			//food
			if(food){
				var vec=c0.sub(food.getpos(),me.getpos()),
					max=food.rad+me.rad
				
				if(vec.y<-max){
					if(me.col){
						me.jump=true
					}
				} else {
					me.jump=false
				}
				
				if(vec.x<-max){
					//console.log('left')
					me.left=true
					me.right=false
				} else if(vec.x>max){
					//console.log('right')
					me.right=true
					me.left=false					
				}
				//console.log(vec)
				var dist=me.dist(food)
				if(dist<max){
					//eat
					food.rem()
					ind=foods.indexOf(food)
					foods.splice(ind,1)
					food=foods[0]
					me.left=false
					me.right=false
					me.jump=false
				}
			}
		},
		collide:function(col){
			me.col=true
			var pos=col.n1.getpos(),
				vec=c0.sub(pos,col.hit),
				an=c0.an(pos,col.hit),
				dist=c0.dist(pos,col.hit),
				rat=dist/me.rad
			
			
			if(rat<1){				
				vx=1-Math.abs(vec.x/me.rad)
				vy=1-Math.abs(vec.y/me.rad)
				//console.log(vx,vy,vec,me.rad)
				vec.x*=(1-rat)
				vec.y*=(1-rat)
				//me.vec=vec
				me.y+=vec.y
				me.x+=vec.x
				sy=Math.abs(Math.sin(c0.ator(an)))
				sx=Math.abs(Math.cos(c0.ator(an)))
				//console.log(sy)
				
				//me.vec.y*=sy
				//me.vec.x*=sx
				me.vec.y=-me.vec.y/2
				/**/
				//console.log(me.vec)
				//me.vec.y+=vec.y
				//me.vec.x+=vec.x
				//me.vec.x=0
				//me.vec.y=0
			}
			
			//vec.x/=8
			//vec.y/=8
			//me.vec=vec
			//me.vec.y=-me.vec.y/2
			/*
			var dif=me.rad-c0.dist(pos,col.hit)
			if(pos.y<col.hit.y){
				me.y-=dif//-2
			} else {
				me.y+=dif//-20
			}
			if(me.vec.y>0){
				col.n1.vec.y=-col.n1.vec.y/4
			} else {
				col.n1.vec.y=0
			}
			/**/
			
			
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
					x=d.rng(window.innerWidth/6)*6
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
				/*
				this.addblock({
					x:window.innerWidth/2,
					y:window.innerHeight/1.5,
					wid:40,
					an:45,
					hig:window.innerHeight/2,
					color:'#aaa'
				})
				/**/
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
	c0.canvas.on('click',function(e){
		//if(food){
			//food.rem()
		//}
		var newfood=c0.circ({
			color:'orange',
			rad:10		
		}).to()
		newfood.pos(c0.m)
		newfood.start=new Date().getTime()
		foods.push(newfood)
		food=foods[0]
	})
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
				me.jump=true
				e.preventDefault()
				e.stopPropagation()
				break
		}
	})	
	//c0.collide(g.collide)
})