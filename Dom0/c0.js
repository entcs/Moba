d.body.s('margin:0px')
//globals
var globalcooldown=1000

var c0={
	init:function(){
		this.canvas=document.createElement('canvas')
		this.canvas.id='c0'
		document.body.appendChild(this.canvas)
		this.c=this.canvas.getContext('2d')
		this.root=this.addnode('root')
		this.addevents()
	},
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
	canvas:0,
	root:0,
	nodes:[],
	//util
	util:{
		dist:function(a,b){
			var dx=a.x-b.x,
				dy=a.y-b.y
			return Math.sqrt(dx*dx+dy*dy)			
		},
		an:function(a,b){
			if(a.type=='node'){
				a=a.getpos(c0.root)
			}
			if(b.type=='node'){
				b=b.getpos(c0.root)
			}
			
			b.sub(a)
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
			return an
		},
		rot:function(p,an){
			var rad=this.ator(an),
				sin=Math.sin(rad).round(15),
				cos=Math.cos(rad).round(15)
				
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
		}	
	},
	//new objs
	newpos:function(a){
		var pos={
			type:'pos',
			x:a.x,
			y:a.y,
			dist:function(p){
				var dx=this.x-p.x,
					dy=this.y-p.y
				return Math.sqrt(dx*dx+dy*dy)				
			},
			add:function(p){
				this.x+=p.x
				this.y+=p.y
				/*
				return c0.newpos({
					x:this.x+p.x,
					y:this.y+p.y
				})
				/**/
			},
			sub:function(p){
				this.x-=p.x
				this.y-=p.y
				/*
				return c0.newpos({
					x:this.x-p.x,
					y:this.y-p.y
				})
				/**/
			},
			an:function(p){				
				var an=0
				if(p){
					an=this.dif(p).an()
				} else {					
					an=c0.rtoa(Math.atan(this.x/this.y))
					if(this.x>0){
						if(this.y<0){
							an=-an
						} else {
							an=180-an
						}
					} else {
						if(this.y>0){
							an=180-an
						} else {
							an=360-an
						}						
					}
				}
				return an
			},
			rot:function(an){
				var rad=c0.ator(an),
					sin=Math.sin(rad).round(15),
					cos=Math.cos(rad).round(15),
					x=this.x*cos-this.y*sin,
					y=this.x*sin+this.y*cos
				
				this.x=x
				this.y=y
			}
		}
		return pos
	},
	newnode:function(a){
		var node={
			type:'node',
			parent:0,		
			children:[],
			visible:true,
			x:0,
			y:0,			
			an:0,
			scalex:1,
			scaley:1,
			tail:0,			
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

				ind=c0.nodes.indexOf(this)
				c0.nodes.splice(ind,1)
				
				return this
			},
			getpos:function(parent,pos){
				if(pos){
					pos.rot(this.an)
					pos.add(this.getpos())
				} else {
					pos=c0.newpos({
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
				return an
			},
			setan:function(an,parent){
				
			},
			pos:function(a){
				if(a){
					this.x=a.x
					this.y=a.y
				} else {
					return {x:this.x,y:this.y}
				}
			},
			scale:function(a){
				if(a){
					this.scalex=a.x
					this.scaley=a.y
				} else {
					return {x:this.scalex,y:this.scaley}
				}				
			},
			look:function(a){
				//gets an
				var an=0
				return an
			},
			lookat:function(a){
				//sets an
			},
			fol:function(p,speed){
				var p1=this.pos(),
					p2=p,
					dif=c0.sub(p2,p1),
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
			dist:function(a){
				//p == point || node				
				var dist=0,
					p1=this.getpos(c0.root),
					p2					
				if(a.type=='pos'){
					
				}else{
					
				}
				return dist
			},
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
		this.nodes.push(node)
		return node		
	},
	polyarea:function(p,pts){
		var a,b,c,p2,s,area=0
		loop(pts,function(i,p1){
			if(i<pts.length-1){
				p2=pts[i+1]
				a=Math.abs(c0.sub(p,p1))
				b=Math.abs(c0.sub(p,p2))
				c=Math.abs(c0.sub(p1,p2))
				s=(a+b+c)/2
				area+=Math.sqrt(s(s-a)(s-b)(s-c))
			}
		})
		return area
	},
	rot:function(p,an){
		var rad=this.ator(an),
			sin=Math.sin(rad).round(15),
			cos=Math.cos(rad).round(15)
			
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
	dist:function(a,b){
		var dx=a.x-b.x,
			dy=a.y-b.y
		return Math.sqrt(dx*dx+dy*dy)
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
	clear:function(){
		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	render:function(node,mat){
		var x,y			
		node=node || c0.root
		if(node.visible){
			//rotation			
			
			//console.log('node an:',node.an,this.ator(node.an))
			//this.c.translate(-node.x,-node.y)
			if(node.type=='rect'){
				x=node.x-node.wid/2
				y=node.y-node.hig/2
			} else {
				x=node.x
				y=node.y
			}
			//this.c.translate(x,y)
			
			//this.c.rotate(this.ator(node.an))
			
			if(node.draw){
				node.draw()
			}
			//this.c.rotate(-Math.PI/100)
			//this.c.translate(node.x,node.y)
			loop(node.children,function(i,e){
				c0.render(e)
			})
			//this.c.rotate(this.ator(-node.an))
			//this.c.translate(-x,-y)				
			
			
			
		} else {
		
		}		
	},
	redraw:function(node){
		node=node || this.root
		this.clear()
		node.render()		
	},
	addnode:function(name){
		var node={
			type:'node',
			parent:0,		
			children:[],
			visible:true,
			x:0,
			y:0,			
			an:0,
			scalex:1,
			scaley:1,
			tail:0,			
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

				ind=c0.nodes.indexOf(this)
				c0.nodes.splice(ind,1)
				
				return this
			},
			getpos:function(parent,pos){
				if(pos){
					pos.rot(this.an)
					pos.add(this.getpos())
				} else {
					pos=c0.newpos({
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
				return an
			},
			pos:function(a){
				if(a){
					this.x=a.x
					this.y=a.y
				} else {
					return {x:this.x,y:this.y}
				}
			},
			scale:function(a){
				if(a){
					this.scalex=a.x
					this.scaley=a.y
				} else {
					return {x:this.scalex,y:this.scaley}
				}				
			},
			look:function(p){
				
			},
			fol:function(p,speed){
				var p1=this.pos(),
					p2=p,
					dif=c0.sub(p2,p1),
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
			rot:function(an){
				this.an=an
			},
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
		this.nodes.push(node)
		return node
	},
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
		var node=this.addnode('rect')
		node.getarea=function(){
			return c0.area(this.pts)
		}
		node.dotarea=function(pt){
			var a,b,c,s,
				area=0,				
				p2=this.pts[this.pts.length-1],
				pa=this.parent,
				ppos=pa.pos()

			//add pa pos			
			pt=c0.sub(pt,ppos)
			pt=c0.rotate(pt,-pa.an)			
				
			//rotate point
			pt=c0.sub(pt,this)
			pt=c0.rotate(pt,-this.an)
			pt=c0.add(pt,this)
			
			c1.pos(pt)	
			loop(this.pts,function(i,p1){
				
				a=c0.dist(pt,p1)
				b=c0.dist(pt,p2)
				c=c0.dist(p1,p2)
				
				s=(a+b+c)/2
				area+=Math.sqrt(s*(s-a)*(s-b)*(s-c))				
				p2=p1
			})
			
			return area
		}
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
			dist=c0.dist(node,p)
			if(dist>node.tail){
				node.tail=dist
			}
		})		
		
		node.draw=function(){								
			var c=c0.c,
				p=c0.newpos(this.pts[this.pts.length-1]),
				pos=this.getpos(c0.root),
				an=this.getan(c0.root),
				pa=this.parent
				//pos=pa.pos()				
			
			
			
			c.beginPath()			
			//p=c0.sub(pt,node)
			
			p.rot(an)
			//console.log('p1:',p,pos)			
			p.add(pos)
			//console.log('p2:',p)
			//p=c0.rot(p,pa.an)
			c.moveTo(p.x,p.y)
			loop(this.pts,function(i,pt){
				p=c0.newpos(pt)
				//p=c0.sub(pt,node)
				p.rot(an)			
				p.add(pos)
				//p=c0.rot(p,pa.an)
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
		var node=this.addnode('circ')		
		node.type='circ'
		loop(a,function(k,v){
			node[k]=v
		})
		node.tail=node.rad
		
		node.draw=function(){
			var c=c0.c
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
		var node=this.addnode('line')
		node.type='line'
		loop(a,function(k,v){
			node[k]=v
		})				
		
		node.draw=function(){		
			var c=c0.c
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
		var node=this.addnode('text')
		
		loop(a,function(k,v){
			node[k]=v
		})		
		node.type='text'
		
		var c=c0.c
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
c0.canvas.on('mousemove',function(e){
	m.x=e.x
	m.y=e.y	
	t1.text='X:'+m.x+'Y;'+m.y
	c0.redraw()	
})

var r1=c0.rect({
	name:'r1',
	x:200,
	y:200,
	wid:100,
	an:0,
	hig:10,
	color:'green',
	linecolor:'black',
	linewid:3
})
r1.to(c0.root)

var r2=c0.rect({
	x:100,
	y:0,
	wid:100,	
	hig:10,
	an:0,
	color:'blue',
	linecolor:'black',
	linewid:3
})
r2.to(r1)
var r3=c0.rect({
	x:100,
	y:0,
	wid:100,	
	hig:10,
	an:0,
	color:'red',
	linecolor:'black',
	linewid:3
})
r3.to(r2)
function animloop(){
  window.requestAnimationFrame(animloop)
  c0.run()
}
animloop()
var obj=r2
c0.runlist.push(function(){	
	r1.an+=1.2
	//r2.an+=1.2
	r3.an+=1.2
	var pos=r2.getpos(c0.root)
	
	var an=c0.util.an(pos,c0.newpos(m))
	
	//r2.an=r1.an-an+90
	
	/*
	r2.an+=1
	r3.an+=1
	t1.an+=1
	//l1.p2=mouse
	
	//
	
	var p1=c0.sub(l1.p2,l1.p1),
		m1=c0.sub(mouse,l1.p1),
		p2=c0.sub(l2.p2,l2.p1),
		m2=c0.sub(mouse,l2.p1),
		p3=c0.sub(l3.p2,l3.p1),
		m3=c0.sub(mouse,l3.p1)
	
	m1={
		x:m1.y,
		y:-m1.x
	}
	m2={
		x:m2.y,
		y:-m2.x
	}
	m3={
		x:m3.y,
		y:-m3.x
	}
		
	var dp1=p1.x*m1.x+p1.y*m1.y,
		dp2=p2.x*m2.x+p2.y*m1.y,
		dp3=p3.x*m3.x+p3.y*m1.y
	/*	
	if(dp1>0){
		l1.color='blue'
	} else {
		l1.color='red'
	}
	/*
	if(dp2>0){
		l2.color='blue'
	} else {
		l2.color='red'
	}
	if(dp3>0){
		l3.color='blue'
	} else {
		l3.color='red'
	}
	/**/
	
	//console.log('dp:',dp1,dp2,dp3)
})
/**/
//c0.redraw()
c0.root.render()

/*
//c0.run(10)

c0.canvas.s('border:1px solid red')

var map=c0.rect({
	name:'map',
	x:0,
	y:0,
	wid:50000,
	hig:50000,
	fill:'#94B856',
	linecol:'black',
	linewid:3
})
map.to(c0.root)

map.on('mousedown',function(e){
	spot.pos(e.pos)
	map.mousedown=true
})
map.on('mouseup',function(e){
	spot.pos(e.pos)
	map.mousedown=false
})
map.on('mousemove',function(e){
	if(map.mousedown){
		spot.pos(e.pos)
	}
})

var spot=c0.circ({
	x:0,
	y:0,
	rad:10,	
	fill:'#A2FF00'
})
spot.to(c0.root)

var pls=[]
function addpls(){
	var nr=10,
		pl
	loop(nr,function(i){
		var col='#B88A27',
			hp=30
		if(i==0){
			col='#75A621'
			hp=100000
		}
		pl=c0.circ({
			x:Math.random()*500,
			y:Math.random()*500,
			rad:20,	
			fill:col
		})
		pl.dam=10
		pl.hp=hp
		pl.regen=1
		pl.globalcooldown=new Date().getTime()
		
		//spells
		pl.spellindex=0
		pl.spells=[
			{
				name:'dam',
				val:10,
				cool:0,
				lastcast:0
			},
			{
				name:'heal',
				val:10,
				cool:0,
				lastcast:0
			},
			{
				name:'dot',
				val:30,
				cool:5000,
				lastcast:0
			},			
		]
		
		
		pl.to(c0.root)
		pls.push(pl)
		console.log('pl:',pl)
	})
}
addpls()
var me=pls[0]
function movepls(){
	var dist,
		aggro=200,
		attack=200
		
	loop(pls,function(i,e){
		if(e!=me){
			dist=c0.dist(e.pos(),me.pos())
			if(dist<aggro){
				e.fol(me.pos(),0.1)
				if(dist<attack){
					doattack(e,me)
				}
			}
		} else {
			me.fol(spot.pos(),0.2)		
		}
	})
}
var bullets=[]
function addbullet(owner,tar){
	var bul=c0.circ({
		x:0,
		y:0,
		rad:5,	
		fill:owner.fill
	})
	bul.pos(owner.pos())
	bul.owner=owner
	bul.tar=tar
	bul.birth=new Date().getTime()
	bullets.push(bul)
	bul.to(c0.root)
}
function movebullets(){
	var remlist=[]
	loop(bullets,function(i,bul){
		bul.fol(bul.tar,0.8)
		if(c0.time.ct-bul.birth>200){			
			remlist.push(bul)
		} else if (c0.dist(bul.pos(),bul.tar.pos())<10){
			remlist.push(bul)
		}
	})
	loop(remlist,function(i,bul){
		var ind=bullets.indexOf(bul)
		bullets.splice(ind,1)
		bul.rem()
	})
}
function getspell(pl){
	var len=pl.spells.length,
		ind=pl.spellindex,
		spell=false,
		last
	
	loop(function(i){
		ind+=i
		ind%=len
		spell=pl.spells[ind]
		//console.log('check if can cast:',spell.name,ind)
		if(i>=len){
			return false
		}		
		last=c0.time.ct-spell.lastcast		
		if(last>=spell.cool){
			spell.lastcast=new Date().getTime()
			pl.spellindex=ind+1			
			//console.log('can cast:',spell.name,ind)
			return false
		} else {
			spell=0
		}
	})
	return spell
}
function doattack(a,b){	
	if(c0.time.ct-a.globalcooldown>globalcooldown){
		a.globalcooldown=c0.time.ct
		addbullet(a,b)
		var spell=getspell(a)
		//console.log(spell)
		b.hp-=a.dam
		if(b.hp<0){
			d.dead=true
			var ind=pls.indexOf(b)
			pls.splice(ind,1)
		}
	}
}

c0.runlist.push(movepls)
c0.runlist.push(movebullets)



//skillchain
var ele=d.body.r('div id=skillchain'),
	sp
ele.s('display:inline-block position:absolute bottom:0px left:50%')
loop(me.spells,function(i,e){
	sp=ele.r('div')
	sp.s('display:inline-block width:64px height:64px border:1px solid #aaa background:#fff')
	sp.h(e.name)
})

/**/