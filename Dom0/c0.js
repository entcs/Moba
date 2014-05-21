document.body.style['margin']='0px'
var c0={
	init:function(){
		this.nodes=[]
		this.canvas=document.createElement('canvas')
		this.canvas.id='c0'
		document.body.appendChild(this.canvas)
		this.c=this.canvas.getContext('2d')
		this.root=this.node('root')
		this.addevents()
		
		this.fps=this.text({
			x:10,
			y:10,
			text:'info'
		}).to()
		
		this.m={x:0,y:0}
		this.time={
			lt:new Date().getTime(),
			ct:new Date().getTime(),
			td:0
		}
		this.tasks={}
		this.deadtasks={}
		//events
		this.down={}
		this.up={}
		this.click={}
		this.move={}
		//collisions
		this.collidables={}
		this.collisions={}
	},
	//events
	addevents:function(){
		window.onresize=function(){
			c0.canvas.width=window.innerWidth-2	
			c0.canvas.height=window.innerHeight-2
			c0.render()
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
		this.canvas.on('mousemove',function(e){
			c0.canvas.s('cursor:auto')
			c0.m.x=e.x
			c0.m.y=e.y
		})		
	},	
	//util
	uid:function(){
		//unigue id
		var time=new Date().getTime()
			uid=[time.toString(16),(time+this.uidcount).toString(16)].join('')
		this.uidcount+=1		
		return uid
	},
	uidcount:0,
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
	//new objs
	node:function(name){
		var node={x:0,y:0},		
			ext={
				init:function(){
					this.uid=c0.uid()
					this.type='node'
					this.name=name
					this.parent=0	
					this.children=[]
					this.visible=true
					this.an=0
					this.scale=1
					this.sx=1
					this.sy=1
					this.hit='rect'
					this.events={}
					this.enabled=false
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
						var scale=this.parent.getscale()
						pos.x*=scale
						pos.y*=scale
					
						pos=c0.rot(pos,this.parent.getan())
						var ppos=this.parent.getpos()
						pos=c0.add(pos,ppos)
					}
					return pos
				},			
				getan:function(){
					var an=this.an
					if(this.parent){
						an+=this.parent.getan()
					}					
					return an%360
				},
				getscale:function(){
					var s=this.scale
					if(this.parent){
						s*=this.parent.getscale()
					}
					return s
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
				loop:function(p){},//todo
				dist:function(p){
					return c0.dist(this.getpos(),p)
				},
				ishit:function(p){
					if(this.hit=='circ'){
						if(c0.dist(this.getpos(),p)<=this.rad*this.getscale()){
							c0.canvas.s('cursor:pointer')
							return true
						}						
					} else {
						//rect
					}
					var b=this.bounds
					if(this.type=='circ'){
						if(c0.dist(this.pos(),p)<=this.rad){
							c0.canvas.s('cursor:pointer')
							return true
						}
					} else {
						var pos=this.getpos(),
							an=this.getan(),
							scale=this.getscale(),
							w2=this.wid/2,
							h2=this.hig/2
							
						pos=c0.sub(p,pos)
						pos=c0.rot(pos,-an)
						pos.x/=scale
						pos.y/=scale										
						if(pos.x>-w2 && pos.x<w2 && pos.y>-h2 && pos.y<h2){							
							return true
						}
			
					}
					return false
				},
				//events
				on:function(name,callback){
					c0[name][this.uid]=callback
				},
				off:function(name){
					delete c0[name][this.uid]
				},
				//collisions
				enable:function(){
					this.enabled=true
					c0.collidables[this.uid]=this
				},
				disable:function(){
					this.enabled=false
					delete c0.collidables[this.uid]
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
				pos=this.parent.getpos(),
				pscale=this.parent.getscale(),
				scale=this.getscale(),
				spos=c0.rot(this.pos(),this.parent.an)
			spos.x*=pscale
			spos.y*=pscale			
			pos=c0.add(pos,spos)
						
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
			c.moveTo(pos.x+pts[0].x*scale,pos.y+pts[0].y*scale)
			c.lineTo(pos.x+pts[1].x*scale,pos.y+pts[1].y*scale)
			c.lineTo(pos.x+pts[2].x*scale,pos.y+pts[2].y*scale)
			c.lineTo(pos.x+pts[3].x*scale,pos.y+pts[3].y*scale)
			c.lineTo(pos.x+pts[0].x*scale,pos.y+pts[0].y*scale)
			c.closePath()					
			if(this.color){
				c.fillStyle = this.color
				c.fill()
			}
			if(this.linewid){
				c.lineWidth = this.linewid*scale
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
				pos=this.parent.getpos(),
				spos=c0.rot(this.pos(),this.parent.getan()),
				pscale=this.parent.getscale()
			
			spos.x*=pscale
			spos.y*=pscale
			
			pos=c0.add(pos,spos)
				
				
			c.beginPath()			
			c.arc(pos.x,pos.y, this.rad*this.getscale(), 0, 2 * Math.PI, false)
			if(this.color){
				c.fillStyle = this.color
				c.fill()
			}
			if(this.linewid){
				c.lineWidth = this.linewid*this.getscale()
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
				scale=this.getscale()
				
			var sp2=c0.rot(this.p2,an)
			sp2.x*=scale
			sp2.y*=scale
			var p2=c0.add(pos,sp2)
				
				
			c.beginPath()
			c.moveTo(p1.x,p1.y)
			c.lineTo(p2.x,p2.y)			
			c.strokeStyle = this.color || 'black'
			if(this.linewid){
				c.lineWidth = this.linewid*this.getscale()			
			}			
			c.stroke()
		}
		return node			
	},
	text:function(a){
		//context.font = "normal normal 20px Verdana";
		//[font style][font weight][font size][font face]
		var node=this.node('text')
		
		loop(a,function(k,v){
			node[k]=v
		})		
		node.type='text'
		
		
		node.draw=function(){
			var c=c0.c,
				pos=this.parent.getpos(),
				an=this.parent.getan(),				
				scale=this.getscale(),
				spos=c0.rot(this.pos(),an)
			//console.log(this.pos())
			spos.x*=scale
			spos.y*=scale
			pos=c0.add(pos,spos)
			c.font='Xpx sans-serif'.replace('X',(10*scale).round())
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
	//rendering
	clear:function(){
		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	render:function(node){
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
	draw:function(){
		c0.cft=new Date().getTime()
		c0.fps.text='X:'+c0.m.x+'Y:'+c0.m.y+'FPS:'+(1000/(c0.cft-c0.lft)).round()
		c0.lft=c0.cft
		c0.clear()
		c0.render()
		window.requestAnimationFrame(c0.draw)
	},	
	//loops and tasks
	mainloop:function(){
		this.time.ct=new Date().getTime()
		this.time.td=this.time.ct-this.time.lt
		
		this.dotasks(this.time)
		
		this.time.lt=this.time.ct
		this.timeout=setTimeout(function(){			
			c0.mainloop(10)
		},10)
	},
	dotasks:function(t){		
		//rem dead tasks
		loop(this.deadtasks,function(name,task){
			if(task.ondeath){
				task.ondeath(c0.time)
			}
			
			delete c0.tasks[name]
		})
		this.deadtasks={}
		//do tasks
		loop(this.tasks,function(name,task){
			//check life
			if(task.life && t.ct>task.life){
				//dead
				task.rem('life')					
			//check interval
			} else if(task.interval){
				if(t.ct>task.lt){
					task.lt+=task.interval
					//check count
					if(task.count!=-1){
						task.count-=1
						if(task.count==0){
							task.rem('interval count')
						}							
					}
					task.fn(t)
				}
			//check count
			} else {
				task.fn(t)
				if(task.count==0){
					task.rem('count')
				}				
			}
		})	
	},
	addtask:function(a){
		var task={
			run:function(){},			
			rem:function(mes){
				this.mes=mes
				c0.deadtasks[this.name]=this
			},
			count:-1,
			interval:-1,
			life:0,
			lt:new Date().getTime(),			
			ondeath:false
		}
		loop(a,function(k,v){
			task[k]=v
		})
		if(a.life){
			task.life=c0.time.ct+task.life
		}
		var ot=this.tasks[a.name]
		if(ot){
			ot.rem()
		}
		this.tasks[a.name]=task
		return task
	},
	run:function(){
		this.init()
		this.draw()
		this.mainloop()
	},
	//collisions TODO
	collide:function(callback){		
		var cui1,
			cui2,
			col
		loop(c0.collidables,function(u1,n1){
			loop(c0.collidables,function(u2,n2){
				cui1=u1+u2
				cui2=u2+u1
				if(u1!=u2 && !c0.collisions[cui1] && !c0.collisions[cui2]){					
					col=c0.collidenow(n1,n2)					
					if(col){
						callback(col)
					}
					c0.collisions[cui1]=col
				}
			})
		})		
		this.collisions={}
	},
	collidenow:function(n1,n2){
		var type=n1.type+n2.type,
			col=0
		function cc(n1,n2){
			var dist=n1.dist(n2.getpos()),
				rr=n1.rad+n2.rad,
				dif=rr-dist
				
			if(dif>0){
				return {
					type:'cc',
					n1:n1,
					n2:n2,
					dist:dist,
					rr:rr,
					dif:dif					
				}
			}			
			return 0
		}
		function cl(n1,n2){
			//line formula y=ax+c
			//a1*a2=-1 perpendicular
			
			//rise of the line			
			var a1=(n2.p2.y-n2.p1.y)/(n2.p2.x-n2.p1.x)
			//shift of the line
			var b1=n2.p1.y-a1*n2.p1.x
			//rise of perpendicular projection line			
			var a2=-1/a1
			//shift of perpendicular projection line
			var b2=n1.y-a2*n1.x
			//col spot
			var x=(b2-b1)/(a1-a2)
			var y=a2*x+b2
							
			var rad=n1.rad/n1.getscale()
			if(
				(x>n2.p1.x && x>n2.p2.x) ||
				(x<n2.p1.x && x<n2.p2.x) ||
				(y>n2.p1.y && y>n2.p2.y) ||
				(y<n2.p1.y && y<n2.p2.y)
			) {
				if(c0.dist(n2.p1,n1.getpos())<rad){
					c2.pos(n2.p1)
				} else if(c0.dist(n2.p2,n1.getpos())<rad){
					c2.pos(n2.p2)
				}
			}else if(c0.dist({x:x,y:y},n1.getpos())<rad){
				c2.pos({
					x:x,
					y:y
				})					
			}
		
			
			//console.log(a,c1,c2,x,y)
			
			return false
		}		
		function cr(n1,n2){
			return false
		}
		switch (type){
			case 'circcirc':
				col=cc(n1,n2)
				break
			case 'circline':
				col=cl(n1,n2)
				break
			case 'circrect':
				col=cr(n1,n2)
				break
			case 'rectcirc':
				col=cc(n2,n1)
				break
		}
		return col
	}
	/*
	line v line
	line v circ	
	line v rect
	circ v circ
	cirv v rect
	rect v rect	
	/**/
}
c0.run()

var r1=c0.rect({
	name:'r1',
	x:200,
	y:200,	
	wid:50,
	hig:100,
	an:45,
	scale:2,
	color:'green',
	linecolor:'black',
	linewid:3
})
//r1.to()

var l1=c0.line({
	name:'l1',
	p1:{
		x:100,
		y:100
	},
	p2:{
		x:400,
		y:400
	},
	color:'green',
	linewid:3
})
l1.to()

var r2=c0.rect({
	name:'r2',
	x:100,
	y:100,	
	wid:50,
	hig:100,
	an:-45,	
	color:'red',
	linecolor:'black',
	linewid:3
})
//r2.to(r1)

var c1=c0.circ({
	name:'c1',
	x:50,
	y:50,
	rad:50,
	color:'yellow',
	linecolor:'black',
	linewid:'2'
})
c1.to()

var c2=c0.circ({
	name:'c2',
	x:450,
	y:450,
	rad:10,
	color:'red',
	linecolor:'black',
	linewid:'2'
})
c2.to()
var t2=c0.text({
	x:50,
	y:50,
	text:'hello'
})
t2.to(c1)

c0.addtask({
	name:'test',
	//life:1000,
	//count:3,
	interval:10,
	fn:function(t){
		l1.p1.y+=0.1
		l1.p2.y-=0.1
		//console.log('tick')
		c1.pos(c0.m)
	},
	ondeath:function(t){
		console.log('task ended')
	}

})
c1.enable()
//c2.enable()
l1.enable()
c0.addtask({
	name:'collide',
	interval:10,
	fn:function(t){
		c1.color='yellow'
		c2.color='red'
		c0.collide(function(col){
			col.n1.color='blue'
			col.n2.color='blue'
			
		})
	},
	ondeath:function(t){
		console.log('task ended')
	}

})
