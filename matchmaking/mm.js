//utility
//list
var Util={
	get:function(list,val){
		var ind=list.indexOf(val);
		return list[ind];
	},
	rem: function(list,val){
		var ind=list.indexOf(val);
		if (ind==-1){
			return false;
		} else {
			return list.splice(ind,1);
		}	
	},
	eachattr: function(list,key,val){
		var o;
		for (var n in list){
			o=list[n];
			o[key]=val;
		}
	},
	last: function Last(list){
		return list[list.length-1];
	},
	//obj
	count: function(obj){
		if (obj.length) return obj.length;
		var nr=0;	
		for (var key in obj){
			if (obj.hasOwnProperty(key)){
				nr++
			}
		}
		return nr;
	},
	len: function(obj){
		var nr=0;
		for (var key in obj){
			if (obj.hasOwnProperty(key)){
				nr++
			}
		}
		return nr;
	},
	extend: function(obj1,obj2){
		for (var key in obj2){
			obj1[key]=obj2[key];
		}	
	},
	//
	genid: function(prefix,objs,len){
		len=len || 13;
		var id=prefix+new Date().getTime().toString().substring(13-len,13),pl;
		while (objs[id]){
			id=prefix+new Date().getTime().toString().substring(13-len,13);
		}
		return id
	}
}
var pause=false;
function togglepause(){
	pause=!pause;
}
//games
var g={
	loopcount: 0,
	wincount: 24,
	maxgames: 10,
	maxpls: 100,
	pls:{},
	addpl:function(id){
		var pl,
			id=Util.genid('pl-',this.pls,6);
		pl={
			id: id,
			name: id,
			wins:[],
			wincount: 0,
			rating: Math.random()*100,
			party: {
				rating: 0,
				pls:[]
			},
			team: 0,
			game: 0,
			status:'idle',
			gamesplayed: 0,
			joinparty: function(tar){
				tar.party.pls.push(pl);
				tar.party.rating=0;
				for (var nr in tar.party.pls){
					pl=tar.party.pls[nr];
					tar.party.rating+=pl.rating;
					pl.party=tar.party;
				}
				tar.party.rating/=tar.party.pls.length;
			}
		}
		pl.joinparty(pl);
		
		for (var nr=0;nr<this.wincount;nr++){
			pl.wins.push(0);
		}		
		
		this.pls[id]=pl;
		return pl;		
	},
	rempl: function(id){
		delete this.pls[id];
		//handle in game reconnects
		
	},
	
	games:{},
	startgame: function(pls){
		console.log('start game:',pls,pls.length);
		var game,
			pl,
			id=Util.genid('g-',this.pls,6);
			
		for (var nr in pls){
			pl=pls[nr];
			pl.status='ingame';
			pl.game=id;
		}
		game={
			id: id,
			name: id,
			pls: pls,
			start: new Date().getTime(),
			gametime: 0//seconds
		}		
		this.games[id]=game;
		
		return game;
	},
	endgames: function (){
		for(var id in g.games){
			game=g.games[id];
			if (ct-game.start>game.gametime){
				g.endgame(id);
			}
		}		
	},
	endgame: function(id){
		var game=this.games[id];
		if (game){
			delete this.games[id];
			
			//fake resolve
			var red=game.pls.splice(0,game.pls.length/2),
				blu=game.pls,
				pls,
				redrat=0,
				blurat=0,
				pl,
				redwin=Math.random()<0.5;
			
			for(var nr in red){
				pl=red[nr];
				redrat+=pl.wincount;
			}
			for(var nr in blu){
				pl=blu[nr];
				blurat+=pl.wincount;
			}			
			//average wincount
			blurat=blurat/this.wincount || 1;
			redrat=redrat/this.wincount || 1;
			if (redwin){
				for(var nr in red){
					pl=red[nr];
					pl.wins.push(blurat);
				}
				for(var nr in blu){
					pl=blu[nr];
					pl.wins.push(-redrat/2);					
				}
			} else {
				for(var nr in red){
					pl=red[nr];
					pl.wins.push(-blurat/2);				
				}
				for(var nr in blu){
					pl=blu[nr];
					pl.wins.push(redrat);					
				}				
			}
			pls=red.concat(blu);
			for (var nr in pls){
				pl=pls[nr];				
				pl.wins.shift();
				pl.status='idle';
				pl.gamesplayed+=1;
				pl.rating=0;
				pl.wincount=0;
				for (var nr in pl.wins){
					if (pl.wins[nr]>0){
						pl.wincount+=1;						
					}
					pl.rating+=Math.abs(pl.wins[nr]);
				}				
			}
		}
	},
	handlegames: function(){
		var game,
			g=this,
			pls=0;
			ct=new Date().getTime();
		/*
		//match new games
		while (Util.len(g.games)<g.maxgames){
			pls=mm.match();
			if (pls.length){
				game=g.startgame(pls);
			} else {
				//no pls in que
				break;
			}
		}		
		/**/
		//end by gametime
		
	},
	report: function(){
		var rep=[],
			pl,
			count=0,
			show=$('.showpls').val();
		
		for (var id in this.pls){
			pl=this.pls[id];
			rep.push([pl.rating,pl.wincount,pl.name,pl.gamesplayed,pl.wins]);
		}		
		rep.sort(function(a,b){return a[0]-b[0]});
		rep.reverse();		
		str='<table><tbody>';
		//str+='<tr><td>position</td><td>rat</td><td>wins</td><td>name</td><td>games</td></tr>';
		
		for(var nr in rep){
			pl=rep[nr];
			str+='<tr><td>'+(parseInt(nr)+1)+'</td>'+
				 '<td>rat: '+Math.floor(pl[0])+'</td>'+
				 '<td> wins: '+pl[1]+'</td>'+
				 '<td> name: '+pl[2]+'</td>'+
				 '<td> games played: '+pl[3]+'</td>'+
				 '</tr>';
			count++;
			if (count>=show) break;
		}
		str+='</tbody></table>';
		$('.pls').html('PLS: '+Util.count(this.pls));
		$('.team').html('TEAM SIZE: '+mm.teamsize+'v'+mm.teamsize);
		$('.que').html('INQUE: '+mm.que.length);
		$('.game').html('GAMES: '+Util.count(this.games)+'(pls:'+Util.count(this.games)*mm.teamsize*2+')');
		$('.loop').html('LOOPS: '+this.loopcount);
		$('.plslist').html(str);		
	},
	queup: function(){	
		var pl;
		for(var id in this.pls){
			pl=this.pls[id];
			if (pl.status=='idle'){
				mm.join(pl);
			}
		}			
	},
	//loop
	run: function(){		
		if (!pause){
			this.maxpls=$('.maxpls').val();
			mm.teamsize=parseInt($('.teamsize').val());
			this.maxgames=$('.maxgames').val();
			
			var count=Util.count(this.pls),
				pl;
				
			//adjust maxpls
			if (count<this.maxpls){
				this.addpl();
			} else if (count>this.maxpls){
				for(var id in this.pls){
					pl=this.pls[id];
					if (pl.status=='idle'){
						this.rempl(id);
						break;
					}
				}
			}
	
			this.queup();
			this.handlegames();						
			this.report();
			this.loopcount++;
		}
				
		this.ml=setTimeout(function(){
			g.run()
		},10);
	}
}

