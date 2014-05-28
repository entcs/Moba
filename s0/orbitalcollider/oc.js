//solar collider
//orbital collider
c0.run()
c0.canvas.width=1200
c0.canvas.height=800

var snd={
	mute:false,
	setvol:function(vol){
		loop(this.snds,function(k,v){
			v.volume=vol
		})
		this.vol=1
	},
	col:1,
	play:function(name){
		if(!this.mute){
			var sound=this.snds[name]
			//console.log('sound:',sound)
			//sound.src=sound.src
			sound.currentTime = 0
			//sound.load()
			sound.play()
		}
	},
	snds:{},
	add:function(name,vol){
		vol=vol||1
		var a=new Audio(name+".wav")
		console.log(a)
		this.snds[name]=a
		this.snds[name].volume=vol
	}
}
var vol=0.5
snd.add('hit',vol)
snd.add('bounce',vol)
snd.add('move',vol)
snd.add('base',0.5)
snd.add('base2',1)
snd.add('hat',0.1)
snd.add('hat2',0.1)
snd.add('bam',0.1)
snd.add('bam2',0.5)
snd.add('solo',0.2)
snd.add('solo2',0.2)
//snd.setvol(0.1)
//snd.mute=1
var samples=[
	{
		name:'',
		color:''
	},
	{
		name:'base',
		color:'yellowgreen'
	},
	{
		name:'hat',
		color:'orange'
	},
	{
		name:'bam',
		color:'yellow'
	},
	{
		name:'solo',
		color:'white'
	},
	{
		name:'base2',
		color:'yellowgreen'
	},
	{
		name:'hat2',
		color:'orange'
	},
	{
		name:'bam2',
		color:'yellow'
	},
	{
		name:'solo2',
		color:'white'
	}		
]

var left=c0.rect({
	x:100,
	y:c0.canvas.height/2,
	wid:200,
	hig:c0.canvas.height,
	color:'#000'
}).to()
var right=c0.rect({
	x:c0.canvas.width-100,
	y:c0.canvas.height/2,
	wid:200,
	hig:c0.canvas.height,
	color:'#000'
}).to()

var lpads=[],
	rpads=[],
	psd,
	x,
	y,
	wid=48,
	hig=48
loop(64,function(i){
	x=-left.wid/2+1+(i%4)*(wid+2)+wid/2
	y=(-left.hig/2+1+Math.floor(i/4)*(hig+2)+hig/2)
	color='rgba(255,255,255,0.2)'
	var sample=0,
		mute=true

	if(i%4==0){
		sample=4
	} else if(i%4==1){
		sample=3		
	} else if(i%4==2){
		sample=2
	} else if(i%4==3){
		sample=1
	}
	pad=c0.rect({
		x:x,
		y:y,
		wid:wid,
		hig:hig,
		mute:mute,
		sample:sample,
		color:color
	}).to(left)
	lpads.push(pad)
	
	color='rgba(255,255,255,0.2)'
	var sample='',
		mute=true
	if(i%4==0){
		sample=8
	} else if(i%4==1){
		sample=7		
	} else if(i%4==2){
		sample=6
	} else if(i%4==3){
		sample=5
	}
	pad=c0.rect({
		x:x,
		y:y,
		wid:wid,
		hig:hig,
		mute:true,
		sample:sample,
		color:color
	}).to(right)
	rpads.push(pad)
})

//test
var ltest=[7 ,
		17,
		26,
		31,
		36,
		44,
		47,
		49,
		59
	],
	rtest=[
		3,
		10,
		17,
		22,
		24,
		40,
		49,
		54
	]
/*
loop(ltest,function(i,n){
	lpads[n].mute=false
})
loop(rtest,function(i,n){
	rpads[n].mute=false
})
/**/



c0.canvas.on('click',function(e){
	console.log('click')
	var pos,
		w2,
		h2
	loop(lpads,function(i,p){
		pos=p.getpos()
		w2=p.wid/2
		h2=p.hig/2
		//console.log(pos,c0.m)
		if(c0.m.x>pos.x-w2 && c0.m.x<pos.x+w2 && c0.m.y>pos.y-h2 && c0.m.y<pos.y+h2){
			if(p.mute){
				p.mute=false
				p.color=samples[p.sample].color
			} else {
				p.mute=true
			}			
		}
	})
	loop(rpads,function(i,p){
		pos=p.getpos()
		w2=p.wid/2
		h2=p.hig/2
		//console.log(pos,c0.m)
		if(c0.m.x>pos.x-w2 && c0.m.x<pos.x+w2 && c0.m.y>pos.y-h2 && c0.m.y<pos.y+h2){
			if(p.mute){
				p.mute=false
				p.color=samples[p.sample].color
			} else {
				p.mute=true
			}			
		}
	})
	
})

