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
	clearcolor:'#799d31'
})
var game = {
	init: function(){
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
		var o=gg.circ(a)
		o.maxhp=a.hp
		if(!a.hiderange){
			o.g_range=gg.circ({
				rad:a.range,
				linewid:1,
				linecolor:'#222',
				alpha:0.5
			}).to(o)
		}
		// if(!a.hidevision){
		// 	o.g_vision=gg.circ({
		// 		rad:a.vision,
		// 		linewid:0.5,
		// 		linecolor:'#222',
		// 		alpha:0.5
		// 	}).to(o)
		// }
		o.g_hp=gg.rect({
			color:'orange',
			x:0,
			y:-o.rad-5,
			wid:30,
			hig:3
		}).to(o)
		o.g_hpleft=gg.rect({
			color:'yellowgreen',
			x:0,
			y:-o.rad-5,
			wid:30,
			hig:3
		}).to(o)
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
	addtowers: function(){
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
	}
}
game.init()

var spells={
	list:[
		{
			key:'q',
			power:1,
			cooldown:5000,
			cancast:0,
			effect:'explosion'
		},
		{
			key:'w',
			power:2,
			cooldown:10000,
			cancast:0,
			effect:'explosion'
		},
		{
			key:'e',
			power:3,
			cooldown:20000,
			cancast:0,
			effect:'explosion'
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
					movefol=false

				pl.x=pl.x+p.x*spell.power
				pl.y=pl.y+p.y*spell.power
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
						var dam=pl.damage*2*spell.power,
							size=8+dam/3
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
					}
				})
				console.log(p)
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
	getcooldown:function(spell){
		var cooldown=0
		if(spell){
			cooldown=((spell.cancast-gg.ct)/1000).round(1)
			if(cooldown<0) cooldown=0
		}
		return cooldown
	}
}

var ui={
	botgap:64,
	init:function(){
		this.draw()
		gg.canvas.on('resize', function(e){
			ui.update()
		})
		gg.canvas.on('keyup',function(e){
			spells.cast(e.args.key,game.blu.pl)
		})
	},
	updatecooldowns:function(){
		var cooldown
		loop(spells.list,function(i,spell){
			cooldown=spells.getcooldown(spell)
			spell.button.cooldown.text=cooldown.toFixed(1)
			spell.button.description.text=(spell.effect || '').toUpperCase()
		})
	},
	keyup:{},
	buttons:[],
	update:function(){
		loop(ui.buttons, function(i,b){
			b.y=window.innerHeight-ui.botgap
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
			b=gg.rect({
				x:midx-length*wid/2-(length-1)*gap/2+i*wid+i*gap,
				y:window.innerHeight-ui.botgap,
				wid:wid,
				hig:wid,
				color:'lightgrey',
				spell:spell
			})
			spell.button=b
			b.cooldown=gg.text({
				text:spell.key.toUpperCase(),
				size:16,
				x:wid/2-3,
				align:'right',
				y:-wid/2+16
			}).to(b)
			b.text=gg.text({
				text:spell.key.toUpperCase(),
				size:16,
				x:-wid/2+3,
				align:'left',
				y:-wid/2+16
			}).to(b)
			b.description=gg.text({
				text:spell.key.toUpperCase(),
				size:14,
				x:0,
				y:5,
				align:'center'
			}).to(b)


			ui.buttons[i]=b
		})
	}
}
ui.init()

var fol = game.blu.pl.pos()
gg.canvas.on('click',function(e){
	fol={
		x:gg.m.x,
		y:gg.m.y
	}
})
gg.canvas.on('mousemove',function(e){
})
gg.addtask({
	name:'gameloop',
	run: function(){

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
							damage:o.damage
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
				pl.area.linecolor='green'
			}
		}


		//bullets
		loop(bullets,function(id,b){
			b.fol(b.tar.pos(),bulletspeed)
			dist = b.dist(b.tar.pos())
			if(dist<1){
				//hit
				//crit chance
				var dam=b.damage*(gg.random(10)==10?2:1)
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
				if(!b.tar.removed && b.tar.hp.round()<=0){
					//console.log('dead')
					//dead
					if(b.tar.respawn){
						b.tar.pos(b.tar.respawn.pos)
					} else if(!b.tar.removed){
						b.tar.rem()
						delete game.objs[b.tar.uid]
						delete b.tar.team.objs[b.tar.uid]
					}
				}
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
})
gg.addtask({
	name:'100',
	interval: 100,
	run:function(){
		ui.updatecooldowns()

		var pl=game.blu.pl
		pl.hp+=Math.min(pl.hpregen,pl.maxhp-pl.hp)
		game.updatehpbar(pl)

		pl=game.red.pl
		pl.hp+=Math.min(pl.hpregen,pl.maxhp-pl.hp)
		game.updatehpbar(pl)

	}
})
gg.addtask({
	name:'spawnminions',
	interval:10000,
	run:function(){
		game.addminions()
	}
})