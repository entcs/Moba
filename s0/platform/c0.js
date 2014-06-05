var c0={
	init:function(resize){
		this.resize=resize || false
		this.nodes=[]
		this.canvas=document.createElement('canvas')
		this.canvas.id='c0'
		document.body.appendChild(this.canvas)
		this.c=this.canvas.getContext('2d')
		this.root=this.node('root')
		this.addevents(resize)
		
		this.uidcount=0
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
			if(c0.resize){
				c0.canvas.width=window.innerWidth//-2	
				c0.canvas.height=window.innerHeight//-2
				c0.render()
			}
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
		var mc=['click','mousedown','mouseup'],
			bounds
		this.canvas.on('mousemove',function(e){
			c0.canvas.s('cursor:auto')
			bounds=c0.canvas.getBoundingClientRect()
			c0.m.x=e.x-bounds.left
			c0.m.y=e.y-bounds.top
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
	sign:function(){
		var aa=arguments,
			pos=0,
			neg=0,
			res=true
		loop(aa,function(i,a){
			if(a>=0){
				pos=1
				if(neg) res=false
			} else {
				neg=1
				if(pos) res=false
			}
		})
		return res
	},
	dist:function(a,b){
		var dx=a.x-b.x,
			dy=a.y-b.y
		return Math.sqrt(dx*dx+dy*dy)			
	},
	an:function(a,b){		
		b=c0.sub(b,a)
		
		var an=c0.rtoa(Math.atan(b.x/b.y))			
		if(b.x>0){
			if(b.y<0){
				an=-an
			} else {
				an=180-an
			}
		} else {
			if(b.y>=0){
				an=180-an
			} else {
				an=360-an
			}						
		}
		//console.log('an:',an)
		an%=360
		return an
	},
	an3p:function(A,B,C){
		var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
		var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
		var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
		var an=Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))
		an=this.rtoa(an)
		return an%360
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
		var norm=1/Math.sqrt(p.x*p.x+p.y*p.y)
		return {
			x:p.x*norm,
			y:p.y*norm
		}
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
				move:function(speed){
					var vec=c0.rot({x:0,y:-speed},this.an)
					this.x+=vec.x
					this.y+=vec.y					
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
					return this
				},
				disable:function(){
					this.enabled=false
					delete c0.collidables[this.uid]
					return this
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
		node.wid=100
		node.hig=50
		node.color='#aaa'
		loop(a,function(k,v){
			node[k]=v
		})		
		node.getpoints=function(){
			var pos=this.getpos(),
				an=this.getan(),
				scale=this.getscale(),
				w2=scale*this.wid/2,
				h2=scale*this.hig/2,
				pts=[
					c0.add(pos,c0.rot({x:-w2,y:-h2},an)),
					c0.add(pos,c0.rot({x: w2,y:-h2},an)),
					c0.add(pos,c0.rot({x: w2,y: h2},an)),
					c0.add(pos,c0.rot({x:-w2,y: h2},an))
				]
			
			return pts
		}
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
		node.arc=2 * Math.PI
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
				
				//+c0.ator(node.getan())
			c.beginPath()			
			an=Math.PI*1.5+c0.ator(node.getan())
			c.arc(pos.x,pos.y, this.rad*this.getscale(), an-node.arc/2, an+node.arc/2, false)
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
			if(node.draw && !node.hidden){
				node.draw()
			}
			loop(node.children,function(i,e){
				c0.render(e)
			})
		}		
	},
	draw:function(){
		c0.cft=new Date().getTime()		
		c0.clear()
		if(c0.ondraw){
			c0.ondraw(c0.cft-c0.lft)
		}
		c0.render()	
		
		//fps
		c0.c.fillStyle='red'
		c0.c.fillText('X:'+c0.m.x+'Y:'+c0.m.y+'FPS:'+(1000/(c0.cft-c0.lft)).round(),10,10)		
			
		c0.lft=c0.cft
		window.requestAnimationFrame(c0.draw)
	},	
	//loops and tasks
	mainloop:function(){
		this.dotasks()
		this.timeout=setTimeout(function(){			
			c0.mainloop(10)
		},10)
	},
	dotasks:function(){		
		var dotask=false,
			tt=new Date().getTime()
		//rem dead tasks
		loop(this.deadtasks,function(name,task){
			if(task.ondeath){
				task.ondeath(c0.time)
			}
			
			delete c0.tasks[task.name]
		})
		this.deadtasks={}
		//do tasks
		loop(this.tasks,function(name,task){
			//check life
			if(task.life && tt>task.birth+task.life){
				//dead
				task.rem('life')					
			//check interval
			} else if(task.interval){
				if(tt>task.lt+task.interval){
					//check count
					if(task.count!=-1){
						task.count-=1
						if(task.count==0){
							task.rem('interval count')
						}							
					}
					dotask=true
				}
			//check count
			} else {
				dotask=true
				if(task.count==0){
					task.rem('count')
				}				
			}
			if(dotask){
				//console.log('do task')
				task.ct=tt
				task.td=tt-task.lt
				//console.log(tt,task.lt,task.td)
				//console.log(task.interval)
				task.fn()
				task.lt+=task.interval
			}
		})	
	},
	addtask:function(a){
		var task={
			name:'task'+c0.uid(),
			run:function(){},			
			rem:function(mes){
				this.mes=mes
				c0.deadtasks[this.name]=this
			},
			count:-1,
			interval:1,
			life:0,
			lt:new Date().getTime(),
			birth:new Date().getTime(),
			td:0,
			ondeath:false
		}
		loop(a,function(k,v){
			task[k]=v
		})

		var ot=this.tasks[task.name]
		if(ot){
			ot.rem()
		}
		this.tasks[task.name]=task
		return task
	},
	run:function(resize){
		this.init(resize)
		this.draw()
		this.mainloop(resize)
	},
	//collisions TODO
	lpside:function(l,p){
		var pos=l.getpos(),
			an=l.getan(),
			a=c0.add(pos,c0.rot(l.p1,an)),
			b=c0.add(pos,c0.rot(l.p2,an))
		/*
		pts[0].pos(p)
		pts[1].pos(a)
		pts[2].pos(b)
		/**/
		//line point side check
		var sign=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x)
		return sign
	},
	dc:function(p,c){
		if(c0.dist(p,c)<c.rad*c.getscale()){
			return {n1:p,n2:c}
		}
		return false
	},
	dr:function(d,r){			
		var pos=c0.sub(d.getpos(),r.getpos()),
			scale=r.getscale(),
			w2=scale*r.wid/2,
			h2=scale*r.hig/2
		pos=c0.rot(pos,-r.getan())
		if(pos.x>-w2 && pos.x<w2 && pos.y>-h2 && pos.y<h2){
			return {n1:d,n2:r,hit:d.getpos()}
		}
		return false
	},
	cc:function(n1,n2){
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
	},
	cl:function(c,l){
		//console.log('cl:',l)
		var col=false,
			cpos=c.getpos()
		//a1*a2=-1 perpendicular
						
		if(l.p2.x==300 && l.p1.x==300){
			u=1
		}
		//rise of the line			
		var a1=(l.p2.y-l.p1.y)/(l.p2.x-l.p1.x)
		if(a1==0){
			x=c.x
			y=l.p1.y		
		} else if (a1==Infinity || a1==-Infinity){
			x=l.p1.x
			y=c.y			
		} else {
			//shift of the line
			var b1=l.p1.y-a1*l.p1.x
			//rise of perpendicular projection line					
			var a2=-1/a1	
			//shift of perpendicular projection line
			var b2=c.y-a2*c.x
			//col spot
			var x=(b2-b1)/(a1-a2)
			var y=a2*x+b2
		}			
		var rad=c.rad/c.getscale()
		if((x>l.p1.x && x>l.p2.x) || (x<l.p1.x && x<l.p2.x) || (y>l.p1.y && y>l.p2.y) ||(y<l.p1.y && y<l.p2.y)) {				
			if(c0.dist(l.p1,c.getpos())<rad){
				col={n1:c,n2:l,hit:l.p1}
				//c2.pos(l.p1)
			} else if(c0.dist(l.p2,c.getpos())<rad){
				col={n1:c,n2:l,hit:l.p2}
				//c2.pos(l.p2)
			}
		}else if(c0.dist({x:x,y:y},c.getpos())<rad){
			col={n1:c,n2:l,hit:{x:x,y:y}}				
		}		
		//console.log(a,c1,c2,x,y)
		return col
	},
	cr:function(c,r){
		var col=c0.dr(c,r),
			cpos=c.getpos()
		if(col){
			col.n2=r
		} else {
			var pts=r.getpoints(),
				p1=pts[3],
				p2,
				cc,
				dist=Number.MAX_VALUE,
				cdist,
				hit
			//line.p1=pts[0]
			//line.p2=pts[1]			
			loop(pts,function(i,pt){
				p1=pts[i]
				nr=(i+1)%(pts.length)				
				p2=pts[nr]
				cc=c0.cl(c,{p1:p1,p2:p2})
				if(cc){
					cdist=c0.dist(cc.hit,cpos)						
					if(cdist<dist){
						dist=cdist
						col=cc
						cc=false
					}
				}
			})
			if(col){
				col.n2=r
			}
		}
		return col
		
	},	
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
		//line y=ax+c c is crossing of x axes
		//circ sqr(x-a)+sqr(y-b)=sqr(r) a,b are offset
		var type=n1.type+n2.type,
			col=0
		switch (type){
			case 'circcirc':
				col=c0.cc(n1,n2)
				break
			case 'circline':
				col=c0.cl(n1,n2)
				break
			case 'circrect':
				col=c0.cr(n1,n2)
				break
			case 'noderect':
				col=c0.dr(n1,n2)
				break
			case 'nodecirc':
				col=c0.dc(n1,n2)
				break
		}
		return col
	}
	/*
	line v line
	line v rect
	rect v rect	
	/**/
}
/*
d.on('ready',function(e){
	c0.run('resize')
	rect=c0.rect({
		x:400,
		y:200,
		wid:200,
		hig:200,
		color:'red'
	}).to().enable()	
	me=c0.circ({
		x:130,
		y:180,
		rad:24,
		color:'yellowgreen'		
	}).to().enable()
	dot=c0.circ({
		x:80,
		y:180,
		rad:10,
		color:'blue'		
	}).to()
	
	line=c0.line({
		p1:{
			x:100,
			y:100
		},
		p2:{
			x:100,
			y:200
		},
		linewid:5,
		color:'red'
	}).to().enable()

	
	c0.ondraw=function(){
		var dif=c0.sub(c0.m,me.pos())
		rect.an+=1
		
		me.x+=dif.x/10
		me.y+=dif.y/10		
		me.color='yellowgreen'
		c0.collide(function(col){		
			me.color='orange'
			dot.pos(col.hit)
		})
		
	}
})
/*
c0.addtask({
	life:1000,
	interval:10,
	fn:function(){
		console.log('tick')
	}
})
/**/