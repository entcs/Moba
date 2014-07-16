var istouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
	down='mousedown',
	up='mouseup',
	press='click',
	move='mousemove'	
if(istouch){		
	down='touchstart'
	up='touchend'
	press='touchstart'
	move='touchmove'		
}
var socket
d.on('ready',function(e){	
	socket=io()
	socket.on('connect', function(){
		console.log('con')
		socket.emit('tacmap', {
			type:'new'
		})
		socket.on('tacmap', function(data){
			var handle={
				joinque:function(data){
					d.find('.lobby .mid').hide()
					d.find('.lobby .bot').hide()
					d.find('.tobattle').hide()
					d.find('.leaveque').show()				
				},
				leaveque:function(data){
					d.find('.lobby .mid').show()
					d.find('.lobby .bot').show()
					d.find('.tobattle').show()
					d.find('.leaveque').hide()
				},
				joingame:function(data){
					console.log('joingame')
					var pls=[data.p1,data.p2]
					d.find('.lobby').hide()
					tac.startgame(pls)
					
				},
				leavegame:function(data){
					console.log('leavegame')
				},
				unitstats:function(data){
					unitstats=data.unitstats
					lobby.init()
					
				},
				action:function(data){
					tac.setaction(data)
				}
			}				
			if(handle[data.type]){
				handle[data.type](data)				
			}
		})
		socket.on('disconnect', function(){
			console.log('disco')
		})		
	})
})
var css=d.dss.new('lobbystyles')
function addstyles(){
	css.new('body',
		'margin:0px',
		'background-color:#000'
	)
	css.new('body,input,td,th',
		'font-family:Open Sans Condensed, sans-serif',
		'font-weight: bold',
		'font-size:14px',
		'color:#222',	
		'text-align:center',
		'text-transform: uppercase'	
	)
	css.new('.but',
		'border:3px solid #aaa',
		'border-radius:64px',
		'background-color:#fff',
		'margin:2px',
		'cursor:pointer',
		'transition:all 0.5s'
	)

	css.new('.but:hover',
		//'border:2px solid orange',
		'background-color:#222',
		'color:#eee'
	)
	css.new('*.selected',
		'border:3px solid yellowgreen'
	)

	css.new('.cols',
		'display:table'
	)
	css.new('.cols>*',
		'display:table-cell'
	)
	css.new('.rows',
		'display:table'
	)
	css.new('.rows>*',
		'display:table-row'
	)
	css.new('.iblocks>*',
		'display:inline-block'
	)
	css.show()
}
addstyles()

c0.run('resize')
var unitstats={}
function setunitstats(){	
	var types={
			swo:{
				hp:1,
				dam:1,
				speed:1,
				range:1,
				spot:1,
				vmounted:1,			
				vfoot:1,
				name:'swordsmen'
			},
			spe:{
				hp:0.9,
				dam:0.7,
				speed:0.9,
				range:1,
				spot:1,
				vmounted:2,
				vfoot:1,
				name:'pikemen'
			},
			bow:{
				hp:0.5,
				dam:0.5,
				speed:0.8,
				range:7,
				spot:1.2,
				vmounted:1,
				vfoot:1,
				name:'archers'
			}
		},
		mods={
			'':{
				hp:1,
				dam:1,
				speed:1,
				range:1,
				spot:1,
				vmounted:1,
				vfoot:1,
				name:''
			},
			h:{
				hp:1.25,
				dam:1.2,
				speed:0.9,
				range:1.1,
				spot:0.9,
				vmounted:1,
				vfoot:1,
				name:'heavy'
			},
			m:{
				hp:1.6,
				dam:1.2,
				speed:1.6,
				range:0.75,
				spot:1.2,
				vmounted:1,
				vfoot:1.6,
				name:'mounted'
			}
		},
		name,
		hp=1,
		dam=1,
		speed=1,
		range=1,
		spot=1
	mods.hm={
		hp:mods.h.hp*mods.m.hp,
		dam:mods.h.dam*mods.m.dam,
		speed:mods.h.speed*mods.m.speed,
		range:mods.h.range*mods.m.range,
		spot:mods.h.spot*mods.m.spot,
		vmounted:mods.h.vmounted*mods.m.vmounted,
		vfoot:mods.h.vfoot*mods.m.vfoot,
		name:'heavy mounted'
	}
	loop(types,function(i1,n1){
		loop(mods,function(i2,n2){					
			name=i1+i2
			unitstats[name]={
				//basestats
				hp:(100*types[i1].hp*mods[i2].hp).round(),
				dam:(10*types[i1].dam*mods[i2].dam).round(),
				speed:(100*types[i1].speed*mods[i2].speed).round(),
				range:(1*types[i1].range*mods[i2].range).round(),
				spot:(100*types[i1].spot*mods[i2].spot).round(),
				name:n2.name+' '+n1.name
			}
		})
	})	
}
setunitstats()

