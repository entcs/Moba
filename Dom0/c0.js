d.body.s('margin:0px')
//globals
var globalcooldown=1000

var c0={
	init:function(){
		this.nodes=[]
		this.canvas=document.createElement('canvas')
		this.canvas.id='c0'
		document.body.appendChild(this.canvas)
		this.c=this.canvas.getContext('2d')
		this.root=this.node('root')
		this.addevents()
		
	},
	//events
	addevents:function(){	
		window.onresize=function(){
			c0.canvas.width=window.innerWidth-2	
			c0.canvas.height=window.innerHeight-2
			c0.redraw()
		}
		d.trigger('resize')	
	
		var events={
			onkeypress:{},
			onkeydown:{},
			onkeyup:{},
			onclick:{},
			onmousedown:{},
			onmouseup:{},
			ondblclick:{},
			onmousewheel:{},
			onmousemove:{},
			onmouseover:{},
			mouseout:{},
			touchstart:{},
			touchmove:{},
			touchend:{},
			touchenter:{},
			touchleave:{},
			touchcancel:{}
		}
		
		
		//mouse clicks
		var mc=['click','mousedown','mouseup']
		//mc=['mousedown']
		loop(mc,function(i,name){
			c0.canvas['on'+name]=function(e){				
				e.pos={
					x:e.x,
					y:e.y
				}
			
				var hits=c0.gethits(e.pos,c0.root,[],name),
					event=name,
					fn
				
				hits.reverse()
				loop(hits,function(i,n){
					fn=n.events[event]
					if(fn){
						e.node=n
						fn(e)
					}
				})			
			}		
		})
		
		this.canvas.onmousemovex=function(e){
			e.pos={
				x:e.x,
				y:e.y
			}		
			var hits=c0.gethits(e.pos,c0.root,[],'mousemove'),
				event='mousemove',
				fn
				
			hits.reverse()			
			loop(hits,function(i,n){
				fn=n.events[event]
				if(fn){
					e.node=n
					fn(e)
				}
			})
			//mouseover
			var first=hits[0]
			if(first){
				if(first!=this.over){
					if(this.over){
						fn=this.over.events['mouseout']
						if(fn){
							e.node=this.over
							fn(e)
						}
					}			
					this.over=first
					fn=first.events['mouseover']
					if(fn){						
						e.node=first
						fn(e)
					}					
				}
			} else {
				//mouseout
				if(this.over){
					fn=this.over.events['mouseout']
					if(fn){			
						e.node=this.over
						fn(e)
					}					
				}
				this.over=0
			}
			
			
		}
		
	},
	over:0,
	gethits:function(p,node,hits,event){		
		node=node || this.root
		hits=hits || []
		if(node.visible){
			if(node.events[event] && node.draw  && node.ishit(p)){
				hits.push(node)
			}		
			loop(node.children,function(i,e){
				c0.gethits(p,e,hits,event)
			})
		}
		return hits
	},
	//util
	dist:function(a,b){
		var dx=a.x-b.x,
			dy=a.y-b.y
		return Math.sqrt(dx*dx+dy*dy)			
	},
	an:function(a,b){		
		if(a.getpos){
			a=a.getpos(c0.root)
		} else {
			a={x:a.x,y:a.y}
		}
		if(b.getpos){
			b=b.getpos(c0.root)
		} else {
			b={x:b.x,y:b.y}			
		}
		b=b.sub(a)
		
		var an=c0.rtoa(Math.atan(b.x/b.y))			
		if(b.x>0){
			if(b.y<0){
				an=-an
			} else {
				an=180-an
			}
		} else {
			if(b.y>0){
				an=180-an
			} else {
				an=360-an
			}						
		}
		console.log('an:',an)
		return an
	},
	rot:function(p,an){
		var rad=this.ator(an),
			sin=Math.sin(rad),
			cos=Math.cos(rad)
			
		return {
			x:p.x*cos-p.y*sin,
			y:p.x*sin+p.y*cos
		}
	},	
	ator:function(an){
		return (an*Math.PI/180)%(Math.PI*2)
	},
	rtoa:function(rad){
		return (180*rad/Math.PI)%360
	},
	sub:function(a,b){
		return {
			x:a.x-b.x,
			y:a.y-b.y
		}
	},
	add:function(a,b){
		return {
			x:a.x+b.x,
			y:a.y+b.y
		}
	},
	norm:function(p){
		var one=Math.max(Math.abs(p.x),Math.abs(p.y))
		if(one){
			return {
				x:p.x/one,
				y:p.y/one
			}
		}
		return p
	},
	//rendering
	clear:function(){
		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	render:function(node,mat){
		var x,y			
		node=node || c0.root
		if(node.visible){
			if(node.draw){
				node.draw()
			}
			loop(node.children,function(i,e){
				c0.render(e)
			})
		}		
	},
	redraw:function(node){
		node=node || this.root
		this.clear()
		this.render(node)
	},
	//new objs
	node:function(name){
		var node={x:0,y:0},		
			ext={
				init:function(){
					this.type='node'
					this.name=name
					this.parent=0	
					this.children=[]
					this.visible=true
					this.an=0
					this.sx=1
					this.sy=1
					this.hit='rect'
				},
				//rendering
				to:function(parent){
					parent=parent || c0.root
					if(this.parent){
						loop(this.parent.children,function(i,e){
							if(e==this){
								this.parent.children.splice(i,1)
								return false
							}
						})
					}
					parent.children.push(this)
					this.parent=parent				
					return this
				},
				rem:function(){
					var ind=this.parent.children.indexOf(this)
					this.parent.children.splice(ind,1)

					ind=c0.nodes.indexOf(this)
					c0.nodes.splice(ind,1)
					
					return this
				},
				//util
				pos:function(p){
					if(p){
						this.x=p.x
						this.y=p.y
					} else {
						return {
							x:this.x,
							y:this.y
						}
					}
				},
				getpos:function(){
					var pos={
						x:this.x,
						y:this.y
					}
					if(this.parent){
						pos=c0.rot(pos,this.parent.getan())
						var ppos=this.parent.getpos()
						pos=c0.add(pos,ppos)
					}
					return pos
				},			
				setpos:function(a,parent){
					if(parent){
						
					} else {
						this.x=a.x
						this.y=a.y
					}
				},
				getan:function(){
					var an=this.an
					if(this.parent){
						an+=this.parent.getan()
					}					
					return an%360
				},
				setan:function(an,p){				
					if(p){
						an-=this.parent.getan(p)
					}
					this.an=an
				},
				fol:function(p,speed){
					var p1=this.pos(),
						p2=p,
						dif=p2.sub(p1),
						norm=c0.norm(dif),
						dist=c0.dist(p1,p2),			
						move={
							x:norm.x*speed*c0.time.td,
							y:norm.y*speed*c0.time.td
						}		
					if(Math.abs(move.x)>Math.abs(dif.x)){
						move.x=dif.x
					}
					if(Math.abs(move.y)>Math.abs(dif.y)){
						move.y=dif.y
					}		
					move=c0.add(p1,move)	
					this.pos(move)		
				},
				//events
				ishit:function(p){
					var b=this.bounds
					if(this.type=='circ'){
						if(c0.dist(this.pos(),p)<=this.rad){
							return true
						}
					} else {
						var a1=this.getarea(),
							a2=this.dotarea(p).round(5)
						console.log(a1,a2)
						if(a1>=a2){
							return true
						}
			
					}
					return false
				},
				on:function(name,callback){
					this.events[name]=callback
				},
				off:function(name){
					delete this.events[name]
				},
				events:{
				}
			}
		loop(ext,function(k,v){
			node[k]=v
		})
		node.init()
		this.nodes.push(node)
		return node
	},
	rect:function(a){
		var node=this.node('circ')
		node.type='rect'
		loop(a,function(k,v){
			node[k]=v
		})		
		node.draw=function(){
			var an=this.getan(),
				pos=this.parent.getpos()
			pos=c0.add(pos,c0.rot(this.pos(),this.parent.an))
						
			var w2=node.wid/2,
				h2=node.hig/2,
				pts=[
					c0.rot({x:-w2,y:-h2},an),
					c0.rot({x: w2,y:-h2},an),
					c0.rot({x: w2,y: h2},an),
					c0.rot({x:-w2,y: h2},an)
				]
			
			var c=c0.c		
			
			c.beginPath()			
			c.moveTo(pos.x+pts[0].x,pos.y+pts[0].y)
			c.lineTo(pos.x+pts[1].x,pos.y+pts[1].y)
			c.lineTo(pos.x+pts[2].x,pos.y+pts[2].y)
			c.lineTo(pos.x+pts[3].x,pos.y+pts[3].y)
			c.lineTo(pos.x+pts[0].x,pos.y+pts[0].y)
			c.closePath()					
			if(this.color){
				c.fillStyle = this.color
				c.fill()
			}
			if(this.linewid){
				c.lineWidth = this.linewid
				c.strokeStyle = this.linecolor
				c.stroke()
			}
		}
		
		return node
	},
	circ:function(a){
		var node=this.node('circ')		
		node.type='circ'
		node.hit='circ'
		loop(a,function(k,v){
			node[k]=v
		})
		node.draw=function(){
			var c=c0.c,
				pos=c0.add(this.parent.getpos(),c0.rot(this.pos(),this.parent.getan()))
			c.beginPath()			
			c.arc(pos.x,pos.y, this.rad, 0, 2 * Math.PI, false)
			if(this.color){
				c.fillStyle = this.color
				c.fill()
			}
			if(this.linewid){
				c.lineWidth = this.linewid
				c.strokeStyle = this.linecolor
				c.stroke()
			}
		}
		return node		
	},
	line:function(a){
		var node=this.node('line')
		node.type='line'
		loop(a,function(k,v){
			node[k]=v
		})
		node.draw=function(){		
			var c=c0.c,
				pos=this.parent.getpos(),
				an=this.parent.getan(),
				p1=c0.add(pos,c0.rot(this.p1,an)),
				p2=c0.add(pos,c0.rot(this.p2,an))
			c.beginPath()
			c.moveTo(p1.x,p1.y)
			c.lineTo(p2.x,p2.y)			
			c.strokeStyle = this.color || 'black'
			if(this.linewid){
				c.lineWidth = this.linewid				
			}			
			c.stroke()
		}
		return node			
	},
	text:function(a){
		var node=this.node('text')
		
		loop(a,function(k,v){
			node[k]=v
		})		
		node.type='text'
		
		var c=c0.c
		node.draw=function(){
			var pos=this.parent.getpos(),
				an=this.parent.getan()
			//console.log(this.pos())
			pos=c0.add(pos,c0.rot(this.pos(),an))
			if(this.font){
				c.font = this.font
			}
			c.fillStyle=this.color || 'black'			
			if(this.linewid){
				c.lineWidth = this.linewid
				c.strokeStyle = this.linecolor || 'black'				
				c.strokeText(this.text,pos.x,pos.y)
			}
			c.fillText(this.text,pos.x,pos.y)
		}
		return node			
	},
	img:function(a){},
	//collision
	//timing
	timout:0,
	time:{
		lt:new Date().getTime(),
		ct:new Date().getTime(),
		td:0
	},
	run:function(interval){
		this.time.ct=new Date().getTime()
		this.time.td=this.time.ct-this.time.lt
		this.time.lt=this.time.ct
		
		loop(this.runlist,function(i,e){
			e(c0.time)
		})
		this.redraw()
		/*
		this.timeout=setTimeout(function(){
			c0.run(interval)
		},interval)
		/**/
	},
	runlist:[]
}

//test
c0.init()

var m={
	x:0,
	y:0
}
var t1=c0.text({
	x:10,
	y:10,
	text:'X:0 Y:0'
})
t1.to()

var r1=c0.rect({
	name:'r1',
	x:200,
	y:200,	
	wid:50,
	hig:100,
	an:0,	
	color:'green',
	linecolor:'black',
	linewid:3
})
r1.to()

var r2=c0.rect({
	name:'r2',
	x:100,
	y:100,	
	wid:50,
	hig:100,
	//an:45,	
	color:'red',
	linecolor:'black',
	linewid:3
})
r2.to(r1)

var c1=c0.circ({
	name:'c1',
	x:50,
	y:50,
	rad:30,
	color:'yellow',
	linecolor:'black',
	linewid:'3'
})
c1.to(r2)

var t2=c0.text({
	x:50,
	y:50,
	text:'hello'
})
t2.to(c1)

var l1=c0.line({
	p1:{x:0,y:0},
	p2:{x:50,y:50},
	color:'black'
})
l1.to(c1)

c0.canvas.on('mousemove',function(e){
	m.x=e.x
	m.y=e.y		
	r1.an=m.x/2
	t1.text='X:'+m.x+'Y:'+m.y+'AN:'+r1.an
	//console.log(r2.getpos())
	c0.redraw()
})
/**/
/*
function animloop(){
  window.requestAnimationFrame(animloop)
  c0.run()
}
animloop()

c0.runlist.push(function(){	
	
})
/**/
//c0.redraw()
c0.render(c0.root)
console.log(r2.pos())
console.log(r2.getpos())