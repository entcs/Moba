//globals
var globalcooldown=1000

var c0={
	cs:[],
	add:function(canvas){
		var cc={
			init:function(canvas){
				this.nodes=[]
				this.canvas=canvas//document.createElement('canvas')
				//this.canvas.id='cc'
				//document.body.appendChild(this.canvas)
				this.c=this.canvas.getContext('2d')
				this.root=this.newnode('root')
				this.addevents()
				
			},	
			mpos:{
				x:0,
				y:0
			},
			//events
			addevents:function(){	
				/*
				window.onresize=function(){					
					cc.canvas.width=window.innerWidth-2	
					cc.canvas.height=window.innerHeight-2
					cc.redraw()
				}				
				d.trigger('resize')	
				/**/
			
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
				var mc=['click','mousedown','mouseup','mousemove']
				//mc=['mousedown']
				var cc=this
				loop(mc,function(i,name){
					cc.canvas['on'+name]=function(e){										
						var bounds=this.getClientRects()[0]
						e.pos={
							x:e.x-bounds.left,
							y:e.y-bounds.top
						}						
						var hits=cc.gethits(e.pos,cc.root,[],name),
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
					var hits=cc.gethits(e.pos,cc.root,[],'mousemove'),
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
						if(first!=cc.over){
							if(cc.over){
								fn=cc.over.events['mouseout']
								if(fn){
									e.node=cc.over
									fn(e)
								}
							}			
							cc.over=first
							fn=first.events['mouseover']
							if(fn){						
								e.node=first
								fn(e)
							}					
						}
					} else {
						//mouseout
						if(cc.over){
							fn=cc.over.events['mouseout']
							if(fn){			
								e.node=cc.over
								fn(e)
							}					
						}
						cc.over=0
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
						cc.gethits(p,e,hits,event)
					})
				}
				return hits
			},
			polyarea:function(p,pts){
				var a,b,c,p2,s,area=0
				loop(pts,function(i,p1){
					if(i<pts.length-1){
						p2=pts[i+1]
						a=Math.abs(p.sub(p1))
						b=Math.abs(p.sub(p2))
						c=Math.abs(p1.sub(p2))
						s=(a+b+c)/2
						area+=Math.sqrt(s(s-a)(s-b)(s-c))
					}
				})
				return area
			},
			//util
			dist:function(a,b){
				var dx=a.x-b.x,
					dy=a.y-b.y
				return Math.sqrt(dx*dx+dy*dy)			
			},
			an:function(a,b){		
				if(a.getpos){
					a=a.getpos(cc.root)
				} else {
					a=cc.newpos({x:a.x,y:a.y})			
				}
				if(b.getpos){
					b=b.getpos(cc.root)
				} else {
					b=cc.newpos({x:b.x,y:b.y})			
				}
				b=b.sub(a)
				
				var an=cc.rtoa(Math.atan(b.x/b.y))			
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
					sin=Math.sin(rad).round(15),
					cos=Math.cos(rad).round(15)
					
				return this.newpos({
					x:p.x*cos-p.y*sin,
					y:p.x*sin+p.y*cos
				})
			},
			ator:function(an){
				return (an*Math.PI/180)%(Math.PI*2)
			},
			rtoa:function(rad){
				return (180*rad/Math.PI)%360
			},
			sub:function(a,b){
				return this.newpos({
					x:a.x-b.x,
					y:a.y-b.y
				})
			},
			add:function(a,b){
				return this.newpos({
					x:a.x+b.x,
					y:a.y+b.y
				})
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
			//new objs
			newpos:function(a){
				a=a || {x:0,y:0}
				var pos={
					init:function(){				
						this.type='pos'
						this.x=a.x
						this.y=a.y
					},
					dist:function(p){
						return cc.dist(this,p)
					},
					add:function(p){
						return cc.add(this,p)
					},
					sub:function(p){
						return cc.sub(this,p)
					},
					an:function(p){
						return cc.an(this,p)
					},
					rot:function(an){
						return cc.rot(this,an)
					}
				}
				pos.init()
				return pos
			},
			newnode:function(name){
				var node=this.newpos(),		
					ext={
						init:function(){
							this.type='node'
							this.parent=0	
							this.children=[]
							this.visible=true
							this.an=0
							this.sx=1
							this.sy=1
							this.tail=0
						},
						//rendering
						to:function(parent){
							parent=parent || cc.root
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
						render:function(){//a=pos,an,scale
							if(this.visible){
								if(this.draw){
									this.draw()
								}
								loop(this.children,function(i,e){
									e.render()
								})
							}
						},
						rem:function(){
							var ind=this.parent.children.indexOf(this)
							this.parent.children.splice(ind,1)

							ind=cc.nodes.indexOf(this)
							cc.nodes.splice(ind,1)
							
							return this
						},
						//util
						pos:function(p){
							if(p){
								this.x=p.x
								this.y=p.y
							} else {							
								return cc.newpos({
									x:this.x,
									y:this.y
								})
							}
						},
						getpos:function(parent,pos){
							if(pos){
								pos=pos.rot(this.an)
								pos=pos.add(this.getpos())
							} else {
								pos=cc.newpos({
									x:this.x,
									y:this.y
								})					
							}				
							if(parent && parent!=this.parent){
								pos=this.parent.getpos(parent,pos)
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
						getan:function(parent,an){
							if(an){
								an+=this.an
							} else {
								an=this.an
							}				
							if(parent && parent!=this.parent){
								an=this.parent.getan(parent,an)
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
								norm=cc.norm(dif),
								dist=cc.dist(p1,p2),			
								move={
									x:norm.x*speed*cc.time.td,
									y:norm.y*speed*cc.time.td
								}		
							if(Math.abs(move.x)>Math.abs(dif.x)){
								move.x=dif.x
							}
							if(Math.abs(move.y)>Math.abs(dif.y)){
								move.y=dif.y
							}		
							move=cc.add(p1,move)	
							this.pos(move)		
						},
						//events
						ishit:function(p){									
							var b=this.bounds
							if(this.type=='circ'){								
								var dist=cc.dist(this.pos(),p)
								//console.log('ishit',dist,this.rad)
								if(dist<=this.rad){
									return true
								}
							} else {
								var a1=this.getarea(),
									a2=this.dotarea(p).round(5)
								//console.log(a1,a2)
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
			//rendering
			clear:function(){
				this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
			},
			render:function(node,mat){
				var x,y			
				node=node || cc.root
				if(node.visible){
					if(node.type=='rect'){
						x=node.x-node.wid/2
						y=node.y-node.hig/2
					} else {
						x=node.x
						y=node.y
					}			
					if(node.draw){
						node.draw()
					}
					loop(node.children,function(i,e){
						cc.render(e)
					})
				}		
			},
			redraw:function(node){
				node=node || this.root
				this.clear()
				node.render()		
			},
			//primitives
			rect:function(a){
				var wid=a.wid/2,
					hig=a.hig/2
				a.pts=[
					{
						x:-wid,
						y:-hig
					},
					{
						x:wid,
						y:-hig
					},
					{
						x:wid,
						y:hig
					},
					{
						x:-wid,
						y:hig
					}
				]						
				var node=this.poly(a)
				node.x=a.x
				node.y=a.y
				node.type='rect'
				return node
			},
			area:function(pts){
				var p1,
					p2=pts[pts.length-1],
					ahig,
					xdif,
					area=0,
					sum
					
				loop(pts,function(i,p){
					p1=p
					ahig=(Math.abs(p2.y)+Math.abs(p1.y))/2
					xdif=p2.x-p1.x
					sum=ahig*xdif			
					if(xdif>0){
						area+=sum
					} else {
						area-=sum
					}
					p2=p
				})
				return area
				
			},
			poly:function(a){
				var node=this.newnode('rect')
				node.type='poly'
				loop(a,function(k,v){
					node[k]=v
				})
				var x=0,
					y=0			
					
				loop(node.pts,function(i,p){
					x+=p.x
					y+=p.y			
				})
				node.x=x/node.pts.length
				node.y=y/node.pts.length
				
				//make tail
				loop(node.pts,function(i,p){
					dist=cc.dist(node,p)
					if(dist>node.tail){
						node.tail=dist
					}
				})		
				
				node.draw=function(){								
					var c=cc.c,
						p=cc.newpos(this.pts[this.pts.length-1]),
						pos=this.getpos(cc.root),
						an=this.getan(cc.root),
						pa=this.parent
						//pos=pa.pos()				
					
					
					
					c.beginPath()			
					
					p=p.rot(an)
					p=p.add(pos)
					c.moveTo(p.x,p.y)
					loop(this.pts,function(i,pt){
						p=cc.newpos(pt)
						p=p.rot(an)			
						p=p.add(pos)
						c.lineTo(p.x,p.y)
					})
					c.closePath()
					c.lineJoin = 'bevel'
					
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
				var node=this.newnode('circ')		
				node.type='circ'
				loop(a,function(k,v){
					node[k]=v
				})
				node.tail=node.rad
				
				node.draw=function(){
					var c=cc.c
					c.beginPath()
					c.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false)
					if(this.color){
						c.fillStyle = this.color
						c.fill()
					}
					if(this.linewid){
						c.lineWidth = this.linewid
						c.strokeStyle = this.linecolor
						c.stroke()
					}
					this.bounds={
						x:this.x-this.rad,
						y:this.y-this.rad,
						wid:this.rad*2,
						hig:this.rad*2
					}
				}
				return node		
			},
			line:function(a){
				var node=this.newnode('line')
				node.type='line'
				loop(a,function(k,v){
					node[k]=v
				})				
				console.log(node.color)
				node.draw=function(){		
					var c=cc.c
					c.beginPath()
					c.moveTo(this.p1.x,this.p1.y)
					c.lineTo(this.p2.x,this.p2.y)			
					c.strokeStyle = this.color || 'black'
					if(this.linewid){
						c.lineWidth = this.linewid				
					}			
					c.stroke()
					this.bounds={
						x:Math.min(this.p1.x,this.p2.x),
						y:Math.min(this.p1.y-this.p2.y),
						wid:Math.abs(this.p1.x-this.p2.x),
						hig:Math.abs(this.p1.y-this.p2.y)
					}
				}
				return node			
			},
			text:function(a){
				var node=this.newnode('text')
				
				loop(a,function(k,v){
					node[k]=v
				})		
				node.type='text'
				
				var c=cc.c
				node.draw=function(){			
					if(this.font){
						c.font = this.font
					}
					c.fillStyle=this.color || 'black'			
					if(this.linewid){
						c.lineWidth = this.linewid
						c.strokeStyle = this.linecolor || 'black'				
						c.strokeText(this.text,this.x,this.y)
					}
					c.fillText(this.text,this.x,this.y)
				}
				return node			
			},
			img:function(a){},
			//curves
			qcurve:function(a){
				var node=this.newnode('curve')
				node.type='curve'
				loop(a,function(k,v){
					node[k]=v
				})				
				//console.log(node.color)
				node.draw=function(){		
					var c=cc.c
					c.beginPath()
					c.moveTo(this.p1.x,this.p1.y)
					c.quadraticCurveTo(
						this.c1.x,this.c1.y,
						this.p2.x,this.p2.y
					)
					c.strokeStyle = this.color || 'black'
					if(this.linewid){
						c.lineWidth = this.linewid				
					}			
					c.stroke()
				}
				return node					
			},			
			curve:function(a){
				var node=this.newnode('curve')
				node.type='curve'
				loop(a,function(k,v){
					node[k]=v
				})				
				console.log(node.color)
				node.draw=function(){		
					var c=cc.c
					c.beginPath()
					c.moveTo(this.p1.x,this.p1.y)
					c.bezierCurveTo(
						this.c1.x || this.p1.x,this.c1.y || this.p1.y,
						this.c2.x || this.p2.x,this.c2.y || this.p2.y,
						this.p2.x,this.p2.y
					)
					c.strokeStyle = this.color || 'black'
					if(this.linewid){
						c.lineWidth = this.linewid				
					}			
					c.stroke()
				}
				return node					
			},
			//collision
			pvl:function(p,l){
				//console.log('lp1',l.p1.x,l.p1.y)
				//point(axis aligned ray) vs line
				var h=false,
					o1={
						a:0,
						b:0,
						c:0
					}
					
				o1.a=l.p2.y-l.p1.y
				o1.b=l.p1.x-l.p2.x
				o1.c=o1.a*l.p1.x+o1.b*l.p1.y

				px=(o1.b*p.y-o1.c)/-o1.a

				yy=[l.p1.y,l.p2.y].sort()
				l2.p1=m
				l2.p2.x=m.x+100
				l2.p2.y=m.y
				
				if(px>=p.x && p.y>yy[0] && p.y<yy[1]){
					h=cc.newpos({
						x:px,
						y:p.y
					})
					console.log('p:',p.x,p.y)
				}
				
				return h		
			},
			pvpoly:function(p,py){
				var hits=[],
					hits=0,
					line={
						p1:cc.newpos(py.pts[py.pts.length-1]),
						p2:cc.newpos()
					}
					
				//translate p
				c1.setpos(p)		
				p=p.sub(py.getpos(cc.root))
				p=p.rot(-py.getan(cc.root))
				loop(py.pts,function(i,pt){
					line.p2=cc.newpos(pt)
					hit=cc.pvl(p,line)
					if(hit){
						hits+=1
					}			
					line.p1=line.p2
				})
				return hits%2
			},
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
					e(cc.time)
				})
				this.redraw()
				/*
				this.timeout=setTimeout(function(){
					cc.run(interval)
				},interval)
				/**/
			},
			runlist:[]
		}
		cc.init(canvas)
		c0.cs.push(cc)
		return cc
	},
	rem:function(canvas){		
		loop(c0.cs,function(i,c){
			if(c.canvas==canvas){
				canvas.rem()
				c0.cs.splice(i,1)
				return false
			}
		})
	},
	get:function(canvas){		
		var found
		loop(c0.cs,function(i,c){
			if(c.canvas==canvas){
				found=c
				return false
			}
		})
		return found
	}
}
/*
//test
c0.init()
/*
var m=c0.newpos({
	x:0,
	y:0
})
var t1=c0.text({
	x:10,
	y:10,
	text:'X:0 Y:0'
})
t1.to()



/*
var r1=c0.rect({
	name:'r1',
	x:200,
	y:200,	
	wid:50,
	hig:100,
	an:45,	
	color:'green',
	linecolor:'black',
	linewid:3
})
r1.to()

p1=c0.poly({
	pts:[
		{x:0,y:0},
		{x:100,y:0},
		{x:50,y:20},
		{x:100,y:40},
		{x:0,y:60}
	],
	color:'green',
	linecolor:'black',
	linewid:3	
})
p1.x=100
p1.y=100
p1.to()
var c1=c0.circ({
	x:0,
	y:0,
	rad:10,
	color:'red'
})
c1.to()
var c2=c0.circ({
	x:0,
	y:0,
	rad:10,
	color:'blue'
})
c2.to()
var l1=c0.line({
	p1:{x:100,y:100},
	p2:{x:300,y:200},
	linewid:10,
	color:'red'
})
l1.to()
var l2=c0.line({
	p1:{x:100,y:200},
	p2:{x:0,y:0},
	linewid:3,
	color:'green'
})
l2.to()
l1.p1=c0.newpos(p1.pts[p1.pts.length-1]).add(p1.pos())
l1.p2=c0.newpos(p1.pts[0]).add(p1.pos())

function hitXX(p,l1){
	var h=false,
		o1={
			a:0,
			b:0,
			c:0
		},
		o2={
			a:0,
			b:0,
			c:0
		},
		d
		
	o1.a=l1.p2.y-l1.p1.y
	o1.b=l1.p1.x-l1.p2.x
	o1.c=o1.a*l1.p1.x+o1.b*l1.p1.y

	px=(o1.b*p.y-o1.c)/-o1.a

	yy=[l1.p1.y,l1.p2.y].sort()
	
	var p=m
	if(px>=p.x && p.y>yy[0] && p.y<yy[1]){
		h=c0.newpos({
			x:px,
			y:p.y
		})
	}
	return h
}

c0.canvas.on('mousemove',function(e){
	m.x=e.x
	m.y=e.y	
	t1.text='X:'+m.x+'Y;'+m.y
	var h=c0.pvpoly(m,p1)
	if(h){
		c1.setpos(h)
		p1.color='blue'
	} else {
		p1.color='green'
	}
	c0.redraw()
})


function animloop(){
  window.requestAnimationFrame(animloop)
  c0.run()
}
animloop()

c0.runlist.push(function(){	
	p1.an+=0.2
})
/**/