var gfx={
	init:function(){
		this.c=d.body.r('canvas id=gfxcanvas')
			.s('display:none')
		this.c2=gfx.c.getContext('2d')
		var names=['tactics.png'],
			img
		this.raws={}
		this.imgs={}
		loop(names,function(i,n){
			img={
				ready:false,
				imgo:new Image()
			}
			img.imgo.src=n
			img.imgo.onload=function(){				
				img.ready=true
				d.trigger('imageloaded',[n,img])
			}
			gfx.raws[n]=img
		})
		d.on('imageloaded',function(e){			
			gfx.gen()
			d.trigger('gfxready')
		})
	},	
	clear:function(){		
		gfx.c2.clearRect(0, 0, gfx.c.width, gfx.c.height)
	},
	imgs:{},
	setsize:function(wid,hig){
		this.c.width=wid
		this.c.height=hig
	},
	draw:function(a){		
		this.c2.drawImage(a.img.imgo,a.x,a.y,64,64,0,0,64,64)
		var img=new Image()
		img.src=gfx.c.toDataURL("image/png")			
		return img		
	},
	gen:function(){
		var units={
				bswo:[[320,64],[0,64]],
				bswoh:[[320,64],[0,64],[196,64]],
				bswom:[[320,64],[0,64],[256,64]],
				bswohm:[[320,64],[0,64],[196,64],[256,64]],
				
				bspe:[[320,64],[64,64]],
				bspeh:[[320,64],[64,64],[196,64]],
				bspem:[[320,64],[64,64],[256,64]],
				bspehm:[[320,64],[64,64],[196,64],[256,64]],
				
				bbow:[[320,64],[128,64]],
				bbowh:[[320,64],[128,64],[196,64]],
				bbowm:[[320,64],[128,64],[256,64]],
				bbowhm:[[320,64],[128,64],[196,64],[256,64]],

				wswo:  [[320,0],[0,0]],
				wswoh: [[320,0],[0,0],[196,0]],
				wswom: [[320,0],[0,0],[256,0]],
				wswohm:[[320,0],[0,0],[196,0],[256,0]],
				             
				wspe: [[320,0],[64,0]],
				wspeh: [[320,0],[64,0],[196,0]],
				wspem: [[320,0],[64,0],[256,0]],
				wspehm:[[320,0],[64,0],[196,0],[256,0]],
				             
				wbow: [[320,0],[128,0]],
				wbowh: [[320,0],[128,0],[196,0]],
				wbowm: [[320,0],[128,0],[256,0]],
				wbowhm:[[320,0],[128,0],[196,0],[256,0]]
				
			}
		
		loop(units,function(name,vals){
			loop(vals,function(i2,val){
				gfx.imgs[name]=gfx.draw({
					x:val[0],
					y:val[1],
					img:gfx.raws['tactics.png']
				})
			})
			gfx.clear()
		})
		gfx.imgs.bblank=gfx.draw({
			x:384,
			y:0,
			img:gfx.raws['tactics.png']
		})
		gfx.clear()
		gfx.imgs.bblank=gfx.draw({
			x:384,
			y:64,
			img:gfx.raws['tactics.png']
		})
		gfx.clear()
					
		/*
		gfx.draw({
			x:32,
			y:32,
			wid:wid,
			hig:hig,
			offx:0,
			offy:64,
			img:gfx.raws['tactics.png']
		})
		gfx.draw({
			x:32,
			y:32,
			wid:wid,
			hig:hig,
			offx:196,
			offy:64,
			img:gfx.raws['tactics.png']
		})
		gfx.draw({
			x:32,
			y:32,
			wid:wid,
			hig:hig,
			offx:256,
			offy:64,
			img:gfx.raws['tactics.png']
		})
		var imgd=gfx.c2.getImageData(0,0,wid,hig)
		gfx.imgs['heavycavalry']=imgd
		console.log(imgd)
		/**/
	}
}
gfx.init()
gfx.setsize(64,64)

