var fol={x:900,y:100};
var act=0;

c.addEventListener('mousemove', function(e) {    
	var mpos = g.Mpos(canvas, e);
	g.mpos.x=mpos.x;
	g.mpos.y=mpos.y;
    }, false);
c.addEventListener('click', function(e) {    
	fol.x=g.mpos.x;
	fol.y=g.mpos.y;	
    }, false);

g.pls={};	
function addPl(conf){
	var pl=g.Circ({
		name: conf.name,
		x:conf.x,
		y:conf.y,
		rad:10,
		fill:conf.color,
		parent:g.root,
		cursor: 'pointer'	
	});
	pl.aggro=g.Circ({
		name: name+' aggro',
		x:0,
		y:0,
		rad:conf.aggro,
		stroke: 'rgba(0,0,0,0.1)',
		lineWidth:1,
		parent:pl,
		active:0
	});	
	pl.range=g.Circ({
		name: name+' range',
		type:'cool',
		x:0,
		y:0,
		rad:conf.range,
		stroke: 'rgba(255,0,0,0.2)',
		lineWidth:1,
		parent:pl,
		active:0
	});
	pl.cool=0;
	pl.hp=100;
	pl.ap=10;
	
	pl.target=0;	
	g.pls[pl.name]=pl;
	return pl;
};
remPl=function(pl){
	if (typeof(pl)=='string'){
		pl=g.pls[pl];
	};	
	g.root.remNode(pl);
	delete g.pls[pl.name];
};
me=addPl({
	name:'me',
	color:'green',
	x:700,
	y:100,	
	aggro: 100,
	range: 50
});
fol.x=me.x;
fol.y=me.y;

for (var nr=0;nr<10;nr++){
	addPl({
		name:'p'+nr,
		color:'red',
		x:Math.random()*800,
		y:Math.random()*800,
		aggro: 100,
		range: 50
	});	
};


act=[me];

g.Loop({
	name:'fol',
	//interval: 0,//ms
	//count: 10,//nr of times
	//life: 10,//seconds
	fn:function(){
		for (var nr in act){			
			var tar=act[nr],
				dx=fol.x-tar.x,
				dy=fol.y-tar.y,
				dist=Math.sqrt(dx*dx+dy*dy),
				speed=100,
				nvec=g.Normalize([dx,dy]),
				tim=speed/dist,
				mx=nvec[0]*g.dt*speed,
				my=nvec[1]*g.dt*speed;
			if (Math.abs(mx)>Math.abs(dx) || Math.abs(my)>Math.abs(dy)){
				mx=dx;
				my=dy;
			};		
			tar.x=tar.x+mx;
			tar.y=tar.y+my;				
		};
		
		var pl,tar=0;
		for (var name1 in g.pls){			
			pl=g.pls[name1];	
			pl.range.fill='none';
			pl.target=0;			
			for (var name2 in g.pls){
				tar=g.pls[name2];											
				if (pl!=tar){						
					var dist=pl.getDist(tar);						
					if (dist<pl.aggro.rad){
						if (dist<pl.range.rad){
							pl.target=tar;
							pl.range.fill='rgba(255,0,0,0.2)';
						};
						
						if (dist>pl.range.rad-10 && pl!=me){
							var dx=tar.fpos[0]-pl.fpos[0],
								dy=tar.fpos[1]-pl.fpos[1],
								vec=g.Normalize([dx,dy]),
								speed=50;
							vec=[vec[0]*g.dt*speed,vec[1]*g.dt*speed]
							pl.setPos(vec,pl);						
						};
					};
				};
			};
		};

	}
});
g.Loop({
	name:'att',
	interval: 1000,//ms
	//count: 10,//nr of times
	//life: 10,//seconds
	fn:function(){
		for (var name1 in g.pls){			
			pl=g.pls[name1];
			if (pl.hp<100){
				pl.hp+=2;
			};
			if (pl.target){
				console.log('attack');
				pl.target.hp-=pl.ap;
				if (pl.target.hp<=0){
					remPl(pl.target);
				};
			};
		};
	}
});
