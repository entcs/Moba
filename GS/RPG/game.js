//simplify kinetic image
Kinetic.Img=function(args){
	var gr = new Kinetic.Group(args)
    var io = new Image()
	io.src = args.src
	args.image=io
	args.clipFunc=0
	args.draggable=false
    io.onload = function() {
		args.x=-args.width/2
		args.y=-args.height/2
		var i = new Kinetic.Image(args)
		gr.add(i)
		gr.img=i
		i.moveToBottom()
    }
	return gr
}

var d=document,
	i2,
	autoattackspeed=1000,
	objinfo={
		last:'hide',
		show:function(obj){
			objinfo.tar=obj
			if(obj.type=='pl'){
				objinfo.html.find('.objname').innerHTML=obj.name
				objinfo.html.find('.info').innerHTML=[
					'HP: '+obj.hp,
					'DAM: '+obj.dam,
					'RANGE: '+obj.range
				].join('<br>')				
			} else if (obj.type=='item'){
				objinfo.html.find('.objname').innerHTML=obj.name
				var text=[
					obj.quality.name+' '+obj.subtype
				]
				loop(obj.stats,function(name,val){
					text.push(name+' : '+val)
				})
				objinfo.html.find('.info').innerHTML=text.join('<br>')
			}
			objinfo.html.show()
		},
		hide:function(){			
			if(objinfo.last=='show') {
				objinfo.html.hide()
				objinfo.last='hide'
			} else {
				objinfo.html.show()
				objinfo.last='show'			
			}
		}
	},
	skills={
		list:[],
		armed:'not',
		use:function(nr){
			console.log('use skill',nr)
			if(skills.armed!=nr){			
				skills.armed=nr
			} else {
				skills.armed='not'
			}
		}
	}
	loop(6,function(i){
		skills.list.push(0)
	})
var tt=new Date().getTime(),
	tick1000=new Date().getTime(),
	td=0,
	lt=new Date().getTime(),
	ts,
	fpslist=[],
	avgfps=0,
	listlen=100,
	mouse,
	me

