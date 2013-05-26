﻿var socket = io.connect('http://localhost:8080');
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});
socket.on('echo', function (data) {
	document.getElementById('res').innerHTML=data;
});
function send(method){
	var but=document.getElementById('but'),
		inp=document.getElementById('inp');
	Net.get(inp.value,function(){
		console.log('req:', unescape(this.responseText));
	})
	/*	
	var req=new XMLHttpRequest();
	req.open("GET",inp.value,true);
	req.send();	
	req.onreadystatechange=function() {
		console.log('req:',req.readyState, req.status, req.responseText);
	}	
	/**/
}

function sendsock(){
	socket.emit('echo', document.getElementById('inp1').value);
}



var Net;
(function(){
	Net={
		get: function (url,callback,async){
			return Net.XMLHR('GET',url,async,callback);
		},
		post: function (url,callback,async){
			return Net.XMLHR('POST',url,async,callback);
		},
		XMLHR: function (method,url,async,callback){
			async=async || true;
			var req=new XMLHttpRequest();
			req.open(method,url,async);
			req.send();	
			req.onreadystatechange=callback;	
			return req;
		}	
	}
})();

var Timer;
(function(){
	var ct=new Date().getTime();
	Timer={
		timers: {},
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
			var id=Timer.genid(Timer.timers,'timer-'),
				timer={
					id: id,
					birth: Timer.ct,
					lasttime: Timer.ct,
					life: args.life || -1,
					count: args.count || -1,
					freq: args.freq || 0,					
					fn: args.fn,
					ondeath: args.ondeath,
					onbirth: args.onbirth
				};						
			Timer.timers[id]=timer;
			if (timer.onbirth) timer.onbirth();
			
			return timer;
		},
		rem: function(id){
			var timer=Timer.timers[id];
			if (timer.ondeath) timer.ondeath();
			delete Timer.timers[id];
		},
		loop:0,
		ct:ct,
		lasttime: ct,
		run: function(){
			Timer.loop=setTimeout(function(){
				Timer.ct=new Date().getTime();
				
				var timer,tickit;
				for(var key in Timer.timers){				
					tickit=1;
					timer=Timer.timers[key];
					//do conditions
					if (timer.freq!=-1){
						if(timer.lasttime+timer.freq*1000>Timer.ct){
							tickit=0;
						}
					}
					
					if (tickit){						
						if (timer.count!=-1) timer.count-=1;
						timer.lasttime+=timer.freq*1000;
						timer.fn();
					}
					
					//rem conditions
					if (timer.life!=-1 && timer.birth+timer.life*1000<Timer.ct){
						console.log('end by birth');
						Timer.rem(key);
					} else if (timer.count==0){
						console.log('end by count');
						Timer.rem(key);
					}
				}
				Timer.run();
			},0)
		}
	}
	Timer.run();
})();

var nt1=Timer.add({
	life: 2,
	//count: 0.4,
	freq: 0.5,
	fn: function(){
		console.log('tick',this.id,this.count,this.lasttime);
	},
	onbirth: function(){
		console.log('birth',this.id);
	},
	ondeath: function(){
		console.log('death',this.id);
	}
});

