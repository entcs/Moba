var bulletspeed = 500,
	plrange = 100,
	plvision = 200,
	plmovementspeed = 100,
	plattackspeed = 1,
	pldamage = 5,
	plhp=100,
	plhpregen=1,

	towerhp = 200,
	towerdamage = 20,
	towerrange = 150,
	towervision = 300,
	towerattackspeed=1,

	minionmovementspeed=50,
	minionhp=25,
	minionrange=50,
	minionvision=100,
	miniondamage=2,
	minionspeed=50,

	bullets={},
	bul,
	damtexts={},
	damtexttime=300

gg.showframerate = true
gg.addcanvas({
	wid: '100%',
	hig: '100%',
	clearcolor:'#000'
})

var game = {
	init: function(){
		this.root=gg.node()
		this.ground=this.root.rect({
			x:window.innerWidth/2,
			y:window.innerHeight/2,
			wid:10000,
			hig:10000,
			color:'#799d31'
		})
		this.addtowers()
		this.addplayers()
		this.addminions()
	},
	objs:{},
	blu:{
		name:'blu',
		color:'#394a8a',
		objs:{}
	},
	red:{
		name:'red',
		color:'#bc4e18',
		objs:{}
	},
	addobj:function(a){
		a.color=a.color|| a.team?a.team.color:'#fff'
		var o=this.root.circ(a)
		o.maxhp=a.hp
		if(!a.hiderange){
			o.g_range=o.circ({
				rad:a.range,
				linewid:1,
				linecolor:'#222',
				alpha:0.5
			})
		}
		// if(!a.hidevision){
		// 	o.g_vision=gg.circ({
		// 		rad:a.vision,
		// 		linewid:0.5,
		// 		linecolor:'#222',
		// 		alpha:0.5
		// 	}).to(o)
		// }
		o.g_hp=o.rect({
			color:'orange',
			x:0,
			y:-o.rad-5,
			wid:30,
			hig:3
		})
		o.g_hpleft=o.rect({
			color:'yellowgreen',
			x:0,
			y:-o.rad-5,
			wid:30,
			hig:3
		})
		o.crit=10
		if(o.team==game.blu){
			o.eteam=game.red
		} else if(o.team==game.red){
			o.eteam=game.blu
		}
		game.objs[o.uid]=o
		o.team.objs[o.uid]=o
		return o
	},
	addminion:function(a){
		var o=game.addobj({
			x:a.x,
			y:a.y,
			rad:5,
			objtype:'minion',
			range:minionrange,
			vision:minionvision,
			attackspeed:plattackspeed,
			movementspeed:minionspeed,
			hp:minionhp,
			damage:miniondamage,
			lastshot:new Date().getTime(),
			team:a.team,
			hiderange:true,
			hidevision:true
		})
	},
	addminions:function(){
		loop(6,function(i){
			game.addminion({
				x:130,
				y:gg.canvas.height/2+50-(i*20),
				team:game.blu
			})
		})

		loop(6,function(i){
			game.addminion({
				x:1790,
				y:gg.canvas.height/2+50-(i*20),
				team:game.red
			})
		})
	},
	addplayer: function(a){
		var pl=game.addobj({
			x:a.x,
			y:a.y,
			rad:10,
			team:a.team,
			respawn:a.respawn,
			range:plrange,
			vision:plvision,
			attackspeed:plattackspeed,
			movementspeed:plmovementspeed,
			hp:plhp,
			damage:pldamage,
			hpregen:plhpregen,
			lastshot:new Date().getTime()
		})

		//add aim
		var aim=gg.line({
			p1:{
				x:0,
				y:0
			},
			p2:{
				x:0,
				y:-pl.range
			},
			color:'black',
			alpha:0.3
		}).to(pl)
		pl.aim=aim
		var areanode=gg.node({
			x:0,
			y:0
		}).to(pl)
		pl.areanode=areanode
		var area=gg.circ({
			x:0,
			y:-pl.range,
			linewid:0.5,
			linecolor:'black',
			alpha:0.5,
			rad:25
		}).to(areanode)
		pl.area=area
		pl.team.pl=pl
		return pl
	},
	addplayers: function(){
		game.addplayer({
			x:gg.canvas.width/2-500,
			y:gg.canvas.height/2,
			team:game.blu,
			respawn:{
				pos:{
					x:50,
					y:gg.canvas.height/2
				},
				cooldown:10
			}
		})

		game.addplayer({
			x:gg.canvas.width/2+500,
			y:gg.canvas.height/2,
			team:game.red,
			respawn:{
				pos:{
					x:1870,
					y:gg.canvas.height/2
				},
				cooldown:10
			}
		})
	},
	remtowers:function(){
		loop(game.objs,function(i,o){
			if(o.objtype=='tower'){
				delete game.objs[o.uid]
				delete o.team.objs[o.uid]
				o.rem()
			}
		})
	},
	addtowers: function(){
		game.remtowers()
		var w=1920/2
		var towerpos1=[
			{x:w-200,y:100},
			{x:w-600,y:100},
			{x:w-200,y:gg.canvas.height-100},
			{x:w-600,y:gg.canvas.height-100},
		]
		var towerpos2=[
			{x:w+200,y:100},
			{x:w+600,y:100},
			{x:w+200,y:gg.canvas.height-100},
			{x:w+600,y:gg.canvas.height-100},
		]

		var towers1=[],
			towers2=[],
			tower
		loop(towerpos1,function(i,p){
			tower = game.addobj({
				x:p.x,
				y:p.y,
				rad:15,
				team:game.blu,
				objtype:'tower',
				range:towerrange,
				vision:towervision,
				attackspeed:towerattackspeed,
				damage:towerdamage,
				hp:towerhp,
				lastshot:new Date().getTime()
			})
		})
		loop(towerpos2,function(i,p){
			tower = game.addobj({
				x:p.x,
				y:p.y,
				rad:15,
				team:game.red,
				objtype:'tower',
				range:towerrange,
				vision:towervision,
				attackspeed:towerattackspeed,
				damage:towerdamage,
				hp:towerhp,
				lastshot:new Date().getTime()
			})
		})

		//add bases
		var base=game.addobj({
			x:100,
			y:gg.canvas.height/2,
			rad:20,
			team:game.blu,
			objtype:'tower',
			range:towerrange,
			attackspeed:towerattackspeed,
			damage:towerdamage,
			hp:towerhp,
			lastshot:new Date().getTime()
		})

		base=game.addobj({
			x:1820,
			y:gg.canvas.height/2,
			rad:20,
			team:game.red,
			objtype:'tower',
			range:towerrange,
			attackspeed:towerattackspeed,
			damage:towerdamage,
			hp:towerhp,
			lastshot:new Date().getTime()
		})
	},
	updatehpbar:function(o){
		var dif=o.hp/o.maxhp
		if(dif<=0){
			dif=0
		}
		o.g_hpleft.wid=o.g_hp.wid*dif
		o.g_hpleft.x=(o.g_hp.wid-o.g_hpleft.wid)/2
	},
	isdead:function(o){
		if(!o.removed && o.hp.round()<=0){
			//console.log('dead')
			//dead
			if(o.respawn){
				o.pos(o.respawn.pos)
				if(o==game.blu.pl){
					fol=o.respawn.pos
				}
			} else if(!o.removed){
				o.rem()
				delete game.objs[o.uid]
				delete o.team.objs[o.uid]
			}
		}

	},
	run:function(){
		game.blu.pl.fol(fol,game.blu.pl.movementspeed)

		//reset targets and closest
		loop(game.objs,function(i,r){
			r.tar=''
			r.closest=10000000
		})

		//find new targets
		loop(game.red.objs,function(i,r){
			loop(game.blu.objs, function(j,b){
				if(!r.remove && !b.removed){
					d=r.dist(b)
					if(d<=r.vision && d<r.closest){
						r.closest=d
						r.tar=b
					}
					if(d<=b.vision && d<b.closest){
						b.closest=d
						b.tar=r
					}
				}
			})
		})

		//check if fol or att
		loop(game.objs,function(i,o){
			//minions target towers if no tar
			if(o.objtype=='minion' && !o.tar){
			   loop(o.eteam.objs,function(i,e){
				   if(e.objtype=='tower'){
					   var d=o.dist(e)
					   if(d<=o.closest){
						   o.closest=d
						   o.tar=e
					   }
				   }
			   })
			}

			if(o.tar){
				if(o.closest<=o.range){
					if(o.area){
						o.area.look(o.tar)
					}
					//shoot
					if(gg.ct>=o.lastshot){
						o.lastshot=gg.ct+1000/o.attackspeed
						bul=gg.circ({
							x:o.x,
							y:o.y,
							rad:2,
							color:o.color,
							damage:o.damage,
							owner:o
						})
						bul.tar=o.tar
						bullets[bul.uid]=bul
					}
				} else if(o.movementspeed){
					if(o!=game.blu.pl){
						o.fol(o.tar.pos(),o.movementspeed)
					}
				}
			}
		})

		//pl
		var pl=game.blu.pl
		pl.aim.look(gg.m)

		if(!pl.tar){
			pl.areanode.look(gg.m)
			pl.area.y=-pl.range
			pl.area.linecolor='black'
		} else {
			pl.areanode.look(pl.tar)
			var dist=gg.dist(pl.pos(),pl.tar.pos())
			pl.area.y=-Math.min(pl.range,dist).round(2)
			if(dist<=pl.range){
				pl.area.linecolor='red'
			} else {
				pl.area.linecolor='black'
			}
		}


		//bullets
		loop(bullets,function(id,b){
			b.fol(b.tar.pos(),bulletspeed)
			dist = b.dist(b.tar.pos())
			if(dist<1){
				//hit
				//crit chance
				var dam=b.damage*spells.iscrit(b.owner)
				spells.dolifesteal(Math.min(dam,b.tar.hp),b.owner)
				size=8+dam/3
				b.tar.hp -= dam
				var dt=gg.text({
					x:b.tar.x,
					y:b.tar.y-10,
					vx:(gg.random(300)-150)/100,
					vy:3,
					death:new Date().getTime()+damtexttime,
					text:dam,
					size:size,
					alpha:0.5
				})
				damtexts[dt.uid]=dt

				game.updatehpbar(b.tar)
				delete bullets[id]
				b.rem()
				game.isdead(b.tar)
			}
		})

		//damtexts
		loop(damtexts,function(k,dt){
			if(dt.death<gg.ct){
				dt.rem()
				delete damtexts[k]
			} else {
				dt.y-=dt.vy
				dt.x+=dt.vx
				dt.vy*=0.9
				dt.vx*=0.9
			}
		})
	}
}
game.init()

