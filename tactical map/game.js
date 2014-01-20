var g={
	ct:0,
	ft:0,
	lt:0,
	fps:0,
	cool: 500,
	regen: 500,
	mpos:{x:0,y:0},
	loops:{},
	pls:{},
	selected:0,
	notes:{},
	arrows:{},
	sizeOf:function(obj){
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},
	lookAt:function(obj,tar){
		var dx=obj.attrs.x-tar.x,
			dy=obj.attrs.y-tar.y,
			an=Math.atan(dy/dx),			
			add=0;
			
		if (dx<0 && dy<0) {
			add=Math.PI/2;
		} else 
		if (dx>0 && dy<0) {
			add=-Math.PI/2;
		} else 
		if (dx<0 && dy>0) {
			add=Math.PI/2;
		} else {
			add=-Math.PI/2;
		};
		
		if (an){
			obj.setRotation(an+add);
		};
	},
	Follow:function(obj,tar){
		var dx=obj.attrs.x-tar.x,
			dy=obj.attrs.y-tar.y,
			vec=g.Norm([dx,dy]),
			speed=obj.speed,	
			x=0,
			y=0,
			dist=g.Dist(obj,tar);
		x=vec[0]*speed*g.dt;
		y=vec[1]*speed*g.dt;
		
		x=g.Abs([dx,x]).sorig;
		y=g.Abs([dy,y]).sorig;					
		obj.setPosition(obj.attrs.x-x,obj.attrs.y-y);			
	},
	Bump:function(obj,scale){
		scale=scale || 1.2;
		obj.transitionTo({
			scale: {
				x: scale,
				y: scale
			},
			duration: 0.1,
			easing: 'back-ease-out',
			callback: function() {
				if (obj.getParent()){
					obj.transitionTo({
						scale: {
							x: 1,
							y: 1
						},
						duration: 0.3,
						easing: 'back-ease-out'
					});				
				};
			}
		})
	},
	Bow:function(obj){
		obj.setScale({
			x:0.75,
			y:1.5			
		});
		//obj.setX(-18);
		obj.transitionTo({
			scale: {
				x: 1,
				y: 1
			},
			//x:0,
			//y:0,
			duration: 1,
			easing: 'elastic-ease-out'
		});	
	},
	Sword:function(obj,tar){
		var an=Math.PI/2;
		if (Math.random()>0.5) an=-an;
		obj.setRotation(an);
		obj.transitionTo({
			rotation: 0,
			duration: 1,
			easing: 'elastic-ease-out'
		})			
		
	},
	Extend:function(obj,conf){
		for (var nr in conf){
			obj[nr]=conf[nr];
		};
	},
	addPl:function(conf){
		var pl=new Kinetic.Group({
				x: conf.x,
				y: conf.y				
			}),
			attrs={
				name:conf.name,
				tar:0,
				fol:0,
				cool:0,
				pathing:[],
				hp:conf.hp,
				maxhp:conf.hp/*,
				vis:new Kinetic.Circle({
					x: 0,
					y: 0,
					radius: conf.hp/10,
					fill: conf.color
				})/**/
			};
		this.Extend(pl,attrs);
		this.Extend(pl,conf);
		var crop={
				x:48,y:0,width: 48, height: 48
			  };
		if (pl.range>=100) {
			crop={
				x:0,y:0,width: 48, height: 48
			  };
		};
		var imageObj = new Image();
		imageObj.src = './gfx/items.png';	
		  
		pl.img = new Kinetic.Image({
		  x: 0,
		  y: 0,
		  offset:[24,24],
		  image: imageObj,
		  width: 48,
		  height: 48,
		  crop:crop
		});
		
		pl.add(pl.img);		  
		//pl.add(pl.vis);		
		g.world.add(pl);
		g.pls[pl.name]=pl;
		pl.getPos=function(){
			return {x:this.attrs.x,y:this.attrs.y}
		};
		g.addPlEvents(pl);

		/**/
		return pl;
	},
	addPlEvents:function(pl){
		pl.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
	    });
	    pl.on('mouseout', function() {
			document.body.style.cursor = 'default';
	    });
		pl.on('mousedown',function(e){
			g.pathing=1;			
			g.preventdrag=1;
			g.dragstart=0;
			g.selected=pl;
			g.clearPlayerPathing(pl);
			pl.tar=0;
		})
		pl.on('mouseenter',function(e){
			if (g.pathing){
				if(g.selected!=pl){				
					g.selected.tar=pl;
					g.preventdrag=0;
					g.pathing=0;
					g.clearPlayerPathing(g.selected);
				};
			};
		})
		pl.on('mouseup',function(e){
			g.preventdrag=0;
			g.pathing=0;
			
		})	
	},
	clearPlayerPathing: function(pl){
		for (var nr in pl.pathing){
			var pathing=pl.pathing[nr];
			pathing.spot.remove();
		};
		pl.pathing=[];		
	},
	remPl:function(pl){
		if(typeof(pl)=='string'){
			pl=g.pls[pl];
		};
		delete g.pls[pl.name];		
		pl.vis.remove();
		pl.remove();
	},
	Loop:function(conf){
		var loop={
				name:conf.name,
				fn:conf.fn,
				count:conf.count || 0,
				birth:new Date().getTime(),
				lasttick:new Date().getTime(),
				life:conf.life || 0,				
				interval:conf.interval || 0,
				callback: conf.callback || 0
			};
		this.loops[conf.name]=loop;
		return loop;
	},
	doloops:function(){
		//handle loops
		var loop,
			remlist=[],
			run=1,
			now=1,
			die=0;	
			
		for (var nr=0 in g.loops){
			run=1;
			now=1;
			die=0;
			loop=g.loops[nr];				
			if (loop.life){//has lifetime
				if (g.ct-loop.birth>loop.life*1000){
					die=1;
					run=0;
				};
			};
			if (loop.interval){//has interval
				if (g.ct-loop.lasttick<loop.interval){
					now=0;
					run=0;
				} else {
					loop.lasttick=loop.lasttick+loop.interval;
				};
			};
			if (now && loop.count>0) {//counted runs
				loop.count--;
				run=1;
				if (loop.count==0) die=1;
			};
			if (run){
				loop.fn();
			};
			if (die){
				remlist.push(loop.name);			
			};
		};
		
		//remove dead loops and do callback
		for (var val in remlist){
			if (loop.callback){
				loop.callback();
			};			
			delete g.loops[remlist[val]];
		};	
	},
	Dist:function(pos1,pos2){	
		dx=pos1.x-pos2.x,
		dy=pos1.y-pos2.y;
		dist=Math.sqrt(dx*dx+dy*dy);		
		return dist;
	},	
	Norm:function(vec){
		var max=0,val,nvec=[];
		for (var nr in vec){
			val=vec[nr];
			if (Math.abs(val)>max) max=Math.abs(val);
		};
		for (var nr in vec){
			val=vec[nr];
			if (max<1) {
				nvec.push(vec[nr]);
			} else {
				nvec.push(vec[nr]/max);
			};
		};
		return nvec;
	},
	Abs:function(list){
		var big='none',
			sma='none',			
			borig=0,
			sorig=0,
			val=0;
		for (var nr in list){
			val=Math.abs(list[nr]);
			if (big=='none') {
				big=val;
				borig=list[nr];
			};
			if (sma=='none') {
				sma=val;
				sorig=list[nr];
			};
			
			if (val>big) {
				big=val;
				borig=list[nr];
			};
			if (val<sma) {
				sma=val;
				sorig=list[nr];
			};				
		};
		return {borig:borig,big:big,sorig:sorig,sma:sma};
	},
	getTargets:function(pl){
		var tar,closest={tar:0,val:0},weakest=0,strongest=0,dist;
		for(var name in g.pls){
			tar=g.pls[name];
			if (pl!=tar && pl.type!=tar.type){
				dist=g.Dist(pl.getPos(),tar.getPos());
				if (dist<pl.aggro){
					if (!closest.tar || dist<closest.val){
						closest.tar=tar;
						closest.val=dist;
					};
					if (!weakest || dist<weakest.hp){
						weakest=tar;					
					};
					if (!strongest || dist>strongest.hp){
						strongest=tar;					
					};
				};
			};
		};
		pl.closest=closest;
		pl.weakest=weakest;
		pl.strongest=strongest;
	},
	setupworld:function(conf){
		
		var g=this,
			size=conf.size || [window.innerHeight,window.innerHeight],
			mapsize=conf.mapsize || 1000;
		g.size=size;
		g.mapsize=mapsize;
		if (typeof(size)=='number') g.size=[size,size];		
		if (typeof(mapsize)=='number') g.mapsize=[mapsize,mapsize];		
		g.stage = new Kinetic.Stage({
			container: 'container',
			width: g.size[0],
			height: g.size[1]
		});
		g.layer = new Kinetic.Layer();
		g.world=new Kinetic.Group({
			x:0,
			y:0
		});
		g.world.scale=1;
		rect=new Kinetic.Rect({
				width: g.mapsize[0],
				height: g.mapsize[1],
				x:0,
				y:0,
				fill: 'green'
				});
		g.world.add(rect);
		g.world.rect=rect;
		g.layer.add(g.world);

	},
	addworldevents:function(){
		//mapmove
		g.domovemap=0;
		g.dragstart=0;
		g.mapshift=0;
		
		g.drag=0;
		
		g.world.on('mousedown',function(e){
			if (!g.preventdrag) {
				g.dragstart=g.stage.getMousePosition();
				g.mapshift=g.world.getPosition();
			};			
		});			
		g.world.on('mouseup', function(e) {
			if (!g.domovemap){
				g.pathing=0;
			};
			g.domovemap=0;
			g.dragstart=0;
			g.pathing=0;
			g.preventdrag=0;
			document.body.style.cursor = 'default';
		});	
		g.world.on('mousemove',function(e){			
			if (g.dragstart){
				document.body.style.cursor = 'move';
				var mouse=g.stage.getMousePosition(),
				dif={
					x:mouse.x-g.dragstart.x,
					y:mouse.y-g.dragstart.y
				}
				if (g.domovemap || Math.abs(dif.x)>5 || Math.abs(dif.y)>10){
					var pos={
						x:g.mapshift.x+dif.x,
						y:g.mapshift.y+dif.y
					};
					g.domovemap=1;
					//keep map in view
					if (pos.x>0){
						pos.x=0;
					}
					if (pos.y>0){
						pos.y=0
					}
					var wpos={
						x:pos.x+g.mapsize[0]*g.world.scale,
						y:pos.y+g.mapsize[1]*g.world.scale,
					};
					if (wpos.x<can.width){
						pos.x+=can.width-wpos.x;
					}							
					if (wpos.y<can.height){
						pos.y+=can.height-wpos.y;
					}	
					g.world.setPosition({
						x:pos.x,
						y:pos.y
					});					
				} else {
					//
				};
			} 
			else if (g.pathing){
				document.body.style.cursor = 'pointer';
				var pos1,
					pos2,
					dist,
					pl=g.selected;
					
				if (pl.pathing.length) {
					pos1=pl.pathing[pl.pathing.length-1].pos
				} else {
					pos1=pl.getPosition();
				};
				
				pos2=g.stage.getMousePosition();
				mpos={
					x: (g.mpos.x-g.world.getX())/g.world.scale,
					y: (g.mpos.y-g.world.getY())/g.world.scale
				}				
				dist=g.Dist(pos1,mpos);				
				if (dist>50){
					g.addFollowSpot(pl,mpos);
				}
				/**/
				
			} else {
				//document.body.style.cursor = 'default';
			};
			
		});
		//zoom
		g.canvas.onmousewheel=function(e){			
			console.log('wheel');
			var scale=g.world.getScale().x,
				oscale=scale,
				step=1.5,
				min=0.1,
				max=1;
				
			if (e.wheelDelta>0 || e.deltaX>0){				
				scale*=step;				
			} else {
				scale/=step;
			}
			if (g.world.rect.getWidth()*scale<can.width){
				//scale=min;
				scale=can.width/g.world.rect.getWidth();
			} else if (scale>1){
				scale=1;
			}
			g.world.setScale(scale);
			g.world.scale=scale;
			var scalediff=scale-oscale;
			px=(g.mpos.x-g.world.getX())/oscale;
			py=(g.mpos.y-g.world.getY())/oscale;			
			
			ox=px*oscale;
			nx=px*scale;
			
			oy=py*oscale;
			ny=py*scale;
			
			dx=ox-nx;
			dy=oy-ny;
			var pos={
				x:g.world.getX()+dx,
				y:g.world.getY()+dy
			};
			wpos={
				x: g.world.rect.getWidth()*scale+pos.x,
				y: g.world.rect.getHeight()*scale+pos.y
			}			
			
			if (pos.x>0){
				pos.x=0;
			}
			if (pos.y>0){
				pos.y=0
			}			
			
			if (wpos.x<can.width){
				pos.x+=can.width-wpos.x;
			}
			if (wpos.y<can.height){
				pos.y+=can.height-wpos.y;
			}
			g.world.setPosition(pos);			
		};	
	},
	addFollowSpot: function(pl,pos){
		spot = new Kinetic.Circle({
			x: pos.x,
			y: pos.y,
			radius: 20,
			fill: 'rgba(255,255,255,0.2)'
		});
		spot.owner=pl;					
		spot.on('mousedown',function(e){					
			var pl=this.owner,
				count=0,
				len=pl.pathing.length-1;

				g.pathing=1;			
				g.preventdrag=1;
				g.dragstart=0;
				g.selected=pl;
				
			for (var nr=len;nr>=0;nr--){
				var pathing=pl.pathing[nr];
				if (pathing.spot==this){								
					break;
				} else {
					pathing.spot.remove();
					pl.pathing.pop();
				};
			};
		});
		spot.on('mouseup',function(e){
			g.preventdrag=0;
			g.pathing=0;
		});
		spot.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
	    });
	    spot.on('mouseout', function() {
			document.body.style.cursor = 'default';
	    });		
		g.selected.pathing.push({
			pos: pos,
			spot: spot
		});					
		g.world.add(spot);		
		
	},
	floatText:function(pos,txt,col){
		var col=col || 'red',
			note= new Kinetic.Text({
			x: pos.x-10,
			y: pos.y-20,
			text: txt,
			align: 'right',
			fontSize: 14,
			fontStyle: 'bold',
			fontFamily: 'Arial',
			fill: col									
		});
		g.world.add(note);								
		var uniq=col+Math.random()+new Date().getTime();
		note.transitionTo({
			y: pos.y-50,
			scale: {x:1.2,y:1.2},
			duration: 0.5,
			mydata: uniq,
			callback: function() {
				g.notes[this.mydata].remove();										
				delete g.notes[this.mydata];
			}								  
		});
		g.notes[uniq]=note; 		
	},	
	addui:function(){
		g.simpleText = new Kinetic.Text({
			x: 10,
			y: 10,
			text: 'Mouse pos',
			fontSize: 14,
			fontFamily: 'Calibri',
			fill: 'white'
		});
		g.layer.add(g.simpleText);
		g.winText = new Kinetic.Text({
			x: 400,
			y: 300,
			align: 'center',
			text: '',
			fontSize: 48,
			fontFamily: 'Calibri',
			fill: 'orange'
		});
		g.layer.add(g.winText);
		g.winText.on('click',function(e){
			location.reload();
		});

		g.stage.add(g.layer);	
	},
	addpls:function(nrpls){
		var group=['rgba(0,0,255,0.5)','rgba(255,0,0,0.5)','rgba(255,255,0,0.5)','rgba(255,0,255,0.5)'];
		for (var nr=0;nr<nrpls;nr++){
			pl=g.addPl({
				name:'pl'+nr,
				type:group[nr%4],
				x:Math.random()*g.world.rect.getWidth(),
				y:Math.random()*g.world.rect.getWidth(),
				color: group[nr%4],
				speed: 100,
				aggro: 350,
				hp: 50+Math.random()*150,
				range: 50+50*(nr%2),
				dam: 9+3*(1-(nr%2)),
				regen:1
			});	
		};
	},
	addmainloop:function(){
		g.gameStart=new Date().getTime();
		g.anim = new Kinetic.Animation(function(frame) {	
			g.ct=frame.lastTime;
			g.lt=frame.timeDiff;
			g.dt=frame.timeDiff/1000;
			g.fps=frame.frameRate;		
			g.doloops();
			g.mpos=g.stage.getMousePosition();// || {x:0,y:0};
			if (!g.mpos){
				g.dragstart=0;				
				g.mapmove=0;
				g.mpos={x:0,y:0};
				g.pathing=0;				
				g.preventdrag=0;
			} else {
			};			
			g.simpleText.setText('mx:'+g.mpos.x+' y:'+g.mpos.y+' fps:'+Math.floor(frame.frameRate));	
		}, g.layer);
		g.anim.start();	
	},
	init: function(){		
		//setup
		g.setupworld({
			//size: [window.innerWidth,window.innerHeight],
			mapsize: 15000
		});
		g.addui();
		g.addpls(50);
		$('canvas').attr('id','can');		
		g.canvas=document.getElementById('can');
		g.addworldevents();
		g.addmainloop();
		$(document).ready(function(){

		});		
	}
};

