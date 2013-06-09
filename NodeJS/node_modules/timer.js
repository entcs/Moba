var timer;
(function(){
	var ct=new Date().getTime();
	timer={
		tims: {},
		genid: function(obj,pre,after){
			pre=pre || '';
			after=after || '';
			var id=pre+(new Date().getTime()+after);
			while(id in obj){
				id=pre+((new Date().getTime()+1)+after);
			}
			return id;
		},
		add: function(args){
			args=args || {};			
			var id=timer.genid(timer.tims,'tim-'),
				tim={
					id: id,
					birth: timer.ct,
					lasttime: timer.ct,
					life: args.life || -1,
					count: args.count || -1,
					freq: args.freq || 0,					
					fn: args.fn,
					ondeath: args.ondeath,
					onbirth: args.onbirth
				};						
			timer.tims[id]=tim;
			if (tim.onbirth) tim.onbirth();
			
			return tim;
		},
		rem: function(id){
			var tim=timer.tims[id];
			if (tim.ondeath) tim.ondeath();
			delete timer.tims[id];
		},
		loop:0,
		ct:ct,
		lasttime: ct,
		run: function(){
			timer.loop=setTimeout(function(){
				timer.ct=new Date().getTime();
				
				var tim,tickit;
				for(var key in timer.tims){				
					tickit=1;
					tim=timer.tims[key];
					//do conditions
					if (tim.freq!=-1){
						if(tim.lasttime+tim.freq*1000>timer.ct){
							tickit=0;
						}
					}
					
					if (tickit){						
						if (tim.count!=-1) tim.count-=1;
						tim.lasttime+=tim.freq*1000;
						tim.fn();
					}
					
					//rem conditions
					if (tim.life!=-1 && tim.birth+tim.life*1000<timer.ct){
						console.log('end by birth');
						timer.rem(key);
					} else if (tim.count==0){
						console.log('end by count');
						timer.rem(key);
					}
				}
				timer.run();
			},0)
		}
	}
	timer.run();
})();
if (typeof exports !== 'undefined') {
	for(var key in timer){
		exports[key]=timer[key];
	}
}
console.log('Loaded timer');
/*
timer.add({
	life: 3, //3seconds
	fn: function(){//do something}
})
timer.add({
	count: 3, //3 times
	fn: function(){//do something}
})
timer.add({
	freq: 3, //3seconds
	fn: function(){//do something}
})
*/