var spells={
	node:gg.node(),
	botgap:64,
	init:function(){
		this.draw()
		gg.canvas.on('resize', function(e){
			spells.update()
		})
		gg.canvas.on('keyup',function(e){
			spells.cast(e.args.key,game.blu.pl)
		})
	},
	list:[
		{
			key:'q',
			power:1,
			cooldown:5000,
			cancast:0,
			effect:'teleport'
		},
		{
			key:'w',
			power:2,
			cooldown:10000,
			cancast:0,
			effect:'teleport'
		},
		{
			key:'e',
			power:3,
			cooldown:20000,
			cancast:0,
			effect:'teleport'
		},
		{
			key:'r',
			power:4,
			cooldown:40000,
			cancast:0,
			effect:'teleport'
		}
	],
	effects:{
		teleport:{
			oncast: function(pl,spell){
				var p=gg.rot(pl.aim.p2,pl.aim.an),
					movefol=false,
					signx=gg.sign(p.x),
					signy=gg.sign(p.y)

				pl.x=pl.x+Math.min(Math.abs(p.x*spell.power),Math.abs(gg.m.x-pl.x))*signx
				pl.y=pl.y+Math.min(Math.abs(p.y*spell.power),Math.abs(gg.m.y-pl.y))*signy
				fol={
					x:gg.m.x,
					y:gg.m.y
				}

			}
		},
		explosion:{
			oncast:function(pl,spell){
				var p=pl.area.getpos(),
					d
				loop(pl.eteam.objs,function(i,e){
					d=e.dist(p)
					if(d<=pl.area.rad){
						//hit
						var dam=pl.damage*2*spell.power*spells.iscrit(pl),
							size=8+dam/3

						spells.dolifesteal(Math.min(dam,e.hp),pl)
						e.hp-=dam
						var dt=gg.text({
							x:e.x,
							y:e.y-10,
							vx:parseInt(gg.random(30)-15)/10,
							vy:3,
							death:new Date().getTime()+damtexttime,
							text:dam,
							size:size,
							alpha:0.5
						})
						damtexts[dt.uid]=dt

						game.updatehpbar(e)
						game.isdead(e)
					}
				})
				console.log(p)
			}
		},
		critical:{
			oncast: function(pl,spell){
				pl.crit=10+10*spell.power
				pl.linecolor='orange'
				pl.linewid=1
				gg.addtask({
					life:3000*spell.power,
					ondeath:function(){
						pl.crit=10
						pl.linewid=0
					}
				})
			}
		},
		lifesteal:{
			oncast: function(pl,spell){
				pl.lifesteal=25*spell.power
				pl.linecolor='red'
				pl.linewid=1
				gg.addtask({
					life:3000*spell.power,
					ondeath:function(){
						pl.lifesteal=0
						pl.linewid=0
					}
				})
			}
		},
		attspeed:{
			oncast: function(pl,spell){
				pl.attackspeed=1+0.1*spell.power
				pl.linecolor='red'
				pl.linewid=1
				gg.addtask({
					life:3000*spell.power,
					ondeath:function(){
						pl.attackspeed=1
						pl.linewid=0
					}
				})
			}
		}
	},
	cast:function(key,pl){
		var spell=spells.list.filter(f=>f.key==key)[0]
		if(spell){
			if(gg.ct>=spell.cancast){
				var effect=spells.effects[spell.effect]
				if(effect.oncast) effect.oncast(pl,spell)
				spell.cancast=gg.ct+spell.cooldown
			}
		}
	},
	dolifesteal:function(dam,pl){
		if(pl.lifesteal){
			pl.hp+=dam*pl.lifesteal/100
			pl.hp=Math.min(pl.hp,pl.maxhp)
			game.updatehpbar(pl)
		}

	},
	iscrit:function(pl){
		return gg.random(100)<=pl.crit?2:1
	},
	getcooldown:function(spell){
		var cooldown=0
		if(spell){
			cooldown=((spell.cancast-gg.ct)/1000).round(1)
			if(cooldown<0) cooldown=0
		}
		return cooldown
	},
	updatecooldowns:function(){
		var cooldown
		loop(spells.list,function(i,spell){
			cooldown=spells.getcooldown(spell)
			if(cooldown){
				spell.button.alpha=0.3
			} else {
				spell.button.alpha=0.8
			}
			spell.button.cooldown.text=cooldown.toFixed(1)
			spell.button.description.text=(spell.effect || '').toUpperCase()
		})
	},
	keyup:{},
	buttons:[],
	update:function(){
		loop(spells.buttons, function(i,b){
			b.y=window.innerHeight-spells.botgap
		})
	},
	draw:function(){
		//q w e r f
		var midx=window.innerWidth/2,
			wid=64,
			gap=8,
			b,
			length=spells.list.length


		loop(spells.list, function(i,spell){
			b=spells.node.rect({
				x:midx-length*wid/2-(length-1)*gap/2+i*wid+i*gap,
				y:window.innerHeight-spells.botgap,
				wid:wid,
				hig:wid,
				color:'lightgrey',
				spell:spell
			})
			spell.button=b
			b.cooldown=b.text({
				text:spell.key.toUpperCase(),
				size:16,
				x:wid/2-3,
				align:'right',
				y:-wid/2+16
			})
			b.spellkey=b.text({
				text:spell.key.toUpperCase(),
				size:16,
				x:-wid/2+3,
				align:'left',
				y:-wid/2+16
			})
			b.description=b.text({
				text:spell.key.toUpperCase(),
				size:14,
				x:0,
				y:5,
				align:'center'
			})
			b.on('mouseup',function(e){
				if(shop.dragging){
					spell.effect=shop.draginfo
				}
			})

			spells.buttons[i]=b
		})
	},
	run:function(){
		spells.updatecooldowns()
	}
}
spells.init()