var padsnd={
	step:0,
	task:c0.addtask({
		interval:250,
		fn:function(){
			padsnd.step+=1
			padsnd.step%=16
			
			loop(lpads,function(i,p){
				if(!p.mute){		
					s=samples[p.sample]
					p.color=s.color
				} else {
					p.color='rgba(255,255,255,0.2)'
				}
			})
			pads=lpads.slice(padsnd.step*4,(padsnd.step*4)+4)
			loop(pads,function(i,p){
				if(!p.mute){
					s=samples[p.sample]
					p.color=s.color
					if(!p.mute){
						snd.play(s.name)
					}
				} else {
					p.color='rgba(255,255,255,0.4)'
				}	
			})
			loop(rpads,function(i,p){
				if(!p.mute){		
					s=samples[p.sample]
					p.color=s.color
				} else {
					p.color='rgba(255,255,255,0.2)'
				}
			})
			pads=rpads.slice(padsnd.step*4,(padsnd.step*4)+4)
			loop(pads,function(i,p){
				if(!p.mute){
					s=samples[p.sample]
					p.color=s.color
					if(!p.mute){
						snd.play(s.name)
					}
				} else {
					p.color='rgba(255,255,255,0.4)'
				}	
			})
		}
	})
}



var orbit=c0.circ({
	name:'orbit',
	x:c0.canvas.width/2,
	y:c0.canvas.height/2,
	rad:380,//Math.min(c0.canvas.width,c0.canvas.height)/2-40,
	linecolor:'yellowgreen',
	linewid:4	
}).to()
var pl={
	root:c0.node().to(orbit),
	vis:c0.circ({
		x:0,
		y:orbit.rad+64,
		rad:100,
		linecolor:'yellowgreen',
		linewid:'4',
		hidden:true
	}),
	direction:0,
	speed:0,
	left:false,
	right:false,
	jump:false
	
}
pl.vis.to(pl.root)
pl.vis.enable()
pl.arc=c0.circ({
	x:0,
	y:0,
	rad:100,
	//an:0,
	arc:Math.PI*0.5,
	linecolor:'yellowgreen',
	color:'yellowgreen'
	//linewid:'6'
}).to(pl.vis)
pl.root.an=5

var balls=[],
	bb
loop(4,function(i){
	bb=c0.circ({
		x:240,
		y:80,
		rad:10,
		color:'orange',
		speed:0.2
	}).to(orbit)	
	bb.an=Math.random()*360
	bb.vis=c0.line({
		p1:{x:-20,y:1},
		p2:{x:20,y:1},
		color:'red',
		linewid:2,
		hidden:true
	}).to(bb)
	bb.enable()
	balls.push(bb)
})

look=c0.node({	
}).to()
look.vis=c0.line({
	p1:{x:0,y:0},
	p2:{x:0,y:-100},
	color:'blue',
	linewid:2
}).to(look)


d.body.on('keydown',function(e){	
	switch(e.which){
		case 65:
		case 37:
			//left
			pl.left=true
			break
		case 68:
		case 39:
			//right
			pl.right=true
			break
		case 87:
		case 32:
		case 38:
			//jump
			
			pl.root.an+=180
			pl.root.an%=360
			pl.an=pl.root.an
			//orbit.an=-pl.an
			/**/
			//ball.x=ball.y=0
			//ball.speed=0.2
			
			snd.play('move')
			e.preventDefault()
			e.stopPropagation()
			break
	}
})
var speed=0,
	acc=0.0005,
	max=0.1,
	vec={
		x:0,
		y:0
	}
