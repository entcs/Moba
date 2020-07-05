var range = 100,
	vision = 200,
	bulletspeed = 1000,
	movementspeed = 100,
	cooldown = 1000,
	attackspeed = 1000/cooldown,
	damage = 5,
	enemyhp = 10,
	towerhp = 100,
	towerdamage = 20,
	towerrange = 150,
	towervision = 300,
	bullets=[],
	bul,
	lastshot = new Date().getTime(),
	blu='#394a8a'
	red='#bc4e18'

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
	blu:{
		objs:{}
	},
	red:{
		objs:{}
	},
	addplayers: function(){
		var pl=gg.circ({
			x:gg.canvas.width/2-50,
			y:gg.canvas.height/2,
			rad:10,
			color:blu
		})
		pl.range=gg.circ({
			rad:range,
			linewid:1,
			linecolor:'#222',
			alpha:0.5
		}).to(pl)
		pl.vision=gg.circ({
			rad:vision,
			linewid:0.5,
			linecolor:'#222',
			alpha:0.5
		}).to(pl)
		game.blu.pl=pl
		game.blu.objs[pl.uid]=pl

		pl=gg.circ({
			x:gg.canvas.width/2+50,
			y:gg.canvas.height/2,
			rad:10,
			color:red
		})
		pl.range=gg.circ({
			rad:range,
			linewid:1,
			linecolor:'#222',
			alpha:0.5
		}).to(pl)
		pl.vision=gg.circ({
			rad:vision,
			linewid:0.5,
			linecolor:'#222',
			alpha:0.5
		}).to(pl)
		game.red.pl=pl
		game.red.objs[pl.uid]=pl
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
			tower = gg.circ({
				x:p.x,
				y:p.y,
				rad:15,
				color:blu
			})
			tower.range=gg.circ({
				rad:towerrange,
				linewid:1,
				linecolor:'#222'
			}).to(tower)
			tower.vision=gg.circ({
				rad:towervision,
				linewid:0.5,
				linecolor:'#222'
			}).to(tower)
			game.blu.objs[tower.uid]=tower

		})
		loop(towerpos2,function(i,p){
			tower = gg.circ({
				x:p.x,
				y:p.y,
				rad:15,
				color:red
			})
			tower.range=gg.circ({
				rad:towerrange,
				linewid:1,
				linecolor:'#222'
			}).to(tower)
			tower.vision=gg.circ({
				rad:towervision,
				linewid:0.5,
				linecolor:'#222'
			}).to(tower)
			game.red.objs[tower.uid]=tower
		})

		//add bases
		var base=gg.circ({
			x:100,
			y:500,
			rad:20,
			color:blu
		})
		game.blu.objs[base.uid]=base

		base=gg.circ({
			x:1820,
			y:500,
			rad:20,
			color:red
		})
		game.red.objs[base.uid]=base
	},
	loop: {
		name:'gameloop',
		run: function(){
			game.blu.pl.fol(fol,movementspeed)
			var rmin=100000000,
				bmin=100000000
			loop(game.red.objs,function(i,r){
				loop(game.blu.objs, function(j,b){
					d=r.dist(b)
					//red hit
					if(d<r.range){
						rmin
						tar=e
					}
				})
			})

			if(tar){
				if(tar.dist(p)<range){
					if(gg.ct>lastshot){
						lastshot = gg.ct+cooldown
						//shoot
						bul=gg.circ({
							x:p.x,
							y:p.y,
							rad:3,
							color:game.blu.pl.color

						})
						bul.tar=tar
						bul.look(tar.pos())
						bul.an-=90
						bullets.push(bul)
					}
				}
			}


			var deadbullets=[]
			loop(bullets,function(i,b){
				b.fol(b.tar.pos(),bulletspeed)
				dist = b.dist(b.tar.pos())
				if(!dist){
					//hit
					b.tar.hp -= damage
					deadbullets.push(b)
					if(!b.tar.removed && b.tar.hp.round()<=0){
						//spawn buff
						var sp=b.tar.pos()
						spawnbuff(sp.x,sp.y)

						//dead
						if(!b.tar.removed){
							b.tar.rem()
							enemies.splice(enemies.indexOf(b.tar),1)
						}
					}
				}
			})
			loop(deadbullets,function(i,b){
				bullets.splice(bullets.indexOf(b),1)
				b.rem()
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
