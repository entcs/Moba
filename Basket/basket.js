var	sh1=d.dss.new('sh1')
	
sh1.new('body',
	'margin:0px',
	'width:100%',
	'height:100%',
	'text-align:center',
	'background:#000',
	'color:#666'
	//'text-transform:uppercase'
)
sh1.new('.but',
	'min-width:48px',
	'height:48px',
	'text-align:center',
	'font-size:36px',
	'box-sizing:border-box',
	'border:1px solid aaa',
	'border-radius:15px',
	'background:#eee',
	'cursor:pointer',
	'font-family: fantasy'
)
sh1.new('.but.selected',
	'border:1px solid green',
	'background:lightgreen'
)

sh1.new('.line',	
	'text-align:center',
	'box-sizing:border-box',
	'border:1px solid aaa'
)
sh1.new('.col1',
	'background:#eee'
)
sh1.new('.cols',
	'display:table',
	'width:100%',
	'table-layout:fixed'
)
sh1.new('.cols>*',
	'display:table-cell'
)

sh1.new('.dot',
	'width:16px',
	'height:16px',
	'box-sizing:border-box',
	'border-radius:15px',
	'display:inline-block',
	'border:2px solid aaa'	
)

sh1.show()

var basket={
	actions:{
		'-':'miss',
		'1':'point',
		'2':'points',
		'3':'points',
		'F':'fault',
		'TF':'technical fault',
		'R':'rebound',
		'S':'steal',
		'B':'block',
		'A':'assist',
		'T':'timeout'
	},
	teams:[],
	addteam:function(name){
		var team={
			name:name,
			pls:[],
			fouls:0,
			timeouts:0,
			addpl:function(data){
				if(data.nr!=undefined && data.name){
					var pl={
						score:0,
						fouls:0,
						actions:[]
					}
					pl.extend=data
					team.pls.push(pl)
					return pl
				}
			},
			rempl:function(index){
				return team.pls.splice(index,1)[0]				
			}
		}		
		this.teams.push(team)
		this.updteam(this.teams.length-1)
		return team
	},
	remteam:function(index){
		return this.teams.splice(index,1)[0]
	},
	quarter:0,
	quarterlength:0,
	time:0,
	gameactions:[[],[],[],[]],
	addaction:function(teamindex,plindex,action){
		var line={
			team:teamindex,
			pl:plindex,
			action:action
		}
		this.gameactions[this.quarter].push(line)
	},
	remaction:function(index){},
	editaction:function(index){},
	draw:function(){
		var wrap=d.body.r('div class=basket')
			.s('display:table width:320px height:480px background:#fff margin:0px auto')
			
		var topw=wrap.r('tr')
			.s('width:inherit')
			.r('td class=top')
				.s('width:inherit height: 1px')
				
		var teams=topw.r('div class=teams cols')
		loop(2,function(i){
			teams.r('span class=team')
				.r('div class=name but html=add team')
					.on('click',function(e){
						//var index=
					}).p
				.r('div class=score line html=0').p
				.r('div class=faults cols').o
				
			loop(4,function(i){
				o.r('span class=dot')
			})			
		})
		
		var pls=topw.r('div class=pls')
			.s('width:inherit')			
				.r('div class=plname line html=player name').p
				.r('div class=plslist')
					.s('overflow:auto white-space:nowrap width:inherit')
			
			
		var acts=topw.r('div class=actions')
			.s('width:inherit')
			.r('div')
				.s('overflow:auto white-space:nowrap width:inherit')
		var actions={
			'-':'miss',
			'1':'point',
			'2':'points',
			'3':'points',
			'F':'fault',
			'TF':'technical fault',
			'R':'rebound',
			'S':'steal',
			'B':'block',
			'A':'assist',
			'T':'timeout'
		}
		//['-',1,2,3,'F','TF','R','S','B','A','T']

		loop(actions,function(k,v){
			acts.r('div class=but')		
				.s('display:inline-block')
				.set('title',v)
				.h(k)
				
		})
				
				
		var mid=wrap.r('tr')
			.s('width:inherit font-family: Verdana')
			.r('td class=mid')
				.s('width:inherit overflow:auto')
				
		var bot=wrap.r('tr')
			.s('width:inherit')
			.r('td class=bot')
				.s('width:inherit height: 1px')
			


		var lines=mid.r('div class=game')	
			.r('div class=lines')
				.s('display:table width:100%')
				.r('tr class=headers')
					.r('td html=nr').p
					.r('td html=name').p
					.r('td html=action').p
					.r('td html=time').p
					.p
		/*
		loop(5,function(i){
			lines.r('div class=line')
				.r('span html=nr action')
		})
		/**/
		var running=false
		bot.r('div class=but time')
			.s('font-family: Monospace font-weight:bold font-size:42px')	
			.on('click',function(e){
				running=!running
				if(running) last=new Date().getTime()
			})
			
		//lines height
		/*
		var val=wrap.style.height.int()-window.getComputedStyle(topw).height.int()-window.getComputedStyle(bot).height.int()
		lines.p.style.height=val+'px'
		/**/
		
		
	},
	updteam:function(index){
		var but=d.findall('.basket .teams .team .but')[index],
			team=this.teams[index]
		but.h(team.name)
		this.updpls(index)
	},
	updpls:function(index){
		var pls=this.teams[index].pls,
			html=d.find('.plslist')
			html.h('')
		loop(pls,function(i,pl){
			html.r('div class=but')		
				.s('display:inline-block')
				.h(pl.nr)
				.set('title',pl.name)
		})
	
	},
	html:''
}
basket.draw()

var team1=basket.addteam('team1')
loop(12,function(i){
	team1.addpl({
		nr:i+1,
		name:'player name'+i
	})
})
var team2=basket.addteam('team2')
loop(12,function(i){
	team2.addpl({
		nr:i+1,
		name:'player2 name'+i
	})
})
basket.updpls(0)
//
basket.addaction(0,4,'1')
basket.addaction(0,4,'2')
basket.addaction(0,4,'3')
console.log(basket.gameactions)