g.init();


//loops
var end=0;
g.Loop({
	name:'blink',
	//count: 3,
	interval: 0,
	//life: 10,
	fn:function(){
		//loop	
	}		
});

g.Loop({
	name:'blink',
	//count: 3,
	interval: 0,
	//life: 10,
	fn:function(){
		for (var name in g.pls){			
			pl=g.pls[name];
			
			if (pl.tar){
				var plpos=pl.getPosition(),
					tarpos=pl.tar.getPosition(),
					dist=g.Dist(plpos,tarpos),
					range=50;
				if (dist>range){
					g.lookAt(pl,tarpos);
					g.Follow(pl,tarpos);
				}
			} 
			else if (pl.pathing.length){					
				var pos1=pl.getPosition(),
					pos2=pl.pathing[0].pos,
					dist;					
				dist=g.Dist(pos1,pos2)
				if (dist<10){
					pl.pathing[0].spot.remove();
					pl.pathing.shift();
				} else {						
					//console.log('pl follow',pl.pathing);
					g.lookAt(pl,pl.pathing[0].pos);
					g.Follow(pl,pl.pathing[0].pos);
				};
			};
		};
	}		
});

function click(e){
	//console.log('click',e);
	if (e.target.className.match('spbut')){
		var li=e.target.parentNode,
			ul=li.parentNode;
		console.log(ul,'spclick');
	};
};
document.body.onclick=click;