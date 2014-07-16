var d=document,
	i2
var g={
	ships:[],
	think:0,
	thinktime:5000,
	thinkstart:0,
	thinkcooldown:0,
	click:0,
	addship:function(x,y,type){
		var cx,
			cy,
			size=444/3
		cx=(type%3)*size
		cy=Math.floor(type/3)*size
		ship = new Kinetic.Img({
			x: x,
			y: y,
			width: 64,
			height: 64,
			src:'img/ships.png',
			//draggable:true,
			crop: {
					x: cx,
					y: cy,
					width: 148,
					height: 148
				}		
		})		  		
		i2 = new Kinetic.Circle({
			x: 0,
			y: 0,
			radius: 32,        
			stroke: '#8CF9FF',
			dashArray:[22,3],
			strokeWidth: 2
		})	 
		ship.shield=i2
		ship.add(i2)
		ship.on('click',function(e){
			g.click=1
			if(this!=me){
				me.tar=this
				aim.show()
			}
		})
		ship.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		
		});
		ship.on('mouseout', function() {
			document.body.style.cursor = 'default';
			
		});			
		return ship
	},
	addentity:function(a){
		var root=new Kinetic.Group(a),
			gr=new Kinetic.Group(a)
		root.setX(0)
		root.setY(0)
		root.add(gr)
		root.entity=gr
		a.x=0
		a.y=0
		var	circ=new Kinetic.Circle(a)
		gr.add(circ)
		gr.circ=circ
		return root				
	}
};

(function(){//dss
	//styles
	var sh1=dss.new('sheet2'),
		font='font: bold 14px Open Sans Condensed, sans-serif',
		color='color:#666',
		ucase='text-transform:uppercase',
		pointer='cursor:pointer'
	
	sh1.new('body',
		font,
		color,
		ucase,
		'margin:0px'
	)
	sh1.new('button',
		font,
		color,
		ucase,
		pointer,
		'border:2px solid #aaa'
	)
	sh1.show()
})()
	