pl.root.an=150
var pts=[]
loop(10,function(i){
	pts.push(c0.circ({
		name:'circ'+i,
		rad:5,
		color:'green'
	}).to())
})
d.body.on('keyup',function(e){	
	switch(e.which){
		case 65:
		case 37:
			//left
			pl.left=false
			break
		case 68:
		case 39:
			//right
			pl.right=false
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
var td=0,
	lt=new Date().getTime(),
	ct=0
pts[5].to(pts[4])

/*
c0.canvas.on('click',function(e){
	an=c0.an(orbit.getpos(),c0.m)
	pl.an=an
	if(pl.an-pl.root.an>0){
		console.log('+')
	} else if(pl.an-pl.root.an<0){
		console.log('-')
	} else {
		console.log('=')
	}	
	//console.log(pl.an,pl.root.an)
})
/**/
pl.max=0.1
pl.acc=0.0003
pl.root.an=0
//orbit.an=-45
function test(){
	//pl.root.pos(c0.m)
	var pside=c0.lpside(ball.vis,pl.vis.getpos())
		bside=c0.lpside(ball.vis,ball.getpos())
		
		//console.log(van)
		//if(c0.sign(mvec,bvec)){	
	if(pside>0){
		ball.vis.color='green'
	} else if(pside<0){
		ball.vis.color='red'		
	}
	
	pts[3].pos(c0.m)
	pts[4].pos(c0.m)
	pts[4].x+=100
	pts[4].y+=100
	
	pts[5].x=100
	if(c0.dist(pts[4],orbit)>orbit.rad){
		oan=c0.an(orbit.getpos(),pts[4].getpos())
		van=c0.an(pts[3].getpos(),pts[4].getpos())
		dif=van-oan
		pts[4].an=90-2*dif+van
		pts[4].color='red'		
		//pts[4].an=oan-dif+90//-(pts[4].getan()-pts[4].an)
		//console.log('t:',oan,van,dif)
	} else {
		pts[4].color='green'
	}
	//console.log(pside,bside)	
}
function dostuff(){
	ct=new Date().getTime()
	td=ct-lt
	//td=16
	if(pl.left){
		pl.speed+=pl.acc*td
	} else if(pl.right){		
		pl.speed-=pl.acc*td
	} else {
		speed=pl.acc*td
		speed=Math.min(speed,Math.abs(pl.speed))	
		if(pl.speed>0){
			pl.speed-=speed
		} else if(pl.speed<0) {
			pl.speed+=speed
		}
	}
	if(pl.speed>pl.max){
		pl.speed=pl.max
	}else 	if(pl.speed<-pl.max){
		pl.speed=-pl.max
	}

	pl.root.an+=pl.speed*td
	pl.root.an%=360	
	
	loop(balls,function(i,bb){
		var dist=orbit.dist(bb.getpos())	
		//ball orbit
		if(dist>orbit.rad){
			mvec=c0.lpside(bb.vis,orbit.getpos())		
			bvec=c0.lpside(bb.vis,bb.getpos())				
			if(!c0.sign(mvec,bvec)){
				snd.play('bounce')
				oan=c0.an(orbit.getpos(),bb.getpos())
				van=bb.getan()
				if(van<0){
					van+=360
				}
				dif=van-oan
				ban=bb.getan()//-ball.an
				bb.an+=2*(90-dif)
				bb.an%=360			
				//add effect				
				
				task=c0.addtask({
					life:200,
					interval:10,
					oh:c0.circ({
						rad:orbit.rad,
						linewid:2,
						//linecolor:'rgba(255,255,255,1)'
					}).to(orbit),
					fn:function(){
						var nr=new Date().getTime()-this.birth						
						this.oh.rad+=nr/20
						this.oh.linecolor='rgba(255,155,0,X)'.replace('X',1-(nr/this.life))
					},
					ondeath:function(){
						this.oh.rem()
					}
				})
				/**/
			}
		}	
		bb.move(td*bb.speed)
		
		//ball pl
		var col=c0.cc(pl.vis,bb)
		if(col){
			bpos=bb.getpos()		
			plpos=pl.vis.getpos()
			mvec=c0.lpside(bb.vis,pl.vis.getpos())		
			bvec=c0.lpside(bb.vis,bb.getpos())						
			if(c0.sign(mvec,bvec)){
				snd.play('hit')
				van=c0.an(plpos,bpos)
				ban=bb.getan()-bb.an			
				van-=ban//+180
				bb.an=van
				bb.an%=360
				pos=pl.vis.getpos()				
				task=c0.addtask({
					life:200,
					interval:10,
					oh:c0.circ({
						x:pos.x,
						y:pos.y,
						an:pl.root.getan(),
						rad:pl.vis.rad,
						linewid:3,
						arc:Math.PI*0.5//pl.vis.arc
						//linecolor:'rgba(255,255,255,1)'
					}).to(),
					fn:function(){
						var nr=new Date().getTime()-this.birth												
						this.oh.rad+=nr/100
						this.oh.arc+=nr/4000
						this.oh.linecolor='rgba(173,255,47,X)'.replace('X',1-(nr/this.life))
					},
					ondeath:function(){
						this.oh.rem()
					}
				})				
			}
		}			
	})
	
	lt=ct
}
c0.canvas.on('mousemove',function(e){
	//test()
	//dostuff()
})
c0.ondraw=function(td){	
	dostuff()
}
c0.addtask({
	interval:10,
	fn:function(){
		//dostuff()
	}
	
})


