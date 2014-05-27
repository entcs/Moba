//example pls
var pls={},
	name
loop(48,function(i){
	name='pl-'+(i+1)
	pls[name]={
		name:name,
		rat:0,
		games:[],
		que:false
	}
})

//matchmaking
var mm={
	pls:{},	
	add:function(pl){
		this.pls.push(pl)
	},
	rem:function(pl){
		var ind=this.pls.indexOf(pl)
		this.pls.splice(ind,1)
	},
	match:function(nr){
		
	}
}
//in game
var ingame={}
//draw
var draw={
	init:function(){
		var wrap=d.body.r('div class=wrap cols'),
			pls=wrap.r('div class=pls'),
			que=wrap.r('div class=que'),
			match=wrap.r('div class=ingame')
	},
	pls:function(){
		var ele=d.find('.pls')
		ele.h('')
		var but=ele.r('button html=que'),
			table=ele.r('table'),
			thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr,td,
			fields=['name','rat','que']
		tr=thead.r('tr')
		loop(fields,function(i,name){			
			td=tr.r('td class=bo ba')					
			td.h(name)
		})
		
		loop(pls,function(name,pl){
			tr=tbody.r('tr')
			tr.addclass(pl.name)
			loop(fields,function(i,name){			
				td=tr.r('td class=bo')					
				td.h(pl[name])
			})			
		})
	},
	que:function(){
		var ele=d.find('.que')
		ele.h('')
		var but=ele.r('button html=match'),
			table=ele.r('table'),
			thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr,td		
			fields=['name','rat','que']
		tr=thead.r('tr')
		loop(fields,function(i,name){			
			td=tr.r('td class=bo ba')					
			td.h(name)
		})
		
		loop(mm.pls,function(name,pl){
			tr=tbody.r('tr')
			tr.addclass(pl.name)
			loop(fields,function(i,name){			
				td=tr.r('td class=bo')					
				td.h(pl[name])
			})			
		})
	},
	ingame:function(){
		var ele=d.find('.ingame')			
		ele.h('')
		
		var but=ele.r('button html=play'),
			table=ele.r('table'),
			thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr,td		
			fields=['name','rat','que']
		tr=thead.r('tr')
		loop(fields,function(i,name){			
			td=tr.r('td class=bo ba')					
			td.h(name)
		})
		
		loop(ingame,function(name,pl){
			tr=tbody.r('tr')
			tr.addclass(pl.name)
			loop(fields,function(i,name){			
				td=tr.r('td class=bo')					
				td.h(pl[name])
			})			
		})
	},	
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
	//Util.extend(m,conf);	
	return m;
}

d.on('ready',function(e){
	var sh=d.dss.new('mm_styles')
	sh.new('body',
		'margin:0px'
	)
	sh.new('body,table,input,button,select',		
		'font-family:Open Sans Condensed',
		'font-weight:bold',
		'color:#333'
	)
	sh.new('.bo',		
		'border:1px solid #aaa'
	)
	sh.new('.ba',		
		'background-color:#eee'
	)
	sh.new('.cols',		
		'display:table'
	)
	sh.new('.cols>*',		
		'display:table-cell'
	)
	
	sh.show()
	draw.init()
	draw.pls()
	draw.que()
	draw.ingame()
})