//matchmaking
function Mm(conf){
	var m={
		teamsize: 1,
		que:[],
		ratinglist:[],
		inque: 0,
		pls:{},
		wait: 3,
		avgwait: 0,
		avgwaitgamecount: 10,
		lt: new Date().getTime(),
		//functions
		sortplsbydif: function(list,pl){
			var pl=pl;
			list.sort(function(pl1,pl2){
				var d1=Math.abs(pl.party.rating-pl1.party.rating),
					d2=Math.abs(pl.party.rating-pl2.party.rating);
				
				return d1-d2;
			})
			for(var nr in list){
				pl=list[nr];
				console.log(Math.abs(pl.party.rating-this.que[0].party.rating));
			}
		},
		average: function(list,attr){
			var val=0,
				obj,
				count=0;
			for (var nr in list){
				obj=list[nr];
				val+=obj[attr];
				count++;
			}
			return val/count;
		},
		join: function(pl){
			if(this.que.indexOf(pl)==-1){
				this.que.push(pl);
				this.ratinglist.push(pl);
				pl.status='inque';
				this.inque+=pl.party.pls.length;
			}
		},
		leave: function(pl){
			if (Util.rem(this.que,pl)){					
				Util.rem(this.ratinglist,pl);
				pl.status='idle';
				this.inque-=pl.party.pls.length;
				return pl;
			} else {
				return 0;
			}
		},
		match: function(){
			var ct=new Date().getTime(),
				pls=[],
				pl,
				id;			
			if (this.inque>=this.teamsize*2){// && (!this.wait || ct-this.lt>this.wait*1000)){
				this.lt=ct;		
				
				var maxdif=Number.MAX_VALUE,
					diflist=[],
					plcount=0,
					have=[[],[],[]],
					dif,
					tar;
					
				this.sortplsbydif(this.ratinglist,this.que[0]);				
				var match={
					red:{
						pls:[],
						wants: this.teamsize,
						rating: 0
					},
					blu:{
						pls:[],
						wants: this.teamsize,
						rating: 0
					}
				}				
				
				for (var nr in this.ratinglist){					
					pl=this.ratinglist[nr];
					
					count=pl.party.pls.length					
					if (match.red.wants<match.blu.wants && match.blu.wants>=count){						
						//add to blue
						match.blu.pls.push(pl)
						match.blu.wants-=count
						pl.team='blu'
						plcount+=count;
					} else if (count<=match.red.wants){
						match.red.pls.push(pl)
						match.red.wants-=count
						pl.team='red'
						plcount+=count;						 
					}
					this.leave(pl);						
					pls.push(pl);
					if(plcount==this.teamsize*2) break;
				}
				if (plcount==this.teamsize*2){
					//can match
					console.log('match');
					for (var nr in match.red.pls){
						pl=match.red.pls[nr];
						console.log('red:',pl.id,pl.party.pls.length,pl.party.rating);
					}
					for (var nr in match.blu.pls){
						pl=match.blu.pls[nr];
						console.log('blu:',pl.id,pl.party.pls.length,pl.party.rating);
					}
				} else {
					//no match
					console.log('match');
				}				
				console.log(match);
				
				/*	diflist
				for(var nr in this.que){
					//first que object
					if (nr==0){
						tar=this.que[nr];
						diflist.push([0,tar]);
						plcount+=tar.party.pls.length;
						have[tar.party.pls.length-1].push(tar);
					} else {					
						pl=this.que[nr];
						if (pl.id!=tar.id){
							//if not full player list add first possible
							if (plcount<(this.teamsize*2)){
								dif=Math.abs(tar.rating-pl.rating);
								//rememeber rating difference
								diflist.push([dif,pl]);
								plcount+=pl.party.pls.length;
								have[pl.party.pls.length-1].push(pl);
							} else {								
								diflist.sort(function(a,b){return a[0]-b[0]})								
								dif=Math.abs(tar.rating-pl.rating);
								//try to find smaller rating differences
								var last=Util.last(diflist)[0];
								if (dif<last){
									console.log('last:',last);
									plcount-=last.party.pls.length;
									Util.rem(have[last.party.pls.length-1],last);
									diflist.pop()
									diflist.push([dif,pl])
									plcount+=pl.party.pls.length;
									have[pl.party.pls.length-1].push(pl);
								}								
							};
						}
					}
				}
				/**/

				
				//solve overque

				/* diflist
				for (var nr in diflist){
					pl=diflist[nr][1];
					this.leave(pl);						
					pls.push(pl);
				}		
				/**/
				
			}
			/*
			for (var nr in pls){
				pl=pls[nr];
				console.log(pl.id,pl.party.length);
			}
			/**/
			return pls;
		}
	}
	Util.extend(m,conf);	
	return m;
}

//gen pls
var max=$('.maxpls').val(),
	plist=[],
	pl;
for (var nr=0;nr<max;nr++){	
	pl=g.addpl()
	plist.push(pl);
	
	if (nr%8==7){
		var pl1=plist[nr-1],
			pl2=plist[nr-2];
		
		pl1.joinparty(pl);
		pl2.joinparty(pl);
			
	} else if (nr%4==3){
		var pl1=plist[nr-1];
		pl1.joinparty(pl);
	}
	//console.log('added pl:',nr%10,nr%5,pl.id,pl.party.length);
}

var mm=Mm({
	teamsize: 1,
	wait: 0,
	pls: g.pls
});



a=[1,10,11,23,4,6,7,9,24,3,2];
c=10;
a.sort(function(a,b){
	var ad=Math.abs(c-a),
		bd=Math.abs(c-b);
	
	return ad-bd;
})
console.log(a)

g.run();