//example pls
var testpls={},
	name
loop(24,function(i){
	name='pl-'+(i+1)
	testpls[name]={
		name:name,
		rat:d.rng(100),
		games:[],
		status:'idle'
	}
})

function queup(){
	var chance=50,
		roll	
	loop(testpls,function(i,pl){
		if(pl.status=='idle'){
			roll=d.rng(100)			
			if(roll<=chance){
				pl.status='que'
				//solo 1
				mm.add(pl.name,pl.rat,1)
			}
		}
	})
	draw.upd()
}
function match(){
	var pls=mm.match(4)
	ingame=pls
	//fake play
	var half=pls.length/2,
		tpl
	
	loop(pls,function(i,pl){		
		tpl=testpls[pl.name]
		tpl.status='idle'
		if(i<half){
			tpl.rat+=1
		} else {
			if(tpl.rat){
				tpl.rat-=1
			}
		}				
	})
	draw.upd()
}

//matchmaking
var mm={
	pls:[],	
	add:function(name,rat,size){
		var pl={
			name:name,
			rat:rat,
			size:size,
			dif:0
		}
		this.pls.push(pl)
	},
	rem:function(pl){
		var ind=this.pls.indexOf(pl)
		this.pls.splice(ind,1)
	},
	match:function(nr){
		//console.log('match')
		var pls=[]
		if(this.pls.length>=nr){			
			var	pl=this.pls[0],
				big=0,
				dif,
				ind
			pl.dif=0
			pls.push(pl)
			loop(this.pls,function(i,p){
				if(p!=pl){
					if(pls.length<nr){
						p.dif=Math.abs(pl.rat-p.rat)						
						pls.push(p)						
						if(!big){							
							big=p							
							//console.log('first big:',big.dif)
						} else {
							if(p.dif>big.dif){
								big=p
								//console.log('new big:',big.dif)								
							}
						}						
					} else {
						//console.log('have all:',pl.rat,big.dif)
						p.dif=Math.abs(pl.rat-p.rat)
						//console.log(p.dif)
						//console.log('s rats:',pls[0].rat,pls[1].rat,pls[2].rat,pls[3].rat)
						if(p.dif<big.dif){							
							ind=pls.indexOf(big)
							//console.log('better dif:',p.dif,'index:',ind)
							pls.splice(ind,1)
							pls.push(p)
							big=p
							//console.log('b rats:',pls[0].rat,pls[1].rat,pls[2].rat,pls[3].rat)
							//console.log('added better big:',p.dif)
							//find big
							loop(pls,function(i,pp){
								if(pp==pl){									
									big=pl
								} else {
									if(pp.dif>big.dif){
										big=pp
										//console.log('new big:',pp.dif)
									}
								}
							})
						}
					}
				}
			})
		}
		//rem pls from que
		var ind
		loop(pls,function(i,pl){
			ind=mm.pls.indexOf(pl)
			mm.pls.splice(ind,1)
		})
		//console.log('match:',pls)
		return pls
	}
}
//in game
var ingame=[]
//draw
var play=false
var draw={
	init:function(){
		var but=d.body.r('button html=play')
		but.on('click',function(e){
			play=!play
			e.target.innerHTML='play:'+play
		})
	
		var wrap=d.body.r('div class=wrap cols'),
			pls=wrap.r('div id=pls'),
			que=wrap.r('div id=que'),
			game=wrap.r('div id=ingame')
			
		var but=pls.r('button html=que')
		but.on('click',queup)
		
		but=que.r('button html=match')
		but.on('click',match)
		
		but=game.r('button html=last game')
		
	},
	upd:function(){
		this.pls()
		this.que()
		this.ingame()
	},
	pls:function(){
		var ele=d.find('#pls'),
			table=ele.find('table')	
		if(table){
			table.rem()
		}
		table=ele.r('table')
		var thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr,td,
			fields=['name','rat','status']
		
		tr=thead.r('tr')
		loop(fields,function(i,name){			
			td=tr.r('td class=bo ba')					
			td.h(name)
		})
		
		loop(testpls,function(name,pl){
			tr=tbody.r('tr')
			tr.addclass(pl.name)
			loop(fields,function(i,name){			
				td=tr.r('td class=bo')
				td.h(pl[name])
				if(name=='status'){
					td.addclass(pl.status)
				}
			})			
		})
	},
	que:function(){
		var ele=d.find('#que'),
			table=ele.find('table')			
		if(table)table.rem()
		table=ele.r('table')
		var thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr,td		
			fields=['name','rat','size']
		
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
		var ele=d.find('#ingame')			
			table=ele.find('table')
		if(table) table.rem()
		table=ele.r('table')
		var thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr,td		
			fields=['name','rat','dif']
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
		/**/
	},	
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
	sh.new('.idle',		
		'background-color:white'
	)
	sh.new('.que',		
		'background-color:yellowgreen'
	)
	sh.new('.ingame',		
		'background-color:green'
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
	
	//initial clicks
	//var but=d.find('#pls button').trigger('click')
	
	//autotest
	function run(){
		if(play){
			d.find('#pls button').trigger('click')
			d.find('#que button').trigger('click')
		}
		setTimeout(function(){
			run()
		},1)
	}
	run()
	
})