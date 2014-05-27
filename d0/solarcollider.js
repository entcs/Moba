//solar collider
//orbital collider
c0.run()
c0.canvas.width=1200
c0.canvas.height=800

var left=c0.rect({
	x:100,
	y:c0.canvas.height/2,
	wid:200,
	hig:c0.canvas.height,
	color:'#000'
}).to()
var lpads=[],
	psd,
	x,
	y,
	wid=48,
	hig=48
loop(64,function(i){
	x=-left.wid/2+1+(i%4)*(wid+2)+wid/2
	//console.log(Math.floor(i/4))
	y=(-left.hig/2+1+Math.floor(i/4)*(hig+2)+hig/2)
	//console.log(y)
	pad=c0.rect({
		x:x,
		y:y,
		wid:wid,
		hig:hig,
		color:'rgba(255,255,255,0.2)'
	}).to(left)
	lpads.push(pad)
})

var right=c0.rect({
	x:c0.canvas.width-100,
	y:c0.canvas.height/2,
	wid:200,
	hig:c0.canvas.height,
	color:'#000'
}).to()

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
			this.snds[name].currentTime = 0
			this.snds[name].play()
		}
	},
	snds:{},
	add:function(name){
		this.snds[name]=new Audio(name+".wav")
	}
}
snd.add('hit')
snd.add('bounce')
snd.add('move')
snd.setvol(0.1)

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
loop(12,function(i){
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
c0.addtask({
	interval:1,
	fn:function(){

	}
	
})
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
