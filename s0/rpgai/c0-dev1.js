var c0,
	deg=function(an){
		return an*180/Math.PI
	};
(function(){
	var rad=180/Math.PI,
		c
		
	c0={
		init:function(canvas,freq){
			c0.canvas=canvas
			c = canvas.getContext('2d')
			c0.c=c			
			c0.freq=freq||20
			c=canvas.getContext('2d')
			this.root=this.node('root')
			function run(){
				c0.ct=new Date().getTime()
				c0.ft=c0.ct-c0.lt
				c0.lt=c0.ct			
				if(c0.run){
					c0.run()
				}
				c0.render()
				window.setTimeout(run,c0.freq)				
			}				
			var pos
			c0.canvas.on('mousemove',function(e){
				pos=c0.canvas.getpos()
				c0.mpos.x=e.pageX-pos.x
				c0.mpos.y=e.pageY-pos.y				
			})

			c0.canvas.on('click',function(e){				
				var data = c.getImageData(c0.mpos.x,c0.mpos.y,1,1)
				console.log(data)
			})
			
			run()
		},
		ct:new Date().getTime(),
		lt:0,
		ft:0,
		mpos:{x:0,y:0},
		freq:20,
		objs:{},
		nodes:{},
		counter:0,
		nid:function(pre){
			pre=pre || ''
			c0.counter+=1
			c0.counter%Number.MAX_VALUE
			return pre+(new Date().getTime()+c0.counter)
		},
		node:function(name){
			var n={
				type:'node',
				name:name,
				p:0,
				x:0,
				y:0,
				rotation:0,
				vis:1,
				children:[],
				abspos:function(){
					var ax=0,
						ay=0,
						tar=this					
						
					while (tar.p && tar!=c0.root){
						var x,
							y,
							an=tar.p.rotation,
							z=Math.sqrt(tar.x*tar.x+tar.y*tar.y),
							an1=Math.asin(tar.y/z)						
						if(z==0) an1=0
						an2=an1+an
						
						fx=Math.cos(an2)*z
						fy=Math.sin(an2)*z																		
						if(an>=0){
							x=1
							y=1
						} else if(an>=Math.PI/4){
							x=-1
							y=1
						} else if(an>=Math.PI/2){
							x=-1
							y=-1
						} else {
							x=1
							y=-1
						}						
						ax+=fx*x
						ay+=fy*y
						tar=tar.p
					}
					return {x:ax,y:ay}
				},
				pos:function(){//x,y pos x,y,tar pos,tar
					var len=arguments.length
					if(len==1){
						//return relative pos
						if(arguments[0].type=='node'){
							
						} else {
							this.x=arguments[0].x
							this.y=arguments[0].y					
						}
					}else if(len==2){
						if(typeof(arguments[0])=='object'){
							
						} else {
							this.x=arguments[0]
							this.y=arguments[1]
						}
					}else if(len==3){
						
					} else {
						return {x:this.x,y:this.y}
					}
				},
				absrot:function(){
					var rot=0,
						tar=this					
					while (tar.p && tar!=c0.root){
						rot+=tar.rotation
						tar=tar.p
					}
					return rot					
				},
				rotd:function(){
					var len=arguments.length
					if(len) {
						this.rotation=arguments[0]/rad
					} else {
						return this.rotation*rad
					}
				},
				rot:function(){
					var len=arguments.length
					if(len) {
						this.rotation=arguments[0]							
					} else {
						return this.rotation
					}
				},
				to:function(p,loc){
					if(this.p){
						var ind=this.p.children.indexOf(this)
						this.p.children.splice(ind,1)
					}
					p.children.push(this)
					this.p=p
					return this
				},					
				render:function(){
					if(this.vis){		
						c.save()
						c.translate(this.x,this.y)
						c.rotate(this.rotation)
						if(this.draw) {
							/*
							var ppos=this.p.abspos(),
								prot=this.p.absrot(),
								pos=this.abspos(),
								rot=this.absrot()
							//c.save()							
							// c.translate(ppos.x,ppos.y)
							// c.rotate(prot)							
							c.translate(100,0)
							c.rotate(1)
							//c.translate(-pos.x,-pos.y)														
							this.fillStyle='red'
							this.draw()
							c.translate(100,0)
							//c.rotate(1)
							this.fillStyle='green'
							this.draw()
							// c.translate(-ppos.x,-ppos.y)
							
							c.restore()
							/**/
							this.draw()
						}
						
						loop(this.children,function(i,node){
							node.render()
						})
						c.translate(-this.x,-this.y)
						c.restore()
					}
				}
			}
			this.nodes[this.nid('node')]=n
			return n
		},
		circ:function(a){
			var circ=c0.node('circ')					
			d.extend(circ,a)
			
			circ.draw=function(){
				var pos=this.p.abspos(),
					x=pos.x+this.x,
					y=pos.y+this.y
				c.beginPath();
				c.arc(0,0,this.r, 0, 2 * Math.PI, false);
				if(this.fillStyle) {
					c.fillStyle = this.fillStyle
					c.fill()
				}
				if(this.strokeStyle) {
					c.strokeStyle = this.strokeStyle
					c.lineWidth = this.lineWidth || 1
					c.stroke()
				}
			}
			return circ
		},
		rect:function(a){
			var rect=c0.node('rect')
			d.extend(rect,a)				
			rect.draw=function(){//x,y,wid,height					
				var wid=this.width/2,
					hig=this.height/2
					
				c.beginPath()
				c.rect(-wid,-hig,this.width,this.height)																									
				if(this.fillStyle) {
					c.fillStyle = this.fillStyle
					c.fill()
				}
				if(this.strokeStyle) {
					c.strokeStyle = this.strokeStyle
					c.lineWidth = this.lineWidth || 1
					c.stroke()
				}
			}
			return rect
		},
		img:function(a){
			var img = c0.node('img')			
			d.extend(img,a)
			img.img= new Image()
			img.img.src = a.src
			img.haveimg=0
			img.img.onload = function() {
				img.haveimg=1
				img.img.width=img.width || img.img.width
				img.img.height=img.height || img.img.height
			}
			
			img.draw=function(){
				if(this.haveimg) c.drawImage(this.img,-this.img.width/2,-this.img.height/2,this.img.width,this.img.height);
			}
			return img
			
		},
		render:function(){
			c.clearRect(0, 0, canvas.width, canvas.height);
			this.root.render()
		}
	}

})()