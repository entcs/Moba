var loop=function(obj,fn){
	if(obj){
		if(fn===undefined){
			var count=0
			while(obj(count)!==false) count+=1		
		} else if(typeof(obj)=='number'){
			for(var nr=0;nr<obj;nr++) if(fn(nr)===false) break		
		} else if(obj.length){		
			for(var nr=0;nr<obj.length;nr++) if(obj.hasOwnProperty(nr)) if(fn(nr,obj[nr])===false) break					
		} else {
			for(var key in obj) if(fn(key,obj[key])===false) break		
		}	
	}
}
var objlen=function(obj){
	var len=0
	loop(obj,function(i){
		len+=1
	})
	return len
}
Node.prototype.trigger=function(n,a){
	var e = document.createEvent("HTMLEvents");
	e.initEvent(n, true, true ); // event type,bubbling,cancelable		
	if (a) e.args=a;
	this.dispatchEvent(e);	
	return this;
}
Node.prototype.on=function(name,fn){
	this.addEventListener(name,fn,false)
	if (!this.eventfunctions) this.eventfunctions={}
	this.eventfunctions['efn-'+name]=fn
	return this
}
Number.prototype.round=function(round){
	var pow = Math.pow(10,round||0)
	return Math.round(this*pow)/pow
}
MouseEvent.prototype.stop=false
MouseEvent.prototype.node=false
var gg={
	runtime: 16,
	resize:false,
	showframerate: false,
	nodes:[],
	uidcount:0,
	m:{x:0,y:0},
	lm:{x:0,y:0},
	mvec:{x:0,y:0},
	lt:new Date().getTime(),
	ct:new Date().getTime(),
	dt:0,
	ldt:0,
	tasks:{},
	deadtasks:{},
	//events
	down:{},
	up:{},
	click:{},
	move:{},
	//collisions
	collidables:{},
	collisions:{},
	//overs
	over:0,
	lastover:0,
	//addcanvas
	addcanvas:function(a){		
		//add root node
		this.root=this.node('root')
		this.clearcolor = a.clearcolor || '#fff'
		if(a && a.canvas){
			this.canvas=a.canvas
		} else {
			this.canvas=document.createElement('canvas')
			document.body.appendChild(this.canvas)
			if(a && a.id){
				this.canvas.id=a.id
			} else {
				this.canvas.id='canvas'+new Date().getTime()
			}
			if(a.wid){
				if(typeof(a.wid) == 'string' && a.wid.indexOf('%')!=-1){
					var pct = parseInt(a.wid)
					a.wid = window.innerWidth*pct/100
				}
				this.canvas.width=a.wid
			}
			if(a.hig){
				if(typeof(a.hig) == 'string' && a.hig.indexOf('%')!=-1){
					var pct = parseInt(a.hig)
					a.hig = window.innerHeight*pct/100
				}				
				this.canvas.height=a.hig
			}
		}
		this.c2=this.canvas.getContext('2d')
				
		//add fps
		this.fps = this.text({
			x:5,
			y:10,
			text: 'fps'			
		})
				
		//add events to canvas
		this.addevents()
		this.run()
	},	
	//primitives
	node:function(name){
		self=this
		var node={
				uid:gg.uid(),
				type:'node',
				name:name,
				parent:0,	
				children:[],
				visible:true,
				an:0,
				scale:1,
				sx:1,
				sy:1,
				x:0,
				y:0,				
				hit:0,
				events:{},
				enabled:false,
				mouseover:false,
				active:false,
				removed:false,
				//rendering
				to:function(parent){
					if(this.parent){
						this.parent.children.splice(this.parent.children.indexOf(this),1)
					}
					parent.children.push(this)
					this.parent=parent				
					return this
				},
				rem:function(){
					var ind=this.parent.children.indexOf(this)
					this.parent.children.splice(ind,1)

					ind=gg.nodes.indexOf(this)					
					gg.nodes.splice(ind,1)
					this.removed=true	
					return this
				},
				//util	
				mpos:function(){
					var pos=this.getpos(),
						scale=this.getscale(),
						dif=gg.sub(gg.m,pos)
					pos.x=dif.x/scale
					pos.y=dif.y/scale
					return pos
				},
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
				scale:function(a){
					if(a){
						this.sx=a
						this.sy=a
					} else {
						return {
							sx:this.sx,
							sy:this.sy
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
						pos.x*=scale.sx
						pos.y*=scale.sy
						
						pos=gg.rot(pos,this.parent.getan())
						var ppos=this.parent.getpos()
						pos=gg.add(pos,ppos)
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
					var sx=this.sx,
						sy=this.sy
					if(this.parent){
						sc=this.parent.getscale()
						sx*=sc.sx
						sy*=sc.sy
					}
					return {sx:sx,sy:sy}
				},
				fol:function(p,speed){
					var p1=this.pos(),
						p2=p,
						dif=gg.sub(p2,p1),
						norm=gg.norm(dif),
						dist=gg.dist(p1,p2),			
						move={
							x:norm.x*speed*gg.dt/1000,
							y:norm.y*speed*gg.dt/1000
						}		
					if(Math.abs(move.x)>Math.abs(dif.x)){
						move.x=dif.x
					}
					if(Math.abs(move.y)>Math.abs(dif.y)){
						move.y=dif.y
					}		
					move=gg.add(p1,move)	
					this.pos(move)		
				},								
				look:function(p,speed){
					this.an=self.an(this,p)
				},
				dist:function(p){
					return gg.dist(this.getpos(),p)
				},
				ishit:function(p){
					if(this.hit=='circ'){
						if(gg.dist(this.getpos(),p)<=this.rad*this.getscale()){
							gg.canvas.s('cursor:pointer')
							return true
						}						
					} else {
						//rect
					}
					var b=this.bounds
					if(this.type=='circ'){
						if(gg.dist(this.pos(),p)<=this.rad){
							gg.canvas.s('cursor:pointer')
							return true
						}
					} else {
						var pos=this.getpos(),
							an=this.getan(),
							scale=this.getscale(),
							w2=this.wid/2,
							h2=this.hig/2
							
						pos=gg.sub(p,pos)
						pos=gg.rot(pos,-an)
						pos.x/=scale
						pos.y/=scale										
						if(pos.x>-w2 && pos.x<w2 && pos.y>-h2 && pos.y<h2){							
							return true
						}
			
					}
					return false
				},
				move:function(speed){
					var vec=gg.rot({x:0,y:-speed},this.an)
					this.x+=vec.x
					this.y+=vec.y					
				},
				//events
				trigger:function(name,data){
					var fn=this.events[name]
					if(fn){
						fn(data)
					}
				},
				on:function(name,callback){
					this.active=true
					this.events[name]=callback
				},
				off:function(name){
					delete this.events[name]
				},				
				//collisions
				enable:function(){
					this.enabled=true
					gg.collidables[this.uid]=this
					return this
				},
				disable:function(){
					this.enabled=false
					delete gg.collidables[this.uid]
					return this
				},
				//animate:function(type,val,time,mode){
				animate:function(fn){
					var anim=fn
					/*
					var anim={
						type:type,
						mode:mode,
						node:this,
						val:val,
						sx:this.sx,
						sy:this.sy,
						x:this.x,
						y:this.y,
						an:this.an,
						color:this.color,
						linecolor:this.linecolor,
						linewid:this.linewid,
						time:time,
						start:new Date().getTime(),
						end:new Date().getTime()+time,
						rem:function(){
							var ind=can.animations.indexOf(this)
							can.animations.splice(ind,1)
							node.anim=0
						},
						animate:function(dt,ct){									
							if(ct>this.end){
								if(this.type=='scale'){
									//node.sx=this.val											
									//node.sy=this.val
								}									
								this.rem()
							} else {
								if(this.type=='scale'){
									var nr=(ct-this.start)
									var sin=1+Math.sin((Math.PI)*nr*10/this.time)
									//console.log(sin)
									var val=sin*dt/1000
									node.sx=this.sx+sin/10
									node.sy=this.sy+sin/10
								}
							}
						}
					}
					*/
					self.animations.push(anim)
					this.anim=anim
					return anim
				}
			}
		this.nodes.push(node)
		
		//attach to root node
		if(name!='root'){
			node.to(this.root)
		}
		return node
	},
	rect:function(a){
		var node=this.node('rect')
		node.type='rect'
		node.hit='rect'
		node.wid=100
		node.hig=50
		node.color='#aaa'
		loop(a,function(k,v){
			node[k]=v
		})
		self=this
		node.draw=function(){
			var c=self.c2					
			c.beginPath()
			c.rect(-this.wid/2,-this.hig/2,this.wid,this.hig)
			if(this.color){
				c.fillStyle = this.color
				c.fill()
			}
			if(this.linewid){
				c.lineWidth = this.linewid//*scale
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
		var self = this
		node.draw=function(){
			var c=self.c2
			c.beginPath()			
			an=Math.PI*1.5+gg.ator(node.getan())
			c.arc(0,0, this.rad, an-node.arc/2, an+node.arc/2, false)
			if(this.color){
				c.fillStyle = this.color
				c.fill()
			}
			if(this.linewid){
				c.lineWidth = this.linewid*this.getscale().sx
				c.strokeStyle = this.linecolor
				c.stroke()
			}
		}
		return node		
	},
	line:function(a){
		//gradient line
		// var grad= ctx.createLinearGradient(50, 50, 150, 150);
		// grad.addColorStop(0, "red");
		// grad.addColorStop(1, "green");

		// ctx.strokeStyle = grad;

		// ctx.beginPath();
		// ctx.moveTo(50,50);
		// ctx.lineTo(150,150);

		// ctx.stroke();
		
		var node=this.node('line')
		node.type='line'
		loop(a,function(k,v){
			node[k]=v
		})
		node.pos(node.p1)
		self=this
		node.draw=function(){
			node.pos(node.p1)
			var c=self.c2
			c.beginPath()
			//c.moveTo(node.p1.x,node.p1.y)
			c.moveTo(0,0)
			var scale=this.parent.getscale(),
				x=node.p2.x-node.p1.x,
				y=node.p2.y-node.p1.y
			c.lineTo(x,y)
			c.strokeStyle = this.color || 'black'
			if(this.linewid){
				c.lineWidth = this.linewid*this.getscale().sx			
			}			
			c.stroke()
		}
		return node			
	},
	text:function(a){
		//context.font = "normal normal 20px Verdana";
		//[font style][font weight][font size][font face]
		var node=this.node('text')
		node.hit='rect'
		loop(a,function(k,v){
			node[k]=v
		})
		node.type='text'
		self=this
		node.draw=function(){					
			var c=self.c2
			c.textAlign = this.align || 'left'
			c.font='Xpx sans-serif'.replace('X',node.size)
			if(this.font){
				c.font = this.font
			}
			c.fillStyle=this.color || 'black'			
			if(this.linewid){
				c.lineWidth = this.linewid
				c.strokeStyle = this.linecolor || 'black'				
				c.strokeText(this.text,0,0)
			}
			c.fillText(this.text,0,0)
		}
		return node			
	},
	img:function(a){
		self=this
		var node=this.node('img')
		node.type='img'
		node.hit='rect'
		node.imgready=false
		loop(a,function(k,v){
			node[k]=v
		})
		if(node.img){		
			//from image object
			if(node.img.tagName.toLowerCase()=='canvas'){
				//from canvas
				var img=new Image()
				img.src=node.img.toDataURL('image/png')
				node.img=img
			}					
			node.src=node.img.src
		} else {
			//from src
			node.img=new Image()				
			node.img.src=node.src
		}
		// if(node.onload){
			// node.on('load',node.onload)
		// }
		// node.img.onload=function(e){
			// node.imgready=true
			// node.trigger('load')
		// }					
						
		node.draw=function(){						
			node.wid = node.wid || node.clipw || node.img.naturalWidth
			node.hig = node.hig || node.cliph || node.img.naturalHeight				
			if(node.flipx){
				self.c2.scale(-1, 1)
			}	
			if(node.flipy){
				self.c2.translate(hig, 0)
				self.c2.scale(1, -1)
			}			
			self.c2.drawImage(node.img,node.clipx || 0, node.clipy || 0, node.clipw || node.wid,node.cliph || node.hig,node.offx || 0, node.offy || 0, node.wid, node.hig)
		}
		return node
	},
	pat:function(a){
		var self=this
		var node=this.node('pat')
		node.type='pat'
		node.hit='rect'
		var imgo=new Image()
		loop(a,function(k,v){
			node[k]=v
		})		
		imgo.src = a.src
		node.imgo=imgo
		node.imgready=false						
		imgo.onload = function() {
			node.imgready=true
			node.pat=self.c2.createPattern(node.imgo, 'repeat')
			gg.render(node)
		}
		node.draw=function(){
			if(node.imgready){
				// pos=node.getpos()
				// x=pos.x-node.wid/2
				// y=pos.y-node.hig/2
				//gg.c.drawImage(imgo,offx,offy, node.wid,node.hig,x,y, node.wid, node.hig)
				self.c2.fillStyle = node.pat				
				self.c2.fillRect(node.x, node.y, node.wid, node.hig) // context.fillRect(x, y, width, height);				
			}						
		}
		return node	
	},
	//rendering
	clear:function(){
		this.c2.fillStyle=this.clearcolor
		this.c2.fillRect(0, 0, this.canvas.width, this.canvas.height)
		//this.c2.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	draw:function(node){
		var c=this.c2
		if(!node){
			node=this.root
		}				
		if(node.visible){
			//console.log('node:',node)
			c.save()
			c.globalAlpha = node.alpha || 1
			//translate
			if(node.pixelperfect){
				if(node.x || node.y) c.translate(node.x.round(),node.y.round())
			} else {
				if(node.x || node.y) c.translate(node.x,node.y)	
			}
			
				
			//rotate
			if(node.an%360) c.rotate(gg.ator(node.an))
				
			//scale
			if(node.sx!=1 || node.sy!=1) c.scale(node.sx,node.sy)					
				
			if(node.draw){
				node.draw()
			}	
			self = this
			loop(node.children,function(i,chi){
				self.draw(chi)
			})
			//restore
			c.restore()
		}
	},
	render:function(node){
		node=node||this.root
		this.clear()		
		this.draw(node)
	},			
	//events
	addevents: function(){
		var self = this
		
		var bounds,
			events={
				click:0,
				mousedown:0,
				mouseup:0,
				dblclick:0,
				mousewheel:0,
				mousemove:function(e){
					var bounds=self.canvas.getBoundingClientRect()
					self.m.x=e.x-bounds.left
					self.m.y=e.y-bounds.top
					
					//mouse over
					var hits=self.doevents(self,'mouseover',self.root)	
					loop(hits,function(i,n){
						n.events.mouseover()
						if(!n.mouseover){
							//mouse enter
							n.trigger('mouseenter')
						}
						n.mouseover=true
					})
					loop(self.nodes, function(i,n){
						if(n.events.mouseout && n.mouseover && hits.indexOf(n)==-1){
							//moseout
							n.events.mouseout()
							n.mouseover=false
						}
					})
					
				},
				mouseover:0,
				mouseout:0,
				touchstart:0,
				touchmove:0,
				touchend:0,
				touchenter:0,
				touchleave:0,
				touchcancel:0
			}
		
		loop(events,function(n,fn){
			self.canvas.on(n,function(e){					
				if(fn) fn(e)
				var hits=self.doevents(self,n,self.root)
				loop(hits,function(i,node){
					if(!e.stop){
						e.node=node
						node.events[n](e)
					} else {
						return false
					}
				})				
			})			
		})
		//resize
		window.addEventListener('resize', function(){
			self.canvas.width=window.innerWidth
			self.canvas.height=window.innerHeight
		})
	},	
	doevents:function(self,event,node,hits){		
		hits=hits || []
		if(node.active && node.events[event]){			
			if(node.hit){
				var hit
				if(node.hit=='rect'){							
					hit=gg.dr(this.m,node)							
				} else if(node.hit=='circ'){
					hit=gg.dc(this.m,node)					
				}
				if(hit){
					hits.splice(0,0,node)
				}
			}
		}
		
		loop(node.children,function(i,chi){
			self.doevents(self,event,chi,hits)
		})
		return hits
	},
	//animations
	animations:[],
	animate:function(){
		loop(this.animations,function(i,anim){					
			//anim.animate(can.dt,can.ct)
			anim(can.dt,can.ct)
		})
	},	
	//util
	uidcount:0,
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
		if(b){
			var dx=a.x-b.x,
				dy=a.y-b.y,
				dist=Math.sqrt(dx*dx+dy*dy)
			return dist
		} else {
			return Math.sqrt(a.x*a.x+a.y*a.y)
		}
	},
	an:function(a,b){//angle between two points		
		b=gg.sub(b,a)
		
		var an=gg.rtoa(Math.atan(b.x/b.y))			
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
		if(!p.x && !p.y){			
			return p
		}
		var norm=1/Math.sqrt(p.x*p.x+p.y*p.y)
		return {
			x:p.x*norm,
			y:p.y*norm
		}
	},
	random:function(v){
		var rng = Math.random()
		switch (typeof(v)){
			case 'number':
				rng=Math.floor(v*rng)+1
				if(rng>v)rng=v
				break
			case 'string':
				break
			case 'object':
				break
		}		
		return rng
	},
	//tasks
	dotasks:function(){		
		var dotask=false,
			tt=this.ct
		//rem dead tasks
		loop(this.deadtasks,function(name,task){
			if(task.ondeath){
				task.ondeath(gg.time)
			}
			
			delete gg.tasks[task.name]
		})
		this.deadtasks={}
		//do tasks
		loop(this.tasks,function(name,task){
			dotask=true
			//check life
			if(task.life && tt>task.birth+task.life){
				//dead
				task.rem('lifeended')			
				dotask=false			
			}
			//check interval
			if(task.interval){
				if(tt<task.lt+task.interval){
					dotask=false
				} else {
					//check count
					if(task.count){
						task.count-=1
					}			
				}
			//check count				
			} else if(task.count){				
				task.count-=1
			}			
			
			if(dotask){
				task.ct=tt
				task.td=tt-task.lt
				task.run()
				task.lt+=task.interval
				if(!task.count) task.rem('count 0')				
			}
		})	
	},
	addtask:function(a){
		var task={
			name:'task'+gg.uid(),
			run:function(){},			
			rem:function(mes){
				this.mes=mes
				gg.deadtasks[this.name]=this
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
	//run
	run:function(){			
		gg.ct = new Date().getTime()
		gg.dt = gg.ct-gg.lt
		gg.fps.text = 'fps:'+parseInt(1000/gg.dt)
		//smooth dt
		
		
		gg.clear()		
		gg.draw(self.root)		
		gg.dotasks()
		gg.lt=gg.ct
		setTimeout(function(){
			self.run(self)
			//window.requestAnimationFrame(gg.run);
		},gg.runtime)
	},
	//collisions TODO
	lpside:function(l,p){
		var pos=l.getpos(),
			an=l.getan(),
			a=gg.add(pos,gg.rot(l.p1,an)),
			b=gg.add(pos,gg.rot(l.p2,an))
		/*
		pts[0].pos(p)
		pts[1].pos(a)
		pts[2].pos(b)
		/**/
		//line point side check
		var sign=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x)
		return sign
	},
	dc:function(p,c){//dot vs circle
		if(gg.dist(p,c.getpos())<c.rad*c.getscale().sx){
			return true
		}
		return false
	},
	dr:function(d,r){//dot vs rect			
		var pos=gg.sub(d,r.getpos()),
			scale=r.getscale(),
			w2=scale.sx*r.wid/2,
			h2=scale.sy*r.hig/2
		pos=gg.rot(pos,-r.getan())
		if(pos.x>-w2 && pos.x<w2 && pos.y>-h2 && pos.y<h2){
			return true
		}
		return false
	},
	cc:function(n1,n2){//circle vs circle
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
	cl:function(c,l){//circle vs line
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
			if(gg.dist(l.p1,c.getpos())<rad){
				col={n1:c,n2:l,hit:l.p1}
				//c2.pos(l.p1)
			} else if(gg.dist(l.p2,c.getpos())<rad){
				col={n1:c,n2:l,hit:l.p2}
				//c2.pos(l.p2)
			}
		}else if(gg.dist({x:x,y:y},c.getpos())<rad){
			col={n1:c,n2:l,hit:{x:x,y:y}}				
		}	

		//console.log(a,c1,c2,x,y)
		return col
	},
	cr:function(c,r){//circle vs rect
		var col=gg.dr(c,r),
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
				cc=gg.cl(c,{p1:p1,p2:p2})
				if(cc){
					cdist=gg.dist(cc.hit,cpos)						
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
		loop(gg.collidables,function(u1,n1){
			loop(gg.collidables,function(u2,n2){
				cui1=u1+u2
				cui2=u2+u1
				if(u1!=u2 && !gg.collisions[cui1] && !gg.collisions[cui2]){					
					col=gg.collidenow(n1,n2)					
					if(col){
						callback(col)
					}
					gg.collisions[cui1]=col
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
				col=gg.cc(n1,n2)
				break
			case 'circline':
				col=gg.cl(n1,n2)
				break
			case 'circrect':
				col=gg.cr(n1,n2)
				break
			case 'noderect':
				col=gg.dr(n1,n2)
				break
			case 'nodecirc':
				col=gg.dc(n1,n2)
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