var me,aim,move,moveto
d.on('ready',function(){	
	var wid=window.innerWidth,
		hig=window.innerHeight,
		stage,
		layer,
		solar,
		planet,
		planet2,
		bullets=[],
		go,
		angularSpeed = Math.PI / 8;
		
	(function renderhtml(){
		d.body.s('margin:0px background-color:#000')			
		d.body.r('div id=container')
			.s('background-image:url(img/space2.png)')
						
		d.body.r('div')
			.s('position:absolute top:0px')
			.r('input id=shipangle type=number value=90').p
			.r('input id=wantangle type=number value=-90')						
						
		d.body.r('div class=controls')
			.s('position:absolute bottom:0px width:100% text-align:center')
			.r('div')
				.h('click on ships to target them and anywhere else to move, click think or press spacebar to think')
				.s('color:#BDFC81 font-size:24px').p
			
			.r('button html=think<br>'+(g.thinktime/1000).toFixed(1))
				.s('font-size:24px background:green color:white')
				.on('click',function(e){
					if(!g.thinkcooldown && !g.thinkstart) g.thinkstart=new Date().getTime()
				})
				.fn(function(o){
					go=o
				})						
	})();
	(function rendercss(){		
	})();
	(function initkinect(){
		stage = new Kinetic.Stage({
			container: 'container',
			width: wid,
			height: hig
		}),
		layer = new Kinetic.Layer()				
		stage.add(layer);	
		d.body.find('canvas').on('click',function(e){
			var mpos=stage.getMousePosition()
			if(g.click==0) move.setPosition(mpos)
			g.click=0
		})			
		
	})();
	(function addsolar(){
		solar=new Kinetic.Group({
			x:wid/2,
			y:hig/2
		})
		size=32
		sun=g.addentity({
			x:0,
			y:0,
			radius:size,
			fillRadialGradientStartPoint: 0,
			fillRadialGradientStartRadius: 0,
			fillRadialGradientEndPoint: 0,
			fillRadialGradientEndRadius: size,
			fillRadialGradientColorStops: [0, 'orange', 0.5, 'yellow', 0.9, 'transparent'],		
		})
		solar.add(sun)
		size=24
		planet=g.addentity({
			x:100,
			y:0,
			radius:size,
			fillRadialGradientStartPoint: 0,
			fillRadialGradientStartRadius: 0,
			fillRadialGradientEndPoint: 0,
			fillRadialGradientEndRadius: size,
			fillRadialGradientColorStops: [0, 'blue', 0.5, 'lightblue', 0.9, 'transparent'],		
		})
		sun.add(planet)
		size=12
		var moon=g.addentity({
			x:32,
			y:0,
			radius:size,
			fillRadialGradientStartPoint: 0,
			fillRadialGradientStartRadius: 0,
			fillRadialGradientEndPoint: 0,
			fillRadialGradientEndRadius: size,
			fillRadialGradientColorStops: [0, 'yellow', 0.5, 'white', 0.9, 'transparent'],		
		})
		planet.entity.add(moon)
		
		size=16
		planet2=g.addentity({
			x:200,
			y:0,
			radius:size,
			fillRadialGradientStartPoint: 0,
			fillRadialGradientStartRadius: 0,
			fillRadialGradientEndPoint: 0,
			fillRadialGradientEndRadius: size,
			fillRadialGradientColorStops: [0, 'green', 0.5, 'lightblue', 0.9, 'transparent'],		
		})	
		sun.add(planet2)
		size=6
		var moon2=g.addentity({
			x:32,
			y:0,
			radius:size,
			fillRadialGradientStartPoint: 0,
			fillRadialGradientStartRadius: 0,
			fillRadialGradientEndPoint: 0,
			fillRadialGradientEndRadius: size,
			fillRadialGradientColorStops: [0, 'red', 0.5, 'white', 0.9, 'transparent'],		
		})
		planet2.entity.add(moon2)	
		layer.add(solar)	
		
	})();
	(function addships(){
		//add ships
		loop(9,function(i){				
			x=256-(i%3)*256
			y=256-Math.floor(i/3)*256
			ship=g.addship(wid/2+x,hig/2+y,i)
			ship.agility=(i/2)+1
			ship.speed=5
			ship.turn=0.1
			layer.add(ship)
			g.ships.push(ship)
		})
		me=g.ships[4]
		me.shield.setStroke('#BDFC81')
	})();	
	(function addmarkers(){
		aim = new Kinetic.Img({
			x: 200,
			y: 200,
			width: 64,
			height: 64,
			src:'img/ico64.png',
			//draggable:true,
			//cursor:'pointer',
			crop: {
				x: 0,
				y: 0,
				width: 64,
				height: 64
			}		
		})	
		layer.add(aim)
		aim.hide()
		
		move = new Kinetic.Img({
			x: 100,
			y: 100,
			width: 64,
			height: 64,
			src:'img/ico64.png',
			crop: {
				x: 64,
				y: 0,
				width: 64,
				height: 64
			}		
		})
		layer.add(move) 

		
	})()
	function addbullet(own,tar){		
		var circ=new Kinetic.Circle({
				x:own.getX(),
				y:own.getY(),
				radius:3,
				fill:'white'
			}),
			pos=own.getPosition(),
			tpos=tar.getPosition(),
			bul={
				birth:new Date().getTime(),
				life:1000,
				own:own,
				tar:tar,
				spd:1,
				bul:circ,
				vec:u.getvec(pos,u.getan(pos,tpos),10)
			}
		layer.add(circ)
		bullets.push(bul)
		return bul
	}
	function handlebullets(){
		var tt=new Date().getTime()
		loop(bullets,function(i,bul){
			if(bul.birth+bul.life<tt){
				bul.bul.remove()
				bullets.splice(i,1)
			} else {
				var pos=bul.bul.getPosition()
				pos.x+=bul.vec.x
				pos.y+=bul.vec.y
				bul.bul.setPosition(pos)
			}
		})
	}
	
	var shipangle=d.body.find('#shipangle'),
		wantangle=d.body.find('#wantangle')
	
	function handleships(frame){
		/*
		var an=me.getRotation()		
		
		turnan=u.turnan(an,u.rad(wantangle.value),u.rad(1))		
		//console.log(u.deg(an),u.deg(turnan))
		me.setRotation(an+turnan)
		
		shipangle.value=Math.floor(u.deg(an))
		/**/
		
		
		u.follow(me,move,2,0.02)		
		u.follow(g.ships[0],me,1,0.02)		
	}	
	function rotateplanets(frame){
		var angleDiff = frame.timeDiff * angularSpeed / 1000;
		planet.rotate(angleDiff)
		planet.entity.rotate(angleDiff)
		planet2.rotate(angleDiff/2)
		planet2.entity.rotate(angleDiff)		
	}	

	var sec1=0,
		turn=0,
		turntime=1000,
		tt

	function handleturn(frame){
		tt=new Date().getTime()		
				
		if(g.thinkstart){
			dif=tt-g.thinkstart
			go.h('think<br>'+((g.thinktime-dif)/1000).toFixed(1))
				.s('background:green color:white')			
			if(dif>g.thinktime) {
				g.thinkstart=0
				g.thinkcooldown=tt
			}
			
		} else {
			if(frame.time-sec1>200){
				sec1=frame.time
				addbullet(me,aim)
			}		
			handleships(frame)
			
			if(g.thinkcooldown){				
				dif=tt-g.thinkcooldown
				if(dif>g.thinktime) {
					g.thinkcooldown=0
					go.h('think<br>'+(dif/1000).toFixed(1))
						.s('background:green')					
				} else {				
					go.h('cooldown<br>'+(dif/1000).toFixed(1))
						.s('background:red')
				}
			}
		}		
		if(me.tar) {
			aim.setPosition(me.tar.getPosition())
			aim.rotate(0.05)
		}		
	}
			
		
	new Kinetic.Animation(function(frame) {	
		var time = frame.time,
			timeDiff = frame.timeDiff,
			frameRate = frame.frameRate,
			tt=new Date().getTime()
						
		handleturn(frame)
		handlebullets(frame)
		rotateplanets(frame)		

	}, layer).start()
	d.body.on('keypress',function(e){
		var key=e.keyCode
		if(key==32) go.trigger('click')		
	})
})