var lobby={
	unittype:'',
	armored:false,
	mounted:false,
	selectedunit:0,
	totalhp:0,	
	maxunits:8,
	maxhp:800,
	units:[],
	init:function(){
		if(lobby.units.length<lobby.maxunits.length){
			loop(lobby.maxunits,function(i){
				lobby.units.push(0)
			})
		}
		lobby.unitselect.show()
	},
	show:function(){		
		var lo=d.body.r('div class=lobby rows')
			.s('position:absolute top:0px left:0px width:100% height:100%')
			.s('background-color:rgba(0,0,0,0.5)')
		
		//top
		var top=lo.r('div class=top')
			.s('height: 100%')
		
		var tobattle=top.r('div class=but tobattle')
			.h('to battle')
			.s('display:inline-block font-size:32px padding:0px 16px')
			.on(press,function(e){
				console.log('to battle:',lobby.units)
				var data={
					units:lobby.units,
					name:d.find('#name').val()
				}
				var name=d.find('#name')
				if(name.val()){
					socket.emit('tacmap', {
						type:'joinque',
						name:name.val(),
						army:lobby.units
					})
					d.cookie='name='+name.val()
					d.cookie='army='+JSON.stringify(lobby.units)
				} else {
					name.focus()
				}
			})			
		var leaveque=top.r('div class=but leaveque')
			.h('leave que')
			.s('display:inline-block font-size:32px padding:0px 16px')
			.on(press,function(e){
				socket.emit('tacmap',{
					type:'leaveque',
					name:d.getcookies('name')
				})
			})
		leaveque.hide()
		
		//mid		
		var mid=lo.r('div class=mid')
		var name=mid.r('div')
		name.r('div html=name')
		var inp=name.r('input id=name')		
		inp.val(d.getcookies('name'))
		var unitselect=mid.r('div class=unitselect')		
				
		//bot
		var bot=lo.r('div class=bot')
			.s('height:1px')
		bot.r('div class=hpppool but')
			//.h('total hp: '+lobby.totalhp+'/'+lobby.maxhp)
			.s('display:inline-block font-size:24px padding:0px 12px')
		var units=bot.r('div class=units'),
			unit,
			uwrap
		loop(lobby.maxunits,function(i){
			uwrap=units.r('div class=unit')
				.s('display:inline-block position:relative')
			unit=uwrap.r('img class=but')
				//.s('width:100% height:100% display:inline-block')
				.s('width:64px height:64px')
			unit.src=gfx.imgs.bblank.src
			unit.index=i
			unit.on(press,function(e){
				ele=d.find('.units .selected')
				if(ele){
					ele.remclass('selected')
				}
				e.target.addclass('selected')
				lobby.selectedunit=e.target
				var unit=lobby.selectedunit
				unit.src=gfx.imgs.bblank.src
				unit.p.find('div').h('')
				lobby.units[unit.index]=0
				lobby.unitselect.calctotalhp()
				lobby.unitselect.show()
			})
			uwrap.r('div')
				.s('position:absolute top:0px left:0px font-size:24px color:#fff width:100% pointer-events:none')			
			
		})
		units.find('img').trigger(press)
		lobby.unitselect.show()
		lobby.unitselect.calctotalhp()
		lobby.unitselect.setarmy()
	},
	unitselect:{
		units:[],
		unittype:'',
		armored:false,
		mounted:false,
		setarmy:function(){
			var army=d.getcookies('army'),
				units=d.findall('.units .unit'),
				unit,
				selectunits=d.findall('.unitselect tbody img')
			loop(army,function(i,name){
				if(i<lobby.maxunits){
					lobby.units[i]=name
					if(name){
						lobby.unitselect.setunit(i,name)
					}
				}
			})			
		},
		setunit:function(ind,name){
			if(name){
				var unit=d.findall('.units .unit')[ind]
				unit.find('img').src=gfx.imgs['b'+name].src				
				unit.find('div').h(unitstats[name].hp)
				lobby.units[ind]=name
			} else {
				var unit=d.findall('.units .unit')[ind]
				unit.find('img').src=gfx.imgs.bblank.src
				unit.find('div').h('')
				lobby.units[ind]=0				
			}
			lobby.unitselect.calctotalhp()			
		},
		show:function(){
			var ele=lobby.unitselect.hide(),
				unitselect=d.find('.unitselect'),
				table=unitselect.r('table'),
				tbody=table.r('tbody'),
				tr,
				td,
				ele,
				types=['swo','spe','bow'],
				mods=['','h','m','hm']
			
			unitselect.s('position:relative display: inline-block')
			table.s('padding:5px background-color:#eee margin:0 auto border-radius:38px')
			tbody.s('width:100% height:100%')
			var i=0
			loop(unitstats,function(k,v){				
				if(i%4==0){
					tr=tbody.r('tr')
				}
				td=tr.r('td')
					.s('position:relative')
				ele=td.r('img')
				ele.s('cursor:pointer')				
				ele.src=gfx.imgs['b'+k].src
				ele.unitname=k
				td.r('div')
					.h(v.hp)
					.s('position:absolute top:0px left:0px font-size:24px color:#fff width:100% pointer-events:none')
				if(lobby.maxhp-lobby.totalhp<v.hp){
					ele.addclass('expensive')
					ele.s('border:2px solid orange border-radius:64px')					
				} else {
					ele.s('border:2px solid yellowgreen border-radius:64px')
					ele.on(press,function(e){
						var unit=lobby.selectedunit,
							ind=unit.index,
							name=e.target.unitname
						lobby.unitselect.setunit(ind,name)
						showstats(e.target.unitname)
						/*
						unit.src=e.target.src
						unit.p.find('div').h(v.hp)

						lobby.units[unit.index]=e.target.unitname
						console.log('units:',lobby.units)
						//d.find('.unitselect tfoot').show()
						showstats(e.target.unitname)
						lobby.unitselect.calctotalhp()
						/**/
					})
				
				}				
				i+=1
			})
			function showstats(name){
				var stats=unitstats[name],
					ele=d.find('.unitselect .unitstats')
				
				if(ele){
					ele.rem()
				}
				var ust=unitselect.r('div class=unitstats')
					.s('position:absolute left:0px top:0px width:100% height:100%')
					.s('background-color:rgba(255,255,255,1) border-radius:38px')
					.s('cursor:pointer font-size:20px')
				ele=ust.r('div').h(stats.name)
				ele=ust.r('div').h('hp:'+stats.hp)
				ele=ust.r('div').h('dam:'+stats.dam)
				ele=ust.r('div').h('speed:'+stats.speed)
				ele=ust.r('div').h('range:'+stats.range)
				ele=ust.r('div').h('spot:'+stats.spot)
				ele=ust.r('div').h('description:')
				//no
				ele=ust.r('div class=but')
					.s('background:url(ico64.png) -448px -192px width:64px height:64px')
					.s('position:absolute top:78px right:0px')
					.on('click',function(e){
						var unit=lobby.selectedunit
						//unit.src=e.target.src
						unit.src=gfx.imgs.bblank.src
						lobby.units[unit.index]=0//e.target.unitname
					
						
					})
				//yes
				ele=ust.r('div class=but')
					.s('background:url(ico64.png) -512px -128px width:64px height:64px')
					.s('position:absolute top:78px left:0px')
					.on('click',function(e){
						//d.find('.unitselect').rem()
						//ust.rem()
					})
				ust.on(press,function(e){				
					ust.rem()
				})
			}			
		},
		hide:function(){
			var ele=d.find('.lobby .mid .unitselect')
			ele.h('')
			return ele
		},
		calctotalhp:function(){
			var total=0
			loop(lobby.units,function(i,n){				
				if(n){
					total+=unitstats[n].hp
				}
			})			
			lobby.totalhp=total
			//d.find('.hpppool').h('total hp: '+lobby.totalhp+'/'+lobby.maxhp)
			d.find('.hpppool').h('army points: '+(lobby.maxhp-lobby.totalhp))
			
		}
	}
}