var shop={
	node:'',
	init:function(){
		this.drawshop()
		gg.canvas.on('keyup',function(e){
			if(e.args.key=='s'){
				shop.node.visible=!shop.node.visible
			}
		})
	},
	dragging:'',
	draginfo:'',
	drawshop:function(){
		shop.node=gg.rect({
			x:window.innerWidth/2,
			y:window.innerHeight/2,
			wid:window.innerWidth,
			hig:window.innerHeight,
			alpha:0.8,
			visible:false
		})
		shop.node.on('click',function(e){
			e.stop=true
			console.log('shop click')
		})
		shop.node.on('mousemove',function(e){
			e.stop=true
			if(shop.dragging){
				shop.dragging.setpos(gg.m)
			}
		})
		shop.node.on('mouseup',function(e){
			if(shop.dragging){
				shop.dragging.rem()
				shop.dragging=''
			}
		})
		var wid=64,
			i=0,
			length=objlen(spells.effects),
			count=4
		loop(spells.effects,function(k,v){
			var b=shop.node.rect({
				x:(i%count)*(wid+8)-count*(wid+8)/2,
				y:-window.innerHeight/2+8+wid/2+(wid+8)*parseInt(i/count),
				wid:wid,
				hig:wid,
				color:'lightgrey',
				linecolor:'white',
				linewid:0,
				spell:v
			})
			b.on('mouseover',function(e){
				b.linewid=1
			})
			b.on('mouseout',function(e){
				b.linewid=0
			})
			b.on('mousedown',function(e){
				var n=shop.node.circ({
					rad:10,
					color:'lightgrey'
				})
				n.setpos(gg.m)
				shop.dragging=n
				shop.draginfo=k

			})
			b.name=b.text({
				text:k,
				size:16,
				align:'center',
				y:-wid/2+16
			})

			i+=1
		})
	}
}
shop.init()

