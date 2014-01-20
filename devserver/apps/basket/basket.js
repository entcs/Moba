var	sh1=d.dss.new('sh1')
function addstyles(){
	sh1.new('body',
		'margin:0px',
		'width:100%',
		'height:100%',
		'text-align:center',
		'background:#000',
		'color:#666',
		'font-family: Verdana'
		//'text-transform:uppercase'
	)
	sh1.new('.but',
		'min-width:48px',
		'margin:0px',
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
	
	sh1.new('.time',
		'background:pink',
		'font-family: Monospace',
		'font-weight:bold',
		'font-size:42px'
	)
	sh1.new('.time.running',
		'background:lightgreen'
	)
	sh1.new('.line td',
		'border-bottom:1px solid #eee'
	)
	sh1.new('.last',
		'background:lightgreen'
	)
	sh1.show()
}
addstyles()

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

var wrap=d.body.r('div class=basket')
	.s('display:table width:320px height:480px background:#fff margin:0px auto')
	
var topw=wrap.r('tr')
	.s('width:inherit')
	.r('td class=top')
		.s('width:inherit height: 1px')
		
var teams=topw.r('div class=teams cols')
loop(2,function(i){
	teams.r('span class=team')
		.r('div class=name but')
			.h('team'+(i+1))
			.on('click',function(e){
				var sel=this.findup('.teams').find('.selected')
				if(sel) {
					sel.remclass('selected')
				}
				this.addclass('selected')
			}).p
		.r('div class=score line html=0').p
		.r('div class=faults cols')
			.loop(4,function(o,i){
				o.r('span class=dot')
			})			
})

var pls=topw.r('div class=pls')
	.s('width:inherit')			
		.r('div class=plname line html=player name').p
		.r('div class=plslist')
			.s('overflow:auto white-space:nowrap width:inherit')
loop(12,function(i){
	pls.r('div class=but title=player name'+i)
		.h(i+1)
		.s('display:inline-block')
		.on('click',function(e){
			var sel=this.p.find('.selected')
			if(sel) {
				sel.remclass('selected')
			}
			this.addclass('selected')
			d.find('.plname').h([this.h(),this.title].join(' : '))
		})		
})
	
	
var acts=topw.r('div class=actions')
	.s('width:inherit')
	.r('div class=wrap')
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

loop(actions,function(k,v){
	acts.r('div class=but')		
		.s('display:inline-block')
		.set('title',v)
		.h(k)
		.on('click',function(e){
			var sel=this.p.find('.selected')
			if(sel) {
				sel.remclass('selected')
			}
			this.addclass('selected')
			var team=teams.find('.selected'),
				pl=pls.find('.selected'),
				act=this
			if(team && pl && act){
				line=[
					team.h(),
					pl.h(),
					act.h()
				].join(' ')
				
				var row=lines.find('.last')
					if(row) row.remclass('last')
					
				row=lines.r('tr class=line last')
				row.r('td').h(team.h())
				row.r('td').h(pl.h())
				//row.r('td').h('name')
				row.r('td').h(act.h())
				row.r('td').h('time')			
				mid.find('.scroll').scrollTop=100000
			}
			
		})			
})
		
		
var mid=wrap.r('tr')
	.s('width:inherit font-family: Verdana')
	.r('td class=mid')
		.s('width:inherit overflow:auto')

var lines=mid.r('div class=scroll')
	.s('overflow:auto height:100%')
	.r('div class=game')	
		.r('div class=lines')
			.s('display:table width:100%')
			.r('tr class=headers')
				.r('td html=team').p
				.r('td html=nr').p
				//.r('td html=name').p
				.r('td html=action').p
				.r('td html=time').p
				.p		
		
var bot=wrap.r('tr')
	.s('width:inherit')
	.r('td class=bot')
		.s('width:inherit height: 1px')
	
bot.r('div class=cols')
	.r('div class=but time1 gametime html=12:00')
		.s('font-family: Monospace font-weight:bold font-size:42px').p
	.r('div class=quarter but html=Q1')
		.s('width:96px')
	
bot.r('div class=cols')
	.r('div class=but time offencetime html=24')				
		.on('click',function(e){
			if(this.hasclass('running')){
				basket.stop()
			} else {
				basket.start()
			}
		}).p
	.r('div class=reset but html=24')
		.s('width:96px')
		.on('click',function(e){
			basket.otime=basket.defaults.otime
			if(!basket.running){
				basket.start()
			}
			//basket.otimebut.trigger('click')
		})

var basket={
	running:false,
	defaults:{
		otime:24*1000,
		gtime:12*60000
	},
	ct:new Date().getTime(),
	lt:0,
	ct:0,
	otime:0,
	gtime:0,
	otimebut:bot.find('.offencetime'),
	gtimebut:bot.find('.gametime'),
	start:function(){
		basket.otimebut.addclass('running')
		//basket.gtimebut.addclass('running')
		basket.running=true		
		if(!basket.otime){
			basket.otime=basket.defaults.otime
		}
		
	},
	stop:function(){
		basket.otimebut.remclass('running')
		//basket.gtimebut.remclass('running')
		basket.running=false		
	},
	run:function(){
		basket.ct=new Date().getTime()
		dif=basket.ct-basket.lt
		basket.lt=basket.ct
		setTimeout(function(){
			if(basket.running){
				basket.otime-=10//dif
				basket.gtime-=10//dif
				if(basket.gtime<=0){
					basket.gtime=0
				} else if(basket.otime<=0){
					basket.otime=0
					//basket.otimebut.trigger('click')
					console.log('stop')
					basket.stop()					
				}
				basket.otimebut.h((basket.otime/1000).toFixed(1).replace('.',':'))
				var ftime=[parseInt(basket.gtime/60000),((basket.gtime/1000)%60).toFixed(1)].join(':')
				basket.gtimebut.h(ftime.replace('.',':'))
			}			
			basket.run()			
		},10)
	}
}
basket.gtime=basket.defaults.gtime
basket.run()
//d.body.style.zoom='65%'

//LAYOUTS
var layouts=d.body.r('div class=layouts cols'),
	names=['1 team','1 player','time','all actions','all players']
layouts
	.s('position:absolute bottom:0px')
loop(names,function(i,e){
	layouts.r('div class=but')
		.h(e)
		.on('click',function(e){
			switch(this.h()){
				case '1 team':
					d.findall('.team')[1].isvis('toggle')
					break
				case '1 player':
					d.find('.teams').isvis('toggle')
					d.find('.pls').isvis('toggle')
					break
				case 'time':
					d.find('.bot').p.isvis('toggle')
					break
				case 'all actions':
					d.find('.actions .wrap').toggle('white-space','nowrap')
					d.find('.actions .wrap').toggle('padding-top','10px')
					break
				case 'all players':
					d.find('.plslist').toggle('white-space','nowrap')
					break
					
			}
		})
})

/**/