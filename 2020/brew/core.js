var c=document.getElementsByTagName('canvas')[0],
	context=c.getContext('2d');



var g=(function(){
	var game={
		dt:0,
		ct:0,
		mpos:{x:0,y:0},
		lt:new Date().getTime(),
		nodes:{},
		loops:{},
		active:{},
		act:0,
		over:0,
		lover:0,
		Over: function(){
			var over=this.doover(g.root);
			if (over && over!=g.over){
				document.body.style.cursor = over.cursor || 'default';				
				g.lover=g.over;	
			};			
			g.over=over;			
		},
		doover:function(node){
			var over=0;
			if(node.active){
				if (node.name=='root'){
					over=node;
				} else {
					over=this.isover(node);
				};
				if (over) {
					for (var name in node.children){
						child=node.children[name];											
						over=this.doover(child) || over;						
					};				
				};
			};
			return over;
		},
		isover: function(node){			
			var over=0;			
			if (node.subtype=='circ'){				
				var dx=g.mpos.x-node.fpos[0],
					dy=g.mpos.y-node.fpos[1],
					dist=Math.sqrt(dx*dx+dy*dy);
				if (dist<node.rad+node.lineWidth){
					over=node;					
				};
			} else 
			if (g.mpos.x>node.fpos[0]-node.bounds[0] && 
				g.mpos.x<node.fpos[0]+node.bounds[0] &&
				g.mpos.y>node.fpos[1]-node.bounds[1] && 
				g.mpos.y<node.fpos[1]+node.bounds[1] ){
				over=node;
			};			
			return over;
		},
		Draw:function(node){		
			node.calc();
			if (node.visible){
				if (node.draw){
					node.draw();
				};			
				for (var nr in node.children){
					child=node.children[nr];
					this.Draw(child);
				};
			};			
		},		
		Render:function(){	
			// clear			
			context.clearRect(0,0,context.canvas.width,context.canvas.height);				
			
			//timing
			g.ct=new Date().getTime();
			g.dt=g.ct-g.lt;	
			g.dt=g.dt/1000;
			
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
					console.log();
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
			
			//over
			this.Over(g.root);						

			//draw
			this.Draw(g.root);
														
			context.font = '20px Tahoma';
			context.textAlign = 'left';
			context.fillStyle = '#666';
			context.fillText('x:'+g.mpos.x+' y:'+g.mpos.y, 10, 20);

			context.fillText('exit: '+g.lover.name+ ' enter:'+g.over.name, 10, 40);				
			
						
			//set last frame time
			g.lt=g.ct;
		},	
		Mpos:function(canvas,e){
			var rect = canvas.getBoundingClientRect();
			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};		
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
			g.loops[conf.name]=loop;
			return loop;
		},
		Node:function(conf){
			var g=this;
			var node={
				name:conf.name,
				type:'node',
				subtype:'',
				parent:conf.parent || 0,
				children:{},
				x:0,
				y:0,
				z:0,
				active:1,
				fpos:[0,0,0],
				bounds:[0,0,0],//width,height,depth
				h:0,
				p:0,
				r:0,
				fhpr:[0,0,0],
				sx:1,
				sy:1,
				sz:1,
				fscale:[1,1,1],
				visible: 1,
				/* functions */
				calc:function(){
					if (this.parent){
						this.fpos=[
							this.parent.fpos[0]+this.x,
							this.parent.fpos[1]+this.y,
							this.parent.fpos[2]+this.z
							];
					} else {
						this.fpos=[
							this.x,
							this.y,
							this.z
						];
					};
				},
				draw: 0,
				extend: function(obj){
					for (var key in obj){
						var val=obj[key];
						this[key]=val;
					};
				},
				getPos: function(space){
					if (!space){
						return [this.x,this.y,this.z];
					} else {
						
					};
				},
				setPos: function(x,y,z,space){					
					if (!x) pos=[0,0,0];
					if (typeof(x)=='number'){
						if (typeof(z)=='number'){
							pos=[x,y,z];
						} else if(z) {
							space=z;
							pos=[x,y];
						} else {
							pos=[x,y];
						};
					} else if(typeof(x)=='object'){
						pos=x;
						if (y){
							space=y;
						};
					};
					
					if (!space){						
						this.x=pos[0];
						this.y=pos[1];
						this.z=pos[2] || this.z;
					} else {
						if (typeof(space)=='string'){
							space=g.nodes[space];
						};	
						
						this.x=pos[0]+space.fpos[0]-this.parent.fpos[0];
						this.y=pos[1]+space.fpos[1]-this.parent.fpos[1];
						this.z=pos[2]+space.fpos[2]-this.parent.fpos[2] || this.z+space.z-this.parent.fpos[2];
					};
				},
				addNode:function(conf){
					var node=0;
					if (typeof(conf)=='string'){
						node=g.nodes[conf];
					} else if (conf.type=='node'){
						node=conf;
					} else {
						node=g.Node(conf);
					};
					if (node){
						delete g.nodes[node.name];
						g.nodes[node.name]=node;					
						delete this.children[node.name];
						this.children[node.name]=node;
						node.parent=this;
					};
				},
				remNode:function(node){
					if (typeof(node)=='string'){
						node=this.children[node];
					};
					node.parent=0;
					delete this.children[node.name];					
					delete g.nodes[node.name];					
					return node;
				},
				getDist:function(x,y,z){
					var pos,tar;
					if (typeof(x)=='string'){
						tar=g.nodes[x];
						pos=tar.fpos;
					} else if (typeof(x)=='number'){
						pos=[x,y,z];
					} else if (x.type=='node'){
						pos=x.fpos;
					} else {
						pos=x;
					};
					var dx=this.fpos[0]-pos[0],
						dy=this.fpos[1]-pos[1],
						dist=Math.sqrt(dx*dx+dy*dy);					
					return dist;
				}
			};		
			if (node.parent){
				node.parent.addNode(node);
			};
			g.nodes[conf.name]=node;
			return node;
		},
		Circ:function (conf){
			var circ=g.Node(conf);
			circ.subtype='circ';

			//default
			var def={
				fill: 'transparent',
				lineWidth:0,
				stroke: 'transparent'
			};
			
			circ.extend(def);
			circ.extend(conf);						
			circ.bounds=[circ.rad+circ.lineWidth,circ.rad+circ.lineWidth,0];
			
			circ.draw=function(){
				context.beginPath();
				var start=0,
					end=2*Math.PI;
				if (circ.type=='cool' && circ.cool){
					end=1-(g.ct-circ.cool)/1000;
				};
				context.arc(this.fpos[0],this.fpos[1],this.rad,0,2*Math.PI, false);				
				context.fillStyle = this.fill;
				context.fill();
				context.lineWidth = this.lineWidth;
				context.strokeStyle = this.stroke;
				context.stroke();
				
				context.font = '12px Tahoma';
				context.fillStyle = circ.fill;
				context.textAlign = 'center';
				var hp=circ.hp || '';				
				context.fillText(hp, circ.fpos[0],circ.fpos[1]-12);
			};
			return circ;
		},
		Normalize:function(vec){
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
		}
	};
	/* root node */
	game.root=game.Node({name:'root'});
	
	/* frame request */	
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       || 
			  window.webkitRequestAnimationFrame || 
			  window.mozRequestAnimationFrame    || 
			  window.oRequestAnimationFrame      || 
			  window.msRequestAnimationFrame     || 
			  function( callback ){
				window.setTimeout(callback, 1000 / 60);
			  };
	})();	
	return game;
})();
/* render loop */
(function animloop(){
	  requestAnimFrame(animloop);
	  g.Render();
})();	


/**/
/*
g.Loop({
	name:'loop count',
	count: 3,	
	fn:function(){
		console.log(this.name,this.count);
	},
	callback:function(){
		console.log(this.name,'looped 3 times')
	}
});
/**/
/*
g.Loop({
	name:'loop count interval',
	count: 30,	
	interval: 40,
	fn:function(){
		//console.log(this.name,this.count);
		//console.log(g.nodes['c1'].conf);
		g.nodes['c1'].conf.x=10+this.count*10;
		//g.nodes['c1'].draw();
	},
	callback:function(){
		//console.log(this.name,'looped with interval 3 times')
	}
});
/**/
/*
g.Loop({
	name:'loop life',
	life: 2,
	fn:function(){
		console.log(this.name,(this.life*1000)+this.birth-g.ct);
	},
	callback:function(){
		console.log(this.name,'loop life ended')
	}
});
g.Loop({
	name:'loop life interval',
	life: 2,
	interval: 400,
	fn:function(){
		console.log(this.name,(this.life*1000)+this.birth-g.ct);
	},
	callback:function(){
		console.log(this.name,'loop life ended')
	}
});
/**/