var ui=gg.node()
shop.node.to(ui)
spells.node.to(ui)


var fol = game.blu.pl.pos()
game.ground.on('click',function(e){
	fol={
		x:gg.m.x,
		y:gg.m.y
	}
})
game.ground.on('mousemove',function(e){
	fol={
		x:gg.m.x,
		y:gg.m.y
	}
})

gg.addtask({
	name:'gameloop',
	run: function(){
		game.run()
	}
})
gg.addtask({
	name:'100',
	interval: 100,
	run:function(){
		spells.run()
	}
})
gg.addtask({
	name:'500',
	interval: 500,
	run:function(){
		var pl=game.blu.pl
		pl.hp+=Math.min(pl.hpregen,pl.maxhp-pl.hp)
		game.updatehpbar(pl)

		pl=game.red.pl
		pl.hp+=Math.min(pl.hpregen,pl.maxhp-pl.hp)
		game.updatehpbar(pl)

		//win condition
		var haveblutowers=false,
			haveredtowers=false
		loop(game.blu.objs,function(i,o){
			if(o.objtype=='tower'){
				haveblutowers=true
				return false
			}
		})
		loop(game.red.objs,function(i,o){
			if(o.objtype=='tower'){
				haveredtowers=true
				return false
			}
		})
		if(!haveblutowers || !haveredtowers){
			//game.addtowers()
		}
	}
})
gg.addtask({
	name:'spawnminions',
	interval:10000,
	run:function(){
		game.addminions()
	}
})
