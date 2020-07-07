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
	miniondamage=2,

	bullets={},
	bul

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
		o.g_range=gg.circ({
			rad:a.range,
			linewid:1,
			linecolor:'#222',
			alpha:0.5
		}).to(o)
		o.g_vision=gg.circ({
			rad:a.vision,
			linewid:0.5,
			linecolor:'#222',
			alpha:0.5
		}).to(o)
		o.g_hp=gg.rect({
			color:'orange',
			x:0,
			y:-o.rad-5,
			wid:40,
			hig:5
		}).to(o)
		o.g_hpleft=gg.rect({
			color:'yellowgreen',
			x:0,
			y:-o.rad-5,
			wid:40,
			hig:5
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
	addminion:function(p,team){
		var o=game.addobj({
			x:p.x,
			y:p.y,
			rad:5,
			color:team.color,
			range:plrange,
			vision:plvision,
			attackspeed:plattackspeed,
			movementspeed:minionspeed,
			hp:minionhp,
			damage:miniondamage,
			lastshot:new Date().getTime(),
			team:team
		})
	},
	addplayer: function(a){
		var pl=game.addobj({
			x:a.x,
			y:a.y,
			rad:10,
			team:a.team,
			// color:a.team.color,
			range:plrange,
			vision:plvision,
			attackspeed:plattackspeed,
			movementspeed:plmovementspeed,
			hp:plhp,
			damage:pldamage,
			hpregen:plhpregen,
			lastshot:new Date().getTime()
		})
		pl.team.pl=pl
		return pl
	},
	addplayers: function(){
		game.addplayer({
			x:gg.canvas.width/2-500,
			y:gg.canvas.height/2,
			team:game.blu
		})

		game.addplayer({
			x:gg.canvas.width/2+500,
			y:gg.canvas.height/2,
			team:game.red
		})
	},
	addtowers: function(){
		var w=1920/2

		var towerpos1=[
			{x:w-200,y:100},
			{x:w-600,y:100},
			{x:w-200,y:900},
			{x:w-600,y:900},
		]
		var towerpos2=[
			{x:w+200,y:100},
			{x:w+600,y:100},
			{x:w+200,y:900},
			{x:w+600,y:900},
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
			y:500,
			rad:20,
			team:game.blu,
			range:towerrange,
			attackspeed:towerattackspeed,
			damage:towerdamage,
			hp:towerhp,
			lastshot:new Date().getTime()
		})

		base=game.addobj({
			x:1820,
			y:500,
			rad:20,
			team:game.red,
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
	loop: {
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
					d=r.dist(b)
					if(d<=r.vision && d<r.closest){
						r.closest=d
						r.tar=b
					}
					if(d<=b.vision && d<b.closest){
						b.closest=d
						b.tar=r
					}
				})
			})
			loop(game.objs,function(i,o){

				if(o.tar){
					if(o.closest<=o.range){
						//shoot
						if(gg.ct>=o.lastshot){
							o.lastshot=gg.ct+1000/o.attackspeed
							bul=gg.circ({
								x:o.x,
								y:o.y,
								rad:3,
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
			loop(bullets,function(id,b){
				b.fol(b.tar.pos(),bulletspeed)
				dist = b.dist(b.tar.pos())
				if(dist<1){
					//hit
					b.tar.hp -= b.damage
					game.updatehpbar(b.tar)
					delete bullets[id]
					b.rem()
					if(!b.tar.removed && b.tar.hp.round()<=0){
						console.log('dead')
						//dead
						// if(!b.tar.removed){
						// 	b.tar.rem()
						// }
					}
				}
			})
		}
	}
}
game.init()

var fol = game.blu.pl.pos()
gg.canvas.on('click',function(e){
	fol={
		x:gg.m.x,
		y:gg.m.y
	}
})
gg.addtask(game.loop)
gg.addtask({
	name:'hpregen',
	interval: 200,
	run:function(){
		var pl=game.blu.pl
		pl.hp+=Math.min(pl.hpregen,pl.maxhp-pl.hp)
		game.updatehpbar(pl)

		pl=game.red.pl
		pl.hp+=Math.min(pl.hpregen,pl.maxhp-pl.hp)
		game.updatehpbar(pl)

	}
})