var inventory=function(max){	
	var inv={
		items:[],
		max:max || 25,
		havespace:function(){
			return this.items.length<this.max
		},
		additem:function(item){
			var added=false
			if(this.items.length<this.max){
				this.items.push(item)
				added=true
				this.updvis()
			} else {
				console.log('inv full')
			}
			return added
		},
		updvis:function(){
			var slots=d.findall('.inventory .bag div'),
				slot
			loop(this.items,function(i,item){
				slot=slots[i]
				slot.h(item.subtype)
				slot.style.background=item.quality.color
			})
		}
	}
	return inv
}
var dragitem=-1
var equipment=function(){
	var eq={}
	loop(g.items.types,function(i,name){
		eq[name]=0
	})
	eq.ring2=0
	eq.weapon2=0
	return eq
}	
var g={
	objs:{},
	previd:new Date().getTime(),
	click:0,
	previd:new Date().getTime(),
	counter:0,
	genid:function(pre){				
		pre=pre || ''
		var id=pre+new Date().getTime()+g.counter
		g.counter+=1
		g.counter%=Number.MAX_VALUE		
		return id
	},
	//pathing
	path:function(pos,invis){		
		var path={
			pts:[],
			invis:invis||false,
			owner:'',
			dots:[],
			open:true,
			addpt:function(pos,novis){
				this.pts.push(pos)				
				if(!this.invis)this.adddot(pos)
				return pos
			},
			rempt:function(index){
				index=index || 0
				var pt=this.pts.splice(index,1)		
				
				if(!this.invis) this.remdot(index)
				return pt
			},
			adddot:function(pos){
				var dot=new Kinetic.Circle({
					x:pos.x,
					y:pos.y,
					radius:16,
					fill:'rgba(255,255,255,0.3)'
				})
				dot.path=path
				dot.on('mousedown',function(e){
					var path=this.path,
						index=path.dots.indexOf(this)						
					console.log('this:',index)
					path.open=true
					loop(path.dots,function(i,dot){
						if(i>index){
							dot.remove()
						}
					})
					path.pts.splice(index+1,path.pts.length-index+1)					
					path.dots.splice(index+1,path.dots.length-index+1)					
				})
				this.dots.push(dot)
				g.map.bot.add(dot)
				return dot
			},
			remdot:function(index){
				index=index || 0
				var dot=this.dots.splice(index,1)
				dot.remove()
				return dot
			},
			start:function(pos){
				
			},
			end:function(){
				this.open=false
			}
		}
		path.addpt(pos)
		return path
	},
	startpathing:function(pl){
		g.endpathing(pl)
		var path=g.path(pl.getPosition())
		
		pl.path=path
		return path
	},
	endpathing:function(pl){
		pl.path.open=false
		if(pl.path){
			console.log('end:',pl.path)
			if(!pl.path.invis){
				loop(pl.path.dots,function(i,dot){
					dot.remove()
				})			
			}
			pl.path.pts=[]
			pl.path.dots=[]
		}
	},
	dopathing:function(path){				
		if(path.open){
			//add to path
			var pos
			if(path.pts.length){
				pos=path.pts.last()
			} else {
				pos=me.getPosition()
			}
			dist=g.dist(g.mouse,pos)			
			if(dist>32){
				path.addpt(g.mouse)
			}
			
		}
	},
	followpath:function(pl){
		
	},
	//objs	
	addobj:function(a){
		var obj=new Kinetic.Group(a)
		obj.type='pl'
		obj.id=g.genid()
		obj.tar=0
		obj.path=0
		obj.tardist=0
		obj.fol=0
		obj.level=a.level || 1
		
		d.extend(obj,{
			autoattack:0,
			lastattack:0,
			attackspeed:1000/4,
			aggro:256,
			speed:100,
			range:196,
			regen:4,
			dam:1,
			friendly:1,
			hp:1000,
			maxhp:1000,
			size:a.size/2
		})
		
		obj.on('mouseover',function(e){
			objinfo.show(obj)
			//objinfo.tar=obj
		})
		obj.on('mouseout',function(e){
			//objinfo.hide()
		})
		obj.on('mousedown',function(e){			
			g.startpathing(this)
		})
		obj.vis=new Kinetic.Circle({
			radius:obj.size,
			x:0,
			y:0,
			fill: 'orange',
			stroke: 'black',
			strokeWidth: 2
		})
		var line = new Kinetic.Line({
			points: [0,obj.size-5,0,obj.size],
			stroke: 'black',
			strokeWidth: 2,
			lineCap: 'round',
			lineJoin: 'round',
			listen:false
	    })
		obj.add(obj.vis)		
		obj.add(line)
		obj.rem=function(){
			delete g.objs[obj.id]
			obj.remove()
			obj.dead=true
		}
		g.objs[obj.id]=obj
		
		return obj	
	},
	addobjs:function(){
		var size=Math.min(window.innerWidth,window.innerHeight)
		var obj,
			spread=128,
			rp=300,
			pos=me.getPosition()
			
		loop(25,function(i){				
			x=pos.x+Math.random()*2*rp-rp
			y=pos.y+Math.random()*2*rp-rp
			//console.log(x,y,pos)
			obj=g.addobj({
				x:x,
				y:y,
				size:32//+i*10
			})
			
			//add to middle layer
			map.mid.add(obj)
		})		
	},
	addme:function(){
		var size=Math.min(window.innerWidth,window.innerHeight),		
			spread=128
			
		if(me) me.rem()		
		me=g.addobj({
			x:size/2,
			y:size/2,
			size:32
		})
		
		//add to middle layer
		map.mid.add(me)	
		
		me.vis.setFill('green')
		me.dam=1000
		me.friendly=0
		me.speed=240
		me.inventory=inventory(25)
		me.equipment=equipment()
		g.move.setPosition(me.getPosition())
		
	},
	remobj:function(id){
		if(id in g.objs){
			var obj=g.objs[id]
			delete g.objs[id]
			obj.remove()
		}
	},
	//stats
	defaults:{
		level1:{
			hitpoints:120,
			hpregen:120,//minute
			attackpower:120,
			spellpower:120,
			armor:120,
			resistance:120,
			speed:120,
			energy:120,//20 sec
			enregen:120
		}
		
	},
	//random
	pickobj:function(obj,count){
		var arr=[],
			val,
			ares=[],
			res={},
			vobj
		loop(obj,function(k,v){
			arr.push(k)
		})
		ares=arr.pick(count)		
		loop(ares,function(i,v){
			res[v]=obj[v]
		})
		return res
	},
	//items
	rng:function(val){
		var nr=Math.floor(Math.random()*val)
		if(nr==val) nr=g.rng(val)
		return nr
	},
	items:{
		drops:{},
		pickdist:64,
		item:function(){
			var item={
				type:'item'
			}
			return item
		},
		genitem:function(level){
			level=level || 1
			var item=g.items.item(),
				nrofstats=2//g.rng(3)+1,
				showstats=[],
				quality=g.items.genquality(),
				statval=Math.ceil(g.items.basevalue*level*quality.value/(nrofstats*10))
			
			item.level=level
			item.quality=quality
			item.subtype=g.items.types.pick()[0]
			item.stats=g.pickobj(g.items.stats,nrofstats)//g.items.stats.pick(nrofstats),
			
			loop(item.stats,function(name,val){				
				item.stats[name]=statval
			})
			item.name=''
			if(nrofstats!=1) item.name=g.items.getname(item)						
			return item			
		},
		drop:function(level,pos){
			var item=g.items.genitem(level)
			item.vis=new Kinetic.Circle({
				x:pos.x,
				y:pos.y,
				radius:8,
				fill:item.quality.color
			})
			item.vis.on('mouseover',function(e){
				objinfo.show(item)				
			})
			item.id=g.genid('item')
			g.map.bot.add(item.vis)
			g.items.drops[item.id]=item
		},
		pickup:function(item,pl){
			var picked=pl.inventory.additem(item)
			if(picked){
				delete g.items.drops[item.id]
				
				//animate
				var pos=pl.getPosition(),
					tween = new Kinetic.Tween({
						node: item.vis, 
						duration: 0.2,
						x: pos.x,
						y: pos.y,
						radius:1,
						easing:Kinetic.Easings.EaseOut,
						onFinish: function() {
							item.vis.remove()
						}									
					})				
				tween.play()					
			}
			return item
		},
		canpick:function(pl){
			var plpos=pl.getPosition(),
				dist,
				pos
				
			loop(g.items.drops,function(i,item){
				pos=item.vis.getPosition()
				dist=g.dist(plpos,pos)
				if(dist<g.items.pickdist){
					g.items.pickup(item,pl)
				}
			})
		},
		genquality:function(){
			 var quality='magic',
				 val=Math.random(),
				 item,
				 ival
				
			loop(g.items.quality.length,function(i){
				item=g.items.quality[g.items.quality.length-i-1]
				ival=1-1/item.drop				
				if(val>ival){
					quality=item
					return false
				}
			})
			return quality
		},
		basevalue:240,
		getname:function(item){
			var match=0,
				len=d.len(item.stats),
				mlen,
				name=''
			loop(g.items.names,function(itemname,itemstats){
				mlen=itemstats.length
				loop(itemstats,function(ind,statname){					
					if(statname in item.stats){
						//console.log('statname:',statname,item.stats)
						match+=1
					}
				})
				//console.log(mlen,match)
				if(mlen==len && mlen==match) {					
					name=itemname
					console.log(name)
					return false
				}
				match=0
			})			
			return name
		},
		names:{
			combat:[
				'attackpower',
				'armor'
			],
			rage:[				
				'attackpower',
				'hpregen'
			],
			fury:[
				'attackpowr',
				'hitpoints'
			],
			rape:[				
				'attackpower',
				'speed'
			],			
			cursing:[
				'spellpower',
				'resistance'
			],			
			sorcery:[
				'spellpower',
				'energy',				
			],
			combatcasting:[
				'spellpower',
				'armor',				
			],
			spellbreaking:[
				'attackpower',
				'resistance',				
			],			
			swiftness:[
				'speed',
				'enregen'
			],
			protection:[
				'armor',
				'resistance'
			],
			destruction:[
				'attackpower',
				'spellpower'
			],
			vitality:[
				'hitpoints',
				'hpregen'
			],
			energy:[
				'energy',
				'enregen'
			],
			recovery:[
				'enregen',
				'hpregen'
			],
			plenty:[
				'hitpoints',
				'energy'
			]
		},
		stats:{
			'hitpoints':0,
			'hpregen':0,
			'attackpower':0,
			'spellpower':0,
			'armor':0,
			'resistance':0,
			'energy':0,
			'enregen':0,
			'speed':0
		},
		types:[
			'helmet',
			'armor',
			'leggings',
			'boots',
			'gloves',
			'shoulders',
			'ring',
			'weapon'			
		],		
		quality:[
			{
				name:'magical',
				value:1,
				drop:1,
				color:'yellowgreen'
			},
			{
				name:'exeptional',
				value:1.1,
				drop:2,
				color:'yellow'
			},
			{
				name:'epic',
				value:1.3,
				drop:3,
				color:'orange'
			},
			{
				name:'legendary',
				value:1.6,
				drop:4,
				color:'red'
			},
			{
				name:'mythical',
				value:2.0,
				drop:5,
				color:'firebrick'
			}
		]
	},
	//html
	renderhtml:function(){
		d.body.s('margin:0px background-color:#000 text-align:center width:100%')			
		d.body.r('div id=container')
			//.s('background-image:url(img/space2.png)')
			.s('background:green')
		
		d.body.r('div class=spellbar')
			.s('display:block position:absolute bottom:0px left:50% background:#aaa')			
			.fn(function(o){
				var nr
					
				loop(6,function(i){					
					nr=i+1
					if(i>3){
						nr='passive'
					}
					o.r('div class=skill')
						.s('display:inline-block margin:5px')
						//.r('div class=keybind html='+nr).p
						.r('div class=but html=skill'+(i+1))
							.fn(function(o){
								o.nr=i
							})
							.on('click',function(e){
								skills.use(this.nr)
							})
							.s('width:48px height:48px background:#fff')
				})
			})
		var sbar=d.find('.spellbar')
		var swid=parseInt(window.getComputedStyle(sbar).width)
		sbar.style.marginLeft=parseInt(-swid/2)+'px'		
		
		objinfo.html=d.body.r('div class=objinfo')
			.s('position:absolute top:0px background:#fff width:256px left:50% margin-left:-128px')
			.r('div class=objname html=objname').p
			.r('div class=info html=objinfo').p
		objinfo.html.hide()	
		var wid=(window.innerWidth-window.innerHeight)/2
		d.body.r('div class=tools')
			.s('position:absolute right:0px top:0px background:#fff height:100% width:'+wid+'px')
			.r('div class=header html=tools')
			.r('div html=start')
				.s('border:2px solid red font-size:30px cursor:pointer')
				.on('click',function(e){
					g.start()
				}).p
			//equipment
			.r('div class=equipment')				
				.fn(function(o){
					var seq=[1,3,3,3],
						eq=equipment(),
						slot
					loop(eq,function(name,val){
						o.r('div class=iblock slot')
							.set('name',name)
							.h(name)
							.s('margin:0 auto width:48px height:48px box-sizing:border-box border:1px solid grey')
							.on('mouseup',function(e){
								if(dragitem!=-1){
									var item=me.inventory.items.slice(dragitem,dragitem+1)[0],
										slotname=e.target.get('name')
										
									if(slotname==item.subtype){
										console.log('equip item:',item)
										me.equipment[slotname]=item
										me.inventory.items.splice(dragitem,1)
										me.inventory.updvis()
									} else {
										console.log('bad slot')
									}
								}
							})
					})
				}).p
			//inventory
			.r('div class=inventory html=inventory')
				.s('border:2px solid red font-size:30px cursor:pointer')
				.r('div class=bag iblocks')					
					.s('width:240px margin:0 auto position:relative background:white')
					.fn(function(o){
						loop(25,function(i){
							o.r('div class=slot')
								.s('font-size:12px vertical-align: top width:48px height:48px border:1px solid grey box-sizing:border-box')
								.on('mouseover',function(e){
									var slots=d.findall('.bag .slot')
										index=Array.prototype.indexOf.call(slots,e.target),
										item=me.inventory.items[index]
									
									if(item){				
										var text
										if(item.name){
											text=[item.quality.name+' '+item.subtype+' of '+item.name]
										} else {
											text=[item.quality.name+' '+item.subtype]
										}
										text.push('level: '+item.level)
										loop(item.stats,function(k,v){
											text.push(k+' : '+v)
										})
										
										var inf=d.find('.iteminfo')
										inf.h(text.join('<br>'))
										inf.style.top=e.target.offsetTop-inf.height.int()+'px'
										inf.style.left=e.target.offsetLeft-inf.width.int()+'px'
									}
								})
								.on('mousedown',function(e){
									e.preventDefault()
									var slots=d.findall('.bag .slot')
										index=Array.prototype.indexOf.call(slots,e.target),
										item=me.inventory.items[index]
									if(item){
										console.log('start drag',item)
										dragitem=index
									}
									
								})
								.on('mouseup',function(e){
									var slots=d.findall('.bag .slot')
										index=Array.prototype.indexOf.call(slots,e.target),
										item=me.inventory.items[index] || 0
									if(item && dragitem!=-1){																			
										var ditem=me.inventory.items.slice(dragitem,dragitem+1)[0],
											pitem=me.inventory.items.slice(index,index+1)[0]
										
										me.inventory.items[dragitem]=pitem
										me.inventory.items[index]=ditem
										me.inventory.updvis()
									}
									
								})								
						})
					})
					.r('div class=iteminfo')
						.s('width: 128px font-size:12px position:absolute left:0px background:white border:2px solid grey')
	},
	rendercss:function(){
		//styles
		var sh1=d.dss.new('sheet2'),
			font='font: bold 14px Open Sans Condensed, sans-serif',
			color='color:#666',
			ucase='text-transform:uppercase',
			pointer='cursor:pointer'
		
		sh1.new('body',
			font,
			color,
			ucase,
			'margin:0px',
			'width:100%',
			'height:100%'
		)
		sh1.new('button',
			font,
			color,
			ucase,
			pointer,
			'border:2px solid #aaa'
		)
		sh1.new('.cols',
			'display:table'
		)
		sh1.new('.cols > *',
			'display:table-cell'
		)
		sh1.new('.iblock',
			'display:inline-block'
		)
		sh1.new('.iblocks > *',
			'display:inline-block'
		)
		
		sh1.show()		
	},
	start:function(){
		g.addobjs()
	},
	//kinetic
	initkinetic:function(){
		var size=Math.min(window.innerWidth,window.innerHeight)
		g.stage = new Kinetic.Stage({
			container: 'container',
			width: size,
			height: size
		}),
		g.layer = new Kinetic.Layer()
		g.stage.add(g.layer)
		d.body.find('canvas').on('click',function(e){
			//if(g.click==0) move.setPosition(mouse)
			g.click=0			
			if(skills.armed!='not'){
				console.log('cast')
				skills.armed='not'
			}
			
		})
	},
	relayout:function(e){
		var size=Math.min(window.innerWidth,window.innerHeight)
		g.stage.setWidth(size)
		g.stage.setHeight(size)
	},
	//markers
	addmarkers:function(){		
		g.aim = new Kinetic.Img({
			x: 200,
			y: 200,
			width: 64,
			height: 64,
			src:'img/ico64.png',
			listening:false,
			//draggable:true,
			//cursor:'pointer',
			crop: {
				x: 0,
				y: 0,
				width: 64,
				height: 64
			}		
		})	
		g.map.top.add(g.aim)
		//aim.hide()
		var msize=32
		g.move = new Kinetic.Img({
			x: size/2,
			y: size/2,
			width: msize,
			height: msize,
			src:'img/ico64.png',
			crop: {
				x: 64,
				y: 0,
				width: 64,
				height: 64
			}		
		})
		g.map.bot.add(g.move) 

		g.aimline = new Kinetic.Line({
			points: [0,0,0,0],
			stroke: 'black',
			strokeWidth: 0.5,
			lineCap: 'round',
			lineJoin: 'round',
			listening:false
		})
		g.map.top.add(g.aimline)
		
	},
	aimcollide:function(){
		mepos=me.getPosition()
		g.aimline.getPoints()[0].x=mepos.x
		g.aimline.getPoints()[0].y=mepos.y
		
		g.aimline.getPoints()[1].x=g.mouse.x
		g.aimline.getPoints()[1].y=g.mouse.y
		
		//do ray
		loop(g.objs,function(id,tar){
			if(tar!=me){
				var an1=g.getan(g.aimline.getPoints()[0],g.aimline.getPoints()[1]),
					an2=g.getan(g.aimline.getPoints()[0],tar.getPosition()),
					an=an1-an2,
					llen=g.dist(g.aimline.getPoints()[0],g.aimline.getPoints()[1])
				
				an%=Math.PI*2
				if(an<-Math.PI) an+=Math.PI*2
				if(an>Math.PI) an-=Math.PI*2
				//console.log(an)
				if(Math.abs(an)<Math.PI/2){
					var dist=g.dist(mepos,tar.getPosition()),
						close=Math.abs(dist*Math.sin(an))
					if(close<tar.size && dist-tar.size<llen){
						tar.vis.setStroke('blue')
						//console.log(g.deg(an),dist,close)
					} else {
						tar.vis.setStroke('black')
					}
				}
			}
		})
	},	
	//map
	initmap:function(){
		map=new Kinetic.Group({
			x:0,
			y:0
			//draggable:true
		})
		g.layer.add(map)
		size=3000
		map.add(new Kinetic.Rect({
			x:0,
			y:0,
			width:size,
			height:size,
			fill:'#8FA558',
			stroke:'black',
			strokeWidth:2
		}))
		//add groups
		var groups=['bot','mid','top']
		loop(groups,function(i,group){
			map[group]=new Kinetic.Group({
				x:0,
				y:0
			})
			map.add(map[group])
		})
		
		map.on('dragstart',function(e){
			map.moving=true
		})
		map.on('dragend',function(e){
			map.moving=false
			console.log('dragend')
		})
		map.on('mousedown',function(e){
			if(skills.armed=='not'){
				map.follow=true
				me.fol=g.mouse
			}
		})
		map.on('mouseup',function(e){
			if(me.path.open){
				me.path.end()
			}
			if(skills.armed=='not'){
				map.follow=false
				
				if(!map.moving){				
					var mpos=mouse,
						mappos=map.getPosition()
						mmpos={
							x:mpos.x-mappos.x,
							y:mpos.y-mappos.y
						}
					g.move.setPosition(mmpos)
					me.fol=g.mouse
					//console.log(mpos,mappos,mmpos)
				}
			}
		})
		map.on('mousemove',function(e){
			if(me.path.open){
				g.dopathing(me.path)
			}
		})
		g.map=map
	},
	getmouse:function(){
		mouse=g.stage.getMousePosition()
		if(mouse){
			var mappos=map.getPosition()
			g.mouse={
				x:mouse.x-mappos.x,
				y:mouse.y-mappos.y
			}
		} else {
			g.mouse=false
		}
	},
	mouse:{x:0,y:0},
	collide:function(){
		var dist,
			pos1,
			pos2,
			vec,
			x,
			y,
			closest,
			moveback,
			ratio,
			sr1,
			sr2
			
		loop(g.objs,function(id1,o1){			
			loop(g.objs,function(id2,o2){
				if(o1!=o2){
					pos1=o1.getPosition()
					pos2=o2.getPosition()
					dist=g.dist(pos1,pos2)
					closest=o1.size+o2.size
					
					if(dist<closest){
						moveback=closest-dist
						ratio=moveback/closest
						//o1.vis.setFill('blue')
						x=ratio*(pos1.x-pos2.x)
						y=ratio*(pos1.y-pos2.y)
						
						sr1=o2.size/(o1.size+o2.size)
						sr2=o1.size/(o1.size+o2.size)						
						
						o1.setPosition({
							x:pos1.x+x*sr1,
							y:pos1.y+y*sr1
						})
						o2.setPosition({
							x:pos2.x-x*sr2,
							y:pos2.y-y*sr2
						})
						/**/
						
					} else {
						
					}
				}
			})
		})		
	},
	//floating text
	floatingtexts:{},
	addfloatingtext:function(pos,text,color){		
		var text=new Kinetic.Text({
				x: pos.x,
				y: pos.y,
				text: text,
				fontSize: 14,
				fontFamily: 'Open Sans Condensed',
				fontStyle:'bold',
				listening:false,
				//strokeWidth:1,
				//stroke:'#fff',
				fill: color || 'red'
			})
		text.id=g.genid('ftext')
		text.type='ftext'
		text.start=tt
		text.rem=function(){
			delete g.floatingtexts[this.id]
			this.remove()
		}
		g.map.top.add(text)
		g.floatingtexts[text.id]=text
	},
	handlefloatingtext:function(){
		loop(g.floatingtexts,function(i,ftext){
			ftext.setY(ftext.getY()-0.5)
			if(tt-ftext.start>500){
				ftext.rem()
			}
		})
	},
	//vector
	getan:function(p1,p2){
		var x=p1.x-p2.x,
			y=p1.y-p2.y,
			an=Math.atan(x/y)
			
		if(y==0) an=-Math.PI/2
		
		if(x<=0 && y>=0){
			an=-an-Math.PI
		} else if (x<=0 && y<=0){
			an=-an
		} else if (x>=0 && y<=0){
			an=-an
		} else {
			an=Math.PI-an
		}
		return an
	},
	dist:function(p1,p2){
		var dx=p1.x-p2.x,
			dy=p1.y-p2.y,
			dist=Math.sqrt(dx*dx+dy*dy)
		return dist
	},
	getvec:function(pos,an,len){
		if (an<0) an+=Math.PI*2
		var	x=len*Math.sin(an),
			y=len*Math.cos(an)

		if(an<=Math.PI/2){//90
			x=x
			y=-y
		} else if (an<=Math.PI){//180
			x=x
			y=-y
		} else if (an<=Math.PI*1.5){//270
			x=x
			y=-y			
		} else {
			x=x
			y=-y			
		}			
		return {x:-x,y:-y}
	},	
	//players
	handleplayers:function(){
		loop(g.objs,function(id,pl){
			g.gettarget(pl)			
			g.moveplayer(pl)
			g.handleautoattack(pl)			
			//g.look(pl,pl.tar.getPosition())			
		})
		g.collide()
		
		//me
		g.items.canpick(me)
		
	},
	handleplayers1000:function(){
		loop(g.objs,function(id,pl){
			g.regenplayer(pl)
		})
	},
	gettarget:function(pl){
		var closest=Number.MAX_VALUE,			
			ctar=0,
			dist,
			pos=pl.getPosition()
			
		loop(g.objs,function(id,tar){
			if(tar!=pl && tar.friendly!=pl.friendly){
				dist=g.dist(pos,tar.getPosition())
				//is in aggro range
				if(dist<=pl.aggro){					
					if(dist<closest){
						closest=dist
						ctar=tar
					}
				}
			}
		})
		pl.tar=ctar
		pl.tardist=closest
		
		if(pl.tar){
			g.look(pl,pl.tar.getPosition())
			if(pl==me){
				pl.tar.vis.setStroke('red')
			}
		}
		
		
		return ctar
	},
	handleautoattack:function(pl){
		if(pl.tar){
			//range check
			if(pl.tardist<=pl.range){
				g.look(pl,pl.tar.getPosition())
				//autoattack cooldown check
				if(tt-pl.lastattack>pl.attackspeed){					
					pl.lastattack=tt
					//attack type to do
					g.addarrow(pl,pl.tar)
				}
			}
		}
	},
	moveplayer:function(pl){
		//var fol=pl.fol || pl.tar
		//for me, follow marker taret
		if(pl.path=='xsasdasd'){
			g.followpath(pl)
		} else if(pl.fol){
			g.follow(pl,pl.fol,pl.speed*td)
		} else if(pl.tar){
			if(pl.tardist>pl.range){		
				g.follow(pl,pl.tar.getPosition(),pl.speed*td)
			}
		}
	},
	regenplayer:function(pl){
		var dif=pl.maxhp-pl.hp
		if(dif!=0){
			dif=Math.min(pl.regen,dif)
			pl.hp+=dif
			var pos=pl.getPosition()
			pos.y-=pl.size			
			g.addfloatingtext(pos,dif,'green')			
		}
	},
	follow:function(obj,pos,speed){				
		var ppos=obj.getPosition()
		if(ppos.x==pos.x && ppos.y==pos.y){
		
		} else {
			g.look(obj,pos)			
			var dist=g.dist(ppos,pos),
				speed=Math.min(speed,dist),
				vec=g.getvec(ppos,obj.getRotation(),speed)
			obj.setPosition(ppos.x+vec.x,ppos.y+vec.y)
		}
	},
	look:function(obj,pos){
		if(pos){
			var an=g.getan(obj.getPosition(),pos)
			obj.setRotation(an)
		}
	},
	//projectiles
	arrows:{},
	addarrow:function(own,tar){
		
		var opos=own.getPosition(),
			tpos=tar.getPosition(),
			vec=g.getvec(opos,own.getRotation(),own.size),
			arrow=new Kinetic.Circle({
				x:opos.x+vec.x,
				y:opos.y+vec.y,
				radius:3,
				fill: 'black',
				listening:false
			}),
			arrowX=new Kinetic.Line({
				points: [opos.x,opos.y-5,opos.x,opos.y+5],
				stroke: 'white',
				strokeWidth: 2,
				lineCap: 'round',
				lineJoin: 'round',
				listening:false
			})
		arrow.own=own		
		arrow.dam=own.dam
		arrow.speed=300
		arrow.id=g.genid('arrow')
		arrow.rem=function(){
			delete g.arrows[arrow.id]
			arrow.remove()
		}
		map.add(arrow)
		//u.turn(arrow,tar)
		arrow.tar=tar
		g.arrows[arrow.id]=arrow
	},
	handlearrows:function(){
		loop(g.arrows,function(id,ar){			
			if(ar.tar.dead) {
				ar.rem()
			} else {
				g.follow(ar,ar.tar.getPosition(),ar.speed*td)
				var apos=ar.getPosition(),
					tpos=ar.tar.getPosition(),
					dist=g.dist(apos,tpos)
				if(dist<ar.tar.size){
					//hit
					ar.tar.hp-=ar.dam	
					var pos=ar.tar.getPosition()
					pos.y-=ar.tar.size
					g.addfloatingtext(pos,ar.dam)
					if(ar.tar.hp<=0 && !ar.tar.dead) {
						ar.tar.rem()
						g.items.drop(ar.tar.level,ar.tar.getPosition())
					}
					ar.rem()
				}
			}
		})
	},
	//aggro
	objsaggro:function (frame){
		var dist,
			mepos=me.getPosition(),
			opos,
			closest=Number.MAX_VALUE
			
		me.tar=0	
		loop(g.objs,function(id,obj){
			if(obj!=me){
				opos=obj.getPosition()
				dist=u.dist(mepos,opos)
				if(dist<obj.aggro){					
					//aggro me					
					if(dist<obj.range){
						obj.tar=me
						u.turn(obj,me)
						obj.fol=0
						//autoattack cooldown=1000
						if(tt-obj.autoattack>autoattackspeed){
							//obj.tar.hp-=obj.dam
							obj.autoattack=tt
							g.addarrow(obj,obj.tar)							
						}
						
					} else {
						obj.fol=me
						obj.tar=0
					}
										
					//get my closest tar					
					if(dist<closest && dist<me.range){
						closest=dist
						me.tar=obj						
					}
				} else {
					obj.tar=0
					obj.fol=0
				}
			}
		})
		if(me.tar){
			me.tar.vis.setStroke('yellow')
			if(tt-me.autoattack>autoattackspeed){
				me.autoattack=tt
				u.turn(me,me.tar)
				g.addarrow(me,me.tar)				
			}		
		}
		
	},
	moveobjs:function (frame){
		loop(g.objs,function(id,obj){
			
			if(obj!=me){
				if(obj.fol){
					u.follow(obj,obj.fol,1.5*ts)					
				}
				if(obj.tar){
					//console.log('attack')
				}
			}			
		})
		u.follow(me,g.move,2*ts)
		var size=Math.min(window.innerWidth,window.innerHeight)
		var mappos=map.getPosition(),
			mepos=me.getPosition(),
			pos={
				x:size/2-mepos.x,
				y:size/2-mepos.y
			}
		
		//smooten map move
		
		map.setPosition({
			x:mappos.x+(pos.x-mappos.x)/8,
			y:mappos.y+(pos.y-mappos.y)/8
		})
		/**/
	},
	handleturn: function (frame){
		tt=new Date().getTime()
		if(map.follow){
			mpos=mouse
			if(mpos){
				var mappos=map.getPosition()
					mmpos={
						x:mpos.x-mappos.x,
						y:mpos.y-mappos.y
					}
				g.move.setPosition(mmpos)
				me.fol=g.mouse
			}
		}	
		
		//g.objsaggro(frame)
		//g.moveobjs(frame)
		//g.collide(frame)
	},	
	addfps:function(){
		g.fps=new Kinetic.Text({
				x: 0,
				y: 10,
				text: 'FPS:',			
				fontSize: 16,			
				fill: 'white'
			})
		g.layer.add(g.fps)	
	},
	//
	reset:function(){
		loop(g.objs,function(id,obj){
			obj.vis.setStroke('black')
		})
	},
	//
	handletime:function(frame){
		tt=new Date().getTime()
		td=(tt-lt)/1000
		lt=tt
		
		if(tt-tick1000>=1000){
			tick1000=tt
			g.tick1000()
		}		
		
		if(frame.frameRate!=Infinity){
			if(fpslist.length<listlen){
			
				fpslist.push(frame.frameRate)
				avgfps+=frame.frameRate				
				
			} else {
				first=fpslist.shift()							
				avgfps-=first
				avgfps+=frame.frameRate
				fpslist.push(frame.frameRate)
				g.fps.setText('FPS:'+avgfps/listlen)
			}
		}		
	},	
	tick1000:function(){
		g.handleplayers1000()
	},
	//
	loop:function(frame){		
		g.handletime(frame)
		g.reset()		
		g.getmouse()
		g.aimcollide()
		g.handleplayers()
		/*
		val=g.expcurve(128)
		if(val>0.5) {
			console.log('expval:',val)
		}
		/**/
		if(objinfo.tar){
			objinfo.show(objinfo.tar)
		}
		if(skills.armed!='not'){
			if(g.mouse){
				g.aim.setPosition(g.mouse)
			}
			//aim.show()
		} else {
			//aim.hide()
		}
		
		g.handlearrows(frame)
		g.handlefloatingtext(frame)
		g.handleturn(frame)
	},	
	run:function(){
		g.anim=new Kinetic.Animation(function(frame) {	
			g.loop(frame)
		}, g.layer)
		g.anim.start()	
	},
	//
	addglobalevents:function(){
		d.body.on('keypress',function(e){
			var key=e.keyCode
			switch (key){
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
					skills.use(key-49)
					break
			}
		})

		window.onresize=g.relayout
	}
}
g.rendercss()
d.extend(g,{
	templateitem:{
		type:'',
		hitpoints:120,
		hpregen:120,
		attackpower:120,
		spellpower:120,
		armor:120,
		resistance:120,
		speed:120,
		attackspeed:120,
		energy:120,
		enregen:120
	},
	itemstats:[
		'hitpoints',
		'hpregen',
		'attackpower',
		'spellpower',
		'armor',
		'resistance',
		'speed',
		'attackspeed',
		'energy',
		'enregen'
	],
	genitem:function(quality,type){
		type=type || 'sword'			
		//quality=quality || g.expcurve(50)		
		quality=quality || Math.random()
		console.log('quality:',quality)
		var qname='magic'
		if(quality>0.999){//1:1000
			quality=2
			qname='legendary'
		} else if(quality>0.99){//1:100
			quality=1.5
			qname='epic'
		} else if(quality>0.9){//1:10
			quality=1.25
			qname='exeptional'
		} else {
			quality=1
			qname='magic'
		}
		var stats=g.itemstats.slice(),
			itemstats=[],
			item={
				type:'lalal',
				quality:1,
				stats:{}
			},
			name,
			nrofstats=3,//nrofstats || g.rng(3)+1
			statval=1/nrofstats,
			val
		
		loop(nrofstats,function(i){
			name=stats.splice(g.rng(stats.length),1)[0]			
			val=g.templateitem[name]*statval
			item.stats[name]=Math.floor(Math.round(val*quality))
		})		
		item.quality=qname+' '+quality
		return item
	},
	rng:function(range){		
		range=range || 2
		var val=range		
		while(val==range){
			val=Math.floor(Math.random()*range)
		}		
		return val
	},
	expcurve:function(pow){
		var val=Math.pow(Math.random(),pow)				
		if(isNaN(val)){
			console.log(val)
		}
		return val
	}
})
var me,aim,move,moveto,vis,mapmouse={x:0,y:0}

d.on('ready',function(){	
	g.renderhtml()
	g.initkinetic()
	g.initmap()	
	g.addmarkers()	
	g.addme()
	g.addobjs()
	g.addglobalevents()
	g.addfps()
	g.run()	
})