var tac={
	team:0,
	initmap:function(){
		var map=c0.rect({
			//src:'tactics.png',
			x:window.innerWidth/2,
			y:window.innerHeight/2,
			wid:4000,
			hig:4000,
			color:'yellowgreen',
			start:{},
			goscale:1,
			fol:0,
			vec:{x:0,y:0},
			focus:{x:0,y:0},
			mouse:{x:0,y:0},
			moved:false,
		}).to()
		
		//node layers
		map.paths=c0.node({}).to(map)
		map.terra=c0.node({}).to(map)
		map.units=c0.node({}).to(map)		
		map.gfx=c0.node({}).to(map)
		
		//bushes
		var bushes=[],
			bush,
			x,y
		loop(256,function(i){
			x=Math.random()*map.wid-map.wid/2
			y=Math.random()*map.hig-map.hig/2
			bush=c0.img({
				x:x,
				y:y,
				src:'tactics.png',
				wid:64,
				hig:64,
				offx:196,
				offy:128,
				opa:0.5
			}).to(map.terra)
		})		
		map.on(down,function(e){
			if(tac.actunit){
				console.log('actunit',down)
			} else {			
				console.log('map',down)
				map.down=true
				map.start.x=c0.m.x-map.x
				map.start.y=c0.m.y-map.y			
				map.vec.x=0
				map.vec.y=0							
			}
		})
		map.on(up,function(e){
			//onclick zoom
			if(map.moved){				
				//do nothing
				console.log('mapmoved',up)
			} else if(tac.actunit){
				tac.sendaction()
				tac.actunit=0
				tac.path=[]
				tac.fol=0
			} else {
				//do zoom
				if(map.goscale==1){
					tac.setscale()
				} else if(map.goscale!=1){
					tac.setscale(1)
				}				
			}
			map.down=false
			map.moved=false
			/*
				if(map.goscale==1 && map.down){
					tac.setscale()
				} else if(map.goscale!=1){
					tac.setscale(1)
				}
				
				if(map.down){
					var pos=map.mpos()	
					//i1.pos(pos)			
					if(map.scale==1){// && map.goscale==map.scale){
						map.fol=0				
						map.vec.x=c0.mvec.x
						map.vec.y=c0.mvec.y													
					}
					map.down=false
				}				
			}
					
			tac.actunit=0			
			map.moved=false
			map.down=false
			/**/
		})			
		map.on(move,function(e){
			if(map.goscale==1){
				if(tac.actunit){
					var unit=tac.actunit,
						mpos=map.mpos(),
						pos=tac.actunit.pos()
					if(tac.path.length){
						pos=tac.path[tac.path.length-1]
					}
					var dist=c0.dist(mpos,pos)
					if(dist>50){
						var dot=c0.circ({
							x:mpos.x,
							y:mpos.y,
							rad:16,
							color:'rgba(255,255,255,0.3)'
						}).to(map.terra)
						tac.path.push(dot)
						tac.fol=0
					}
					//console.log('dist:',dist,map.mpos(),tac.actunit.pos())
				} else if(map.down){
					var x=c0.m.x-map.x,
						y=c0.m.y-map.y
					
					var dif=c0.sub({x:x,y:y},map.start)
					if(dif.x!=0 || dif.y!=0){
						map.fol=c0.sub(c0.m,map.start)				
						map.moved=true
					}
				}
			}
		})
		/*
		map.on('mousewheel',function(e){
			var dif=e.wheelDelta
			if(dif>0){
				tac.setscale(1)
			} else if(dif<0){
				tac.setscale()
			}			
		})
		/**/
		
		this.unitstats=c0.node({}).to(map.terra)
		this.unitstats.spot=c0.circ({
			rad:256,			
			color:'rgba(255,255,255,0.1)'
		}).to(this.unitstats)
		this.unitstats.range=c0.circ({
			rad:128,			
			color:'rgba(255,128,0,0.2)'
		}).to(this.unitstats)				
		tac.map=map
	},
	setscale:function(set){
		var map=tac.map
		if(set==1){
			map.goscale=1
			var mpos=map.mpos(),
				pos=map.getpos(),
				scale=map.getscale(),
				spos={
					x:mpos.x*scale,
					y:mpos.y*scale
				},
				dif=c0.sub(spos,mpos)
			
			map.fol={
				x:pos.x+dif.x,
				y:pos.y+dif.y
			}
			var mix=map.wid/2,
				miy=map.hig/2,
				max=window.innerWidth-map.wid/2,
				may=window.innerHeight-map.hig/2		
			if(map.fol.x>mix){
				map.fol.x=mix
			} else if(map.fol.x<max){
				map.fol.x=max
			}
			if(map.fol.y>miy){
				map.fol.y=miy
			} else if(map.fol.y<may){
				map.fol.y=may
			}
		} else {
			var sx=window.innerWidth/map.wid,
				sy=window.innerHeight/map.hig,
				sc=Math.min(sx,sy)
			map.goscale=sc
			map.fol={
				x:window.innerWidth/2,					
				y:window.innerHeight/2				
			}
		}								
	},
	handle:function(dt){
		this.handlemap(dt)
		this.handleunits(dt)	
		this.handlehps()
	},
	handlemap:function (){
		var smooth=4,
			map=tac.map,
			scale=map.getscale()
			mix=scale*map.wid/2,
			max=window.innerWidth-scale*map.wid/2,
			miy=scale*map.hig/2,
			may=window.innerHeight-scale*map.hig/2,
			skipx=false,
			skipy=false,
			wid=map.wid*scale,
			hig=map.hig*scale,
			sx=window.innerWidth/wid,
			sy=window.innerHeight/hig
		
		if(tac.map.scale!=tac.map.goscale){
			var sc=(tac.map.goscale-tac.map.scale)/smooth
			tac.map.scale+=sc
		}	
		if(map.goscale!=1){
			map.fol={
				x:window.innerWidth/2,					
				y:window.innerHeight/2				
			}		
		}
		if(map.fol){			
			//console.log('fol')
			var dif=c0.sub(map.fol,map.pos())
			if(Math.abs(dif.x)<0.01){
				tac.map.x=tac.map.fol.x
			} else {
				tac.map.x+=dif.x/smooth
			}
			if(Math.abs(dif.y)<0.01){
				tac.map.y=tac.map.fol.y
			} else {
				tac.map.y+=dif.y/smooth
			}
			if(map.fol.x==map.x && map.fol.y==map.y){
				map.fol=0
			}
		} else {
			//console.log('vec')
			if(map.vec.x){
				map.x+=map.vec.x
				map.vec.x*=0.9
				if(Math.abs(map.vec.x)<0.01){
					map.vec.x=0
				}
			}
			if(map.vec.y){
				map.y+=map.vec.y
				map.vec.y*=0.9
				if(Math.abs(map.vec.y)<0.01){
					map.vec.y=0
				}
				
			}
		}
		//limit min max
		if(map.scale==1){ 			
			var pos=map.getpos(),
				wid=map.wid,
				mix=wid/2-pos.x,
				miy=hig/2-pos.y,
				max=window.innerWidth-wid/2-pos.x,
				may=window.innerHeight-hig/2-pos.y
			
			if(mix<0){								
				map.x=map.wid/2
				map.fol.x=map.x
			} else if(max>0){
				map.x=window.innerWidth-wid/2
				map.fol.x=map.x				
			}			
			if(miy<0){
				map.y=map.hig/2
				map.fol.y=map.y
			} else if(may>0){
				map.y=window.innerHeight-hig/2
				map.fol.y=map.y
			}
		}
		if(Math.abs(map.scale-map.goscale)<0.0001){
			map.scale=map.goscale
		}		
	},
	getlastfol:function(unit){
		var fol
		if(unit.fol){
			fol=tac.getlastfol(unit.fol)
		} else {
			fol=unit
		}
		return fol
	},
	handleunits:function(dt){
		var dot,
			dif,
			dist,
			range=64,
			ct=new Date().getTime(),
			act=tac.actunit
			
		loop(tac.units,function(i,unit){
			if(unit!=tac.actunit){
				if(unit.fol){				
					dif=c0.sub(unit.fol.pos(),unit.pos())
					dist=c0.dist(dif)				
					if(unit.team!=unit.fol.team){
						range=unit.range
					} else {
						range=64
					}
					if(dist<range){
						
					} else {
						dif=c0.norm(dif)					
						unit.x+=unit.speed*dif.x*dt/1000
						unit.y+=unit.speed*dif.y*dt/1000
					}				
				} else if(unit.path.length){
					dot=unit.path[0]				
					dif=c0.sub(dot,unit.pos())
					dist=c0.dist(dif)				
					if(dist<1){
						unit.path.splice(0,1)
						dot.rem()
					}
					if(unit.path.length){
						dot=unit.path[0]
						dif=c0.sub(dot,unit.pos())				
						dif=c0.norm(dif)
						unit.x+=unit.speed*dif.x*dt/1000
						unit.y+=unit.speed*dif.y*dt/1000
					}
				}
			}
			//attack
			if(ct-unit.lastatt>unit.cooldown){
				unit.lastatt=ct				
				tar=tac.getclosestenemy(unit)
				if(tar){
					tac.attack(unit,tar)
				}
			}
			var rad=32*unit.hp/unit.maxhp
			if(rad<0){
				rad=0
			}
			unit.hpbar.rad=rad
		})
		
		//rem dead units
		loop(tac.units,function(i,unit){
			if(unit.hp<=0){
				tac.remunit(unit)
			}
		})
		
		if(tac.actunit){
			tac.unitstats.visible=true
			var mpos=tac.map.mpos()
			tac.unitstats.pos(mpos)//tac.actunit.pos())
			tac.unitstats.range.rad=tac.actunit.range
			tac.unitstats.spot.rad=tac.actunit.spot
		} else {
			tac.unitstats.visible=false
		}
	},
	units:[],	
	pls:[],
	actunit:0,
	hps:[],
	actunit:0,
	path:[],
	fol:0,
	sendaction:function(){
		var path=[]
		loop(tac.path,function(i,dot){
			path.push(dot.pos())
			dot.rem()
		})
		var data={
			type:'action',
			uid:tac.actunit.uid,
			path:path,
			fol:tac.fol
		}		
		socket.emit('tacmap',data)
		tac.actunit=0
		tac.path=[]
		tac.fol=0
	},
	setaction:function(data){
		console.log('set action',data)
		var unit=tac.getunit(data.uid),
			dot
		unit.fol=data.fol
		unit.clearpath()
		loop(data.path,function(i,p){
			console.log('p:',p)
			dot=c0.circ({
				x:p.x,
				y:p.y,
				rad:16,
				color:'rgba(255,255,255,0.3)'
			}).to(tac.map.terra)
			unit.path.push(dot)			
		})		
	},
	getunit:function(uid){
		var unit
		loop(tac.units,function(i,u){
			if(u.uid==uid){
				unit=u
				return false
			}
		})
		return unit
	},
	startgame:function(pls){
		console.log('start game:',pls,d.getcookies('name'))
		var unit,
			pos,
			step=0
		loop(pls,function(i,pl){			
			step=0
			tac.addpl(pl)			
			loop(pl.army,function(i2,name){
				if(name){
					unit=tac.addunit(name,pl)
					
					if(pl.team==1){
						pos={
							x:step,
							y:-tac.map.hig/2+200
						}
					} else {
						pos={
							x:step,
							y:tac.map.hig/2-200
						}						
					}
					unit.pos(pos)
					step+=64
				}
			})
			if(pl.name==d.getcookies('name')){
				tac.team=pl.team					
				console.log(pl.name,pl.team,unit)
				var pos=unit.pos()
				pos.x=pos.x+window.innerWidth/4
				pos.y=-pos.y+window.innerHeight/2				
				tac.map.fol=pos				
			}
			
		})
	},
	handlehps:function(){
		var remlist=[],
			ct=new Date().getTime(),
			dif
		loop(tac.hps,function(i,hp){
			dif=1-((ct-hp.start)/300)
			hp.color='rgba(255,0,0,'+dif/2+')'
			hp.line.color='rgba(255,0,0,'+dif/2+')'
			hp.pos(hp.tar.pos())
			hp.line.p1=hp.unit.pos()
			hp.line.p2=hp.tar.pos()
			if(dif<0){
				remlist.push(hp)
			}
		})
		loop(remlist,function(i,hp){
			hp.line.rem()
			hp.rem()
			
			tac.hps.splice(tac.hps.indexOf(hp),1)
		})
	},
	attack:function(unit,tar){
		var hp=c0.circ({
			x:tar.x,
			y:tar.y,			
			color:'rgba(255,0,0,0.5)',
			rad:35,
			tar:tar,
			unit:unit,
			start:new Date().getTime()			
		}).to(tac.map.gfx)
		hp.line=c0.line({
			x:0,
			y:0,
			p1:unit.pos(),
			p2:tar.pos(),
			linewid:4,
			color:'rgba(255,0,0,0.5)',
		}).to(tac.map.terra)
		tac.hps.push(hp)
		tar.hp-=unit.dam
	},
	getclosestenemy:function(unit){
		var tar=0,
			min=Number.MAX_VALUE,
			dist
		loop(tac.units,function(i,enemy){
			if(unit.team!=enemy.team){
				dist=c0.dist(unit,enemy)
				if(dist<unit.range+32 && dist<min){
					min=dist
					tar=enemy
				}
			}
		})
		return tar
	},
	addunit:function(name,pl){		
		if(pl.team==1){
			iname='b'+name
		} else {
			iname='w'+name
		}
		var img=gfx.imgs[iname]		
		var unit=c0.imgd({
			data:img,
			x:d.rng(300),
			y:d.rng(300),
			wid:64,
			hig:64,
			path:[],
			fol:0,
			team:pl.team,
			name:name
			//opa:0.8
		}).to(tac.map.units)
		
		unit.hpbar=c0.circ({
			rad:32,
			linewid:4,
			//linecolor:'rgba(154, 205, 50,0.7)'
			linecolor:'rgba(255, 125, 0,0.8)'
		}).to(unit)
		var stats=unitstats[name]
		loop(stats,function(k,v){
			unit[k]=v
		})		
		var ext={
			pl:pl,
			maxhp:unit.hp,
			cooldown:1000,
			lastatt:0
		}
		loop(ext,function(k,v){
			unit[k]=v
		})
		
		unit.clearpath=function(){
			loop(unit.path,function(i,dot){
				dot.rem()
			})
			unit.path=[]
		}
		unit.on(down,function(e){
			if(e.node.team==tac.team){
				e.stop=true
				tac.actunit=e.node
				tac.actunit.fol=0
				tac.actunit.clearpath()
				tac.sendaction()
				tac.actunit=e.node				
			}
		})
		unit.on(move,function(e){
			if(tac.actunit && tac.actunit!=e.node){
				//follow
				tac.actunit.clearpath()				
				tac.actunit.fol=e.node
				if(tac.actunit.team==e.node.team){
					tac.actunit=e.node
					tac.actunit.clearpath()
				} else {
					tac.actunit=0
				}
			}
		})
		unit.uid=this.units.length
		this.units.push(unit)
		return unit
	},
	remunit:function(unit){
		tac.units.splice(tac.units.indexOf(unit),1)
		unit.clearpath()
		unit.hpbar.rem()
		unit.rem()
	},
	addpl:function(pl){
		tac.pls[pl.name]=pl
	}
}
tac.initmap()
d.on('gfxready',function(e){
	lobby.show()
})
c0.ondraw=function(dt){
	//console.log(c0.mvec)
	tac.handle(dt)
	
	/*
	if(gfx.imgs.sword){
		c0.c.drawImage(gfx.imgs.sword,0,0,64,64)
	}
	/**/
}
d.body.on('keypress',function(e){
	console.log('click1')
})