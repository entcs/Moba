var rulez={
	css:function(){
		var css=d.dss.new('rulez-styles')
		css.new('body,td,input,select,a',
			'font-family:Open Sans Condensed, sans-serif',
			'font-weight:bold',
			'text-transform:uppercase'
		)
		css.new('.cols',
			'display:table'
		)
		css.new('.cols>*',
			'display:table-cell'
		)
		css.new('.header,.header>*',
			'background-color:#ddd'
		)
		css.new('.hide',
			'display:none'
		)
		css.new('table',
			'border:1px solid #aaa',
			'display: inline-block'
		)
		css.show()
	},
	show:function(){
		var html=d.body.r('div class=rulez')
		function showstats(){
			var table=html.r('table class=stats'),
				thead=table.r('thead'),
				tbody=table.r('tbody'),
				tr,
				td
			thead.r('tr class=title')
				.r('td')
					.h('stats')
				.p.r('td')
				.p.r('td')
					.h('+/-')
					.s('cursor:pointer')
					.on('click',function(e){
						var tar=e.target.findup('table').find('tbody')
						if(tar.hasclass('hide')){
							tar.remclass('hide')
						} else {
							tar.addclass('hide')
						}
					})
				
			tbody.r('tr class=header')
				.r('td html=physical')
				.p.r('td html=used when')
			.p.p.r('tr')
				.r('td html=strength')
				.p.r('td html=feats of strength')
			.p.p.r('tr')
				.r('td html=agility')
				.p.r('td html=balance and precision')	
			.p.p.r('tr class=header')
				.r('td html=mental')
				.p.r('td html=used when')
			.p.p.r('tr')
				.r('td html=intelligence')
				.p.r('td html=solving puzzles')
			.p.p.r('tr')
				.r('td html=wits')
				.p.r('td html=quick thinking')
		}
		showstats()
		function showround(){
			var table=html.r('table class=actions'),
				thead=table.r('thead'),
				tbody=table.r('tbody'),
				tr,
				td
			thead.r('tr class=title header')
				.r('td')
					.h('actions')
				.p.r('td')
					.h('time')					
				.p.r('td')
				.p.r('td')
					.h('+/-')
					.s('cursor:pointer')
					.on('click',function(e){
						var tar=e.target.findup('table').find('tbody')
						if(tar.hasclass('hide')){
							tar.remclass('hide')
						} else {
							tar.addclass('hide')
						}
					})
				
			tbody.r('tr')
				.r('td html=full action')
				.p.r('td html=4s')
				.p.r('td')
			.p.p.r('tr')
				.r('td html=attack action')
				.p.r('td html=2s')
				.p.r('td html=attack or cast a spell')
			.p.p.r('tr')
				.r('td html=move action')
				.p.r('td html=2s')
				.p.r('td html=move 9m or 30f or 6 squares(5ft squares)')
			.p.p.r('tr')
				.r('td html=free action')
				.p.r('td html=free')
				.p.r('td html=once per round')
		}
		showround()
		function showdifficulty(){
			var table=html.r('table class=difficulty'),
				thead=table.r('thead'),
				tbody=table.r('tbody'),
				tr,
				td
			thead.r('tr class=title header')
				.r('td')
					.h('difficulty')
				.p.r('td')
				.p.r('td')
				.p.r('td')
					.h('+/-')
					.s('cursor:pointer')
					.on('click',function(e){
						var tar=e.target.findup('table').find('tbody')
						if(tar.hasclass('hide')){
							tar.remclass('hide')
						} else {
							tar.addclass('hide')
						}
					})
				
			tbody.r('tr')
				.r('td html=easy')
				.p.r('td html=1d20')
				.p.r('td html=11 or higher')
			.p.p.r('tr')
				.r('td html=medium')
				.p.r('td html=2d20')
				.p.r('td html=14 or higher')
			.p.p.r('tr')
				.r('td html=hard')
				.p.r('td html=3d20')
				.p.r('td html=16 or higher')
			.p.p.r('tr')
				.r('td html=very hard')
				.p.r('td html=4d20')
				.p.r('td html=17 or higher')
			.p.p.r('tr')
				.r('td html=impossible')
				.p.r('td html=5d20')
				.p.r('td html=18 or higher')
		}
		showdifficulty()
		function showskills(){
			var table=html.r('table class=skills'),
				thead=table.r('thead'),
				tbody=table.r('tbody'),
				tr,
				td
			thead.r('tr class=title header')
				.r('td')
					.h('skills')
				.p.r('td html=1')
				.p.r('td html=2')
				.p.r('td html=3')
				.p.r('td html=4')
				.p.r('td html=5')
				.p.r('td')
					.h('+/-')
					.s('cursor:pointer')
					.on('click',function(e){
						var tar=e.target.findup('table').find('tbody')
						if(tar.hasclass('hide')){
							tar.remclass('hide')
						} else {
							tar.addclass('hide')
						}
					})
				
			tbody.r('tr')
				.r('td html=speed')
				.p.r('td html=1m/s')
				.p.r('td html=10/ms')
				.p.r('td html=100/ms')
				.p.r('td html=1000/ms')
				.p.r('td html=10000/ms')
			.p.p.r('tr')
				.r('td html=weight')
				.p.r('td html=1kg')
				.p.r('td html=10kg')
				.p.r('td html=100kg')
				.p.r('td html=1000kg')
				.p.r('td html=10000kg')				
			.p.p.r('tr')
				.r('td html=range')
				.p.r('td html=10m')
				.p.r('td html=100m')
				.p.r('td html=1000m')
				.p.r('td html=10000m')
				.p.r('td html=100000m')				
			.p.p.r('tr')
				.r('td html=area')
				.p.r('td html=0.1m3')
				.p.r('td html=1m3')
				.p.r('td html=10m3')
				.p.r('td html=100m3')
				.p.r('td html=1000m3')				
			.p.p.r('tr')
				.r('td html=time')
				.p.r('td html=1s')
				.p.r('td html=1m')
				.p.r('td html=1h')
				.p.r('td html=1d')
				.p.r('td html=1month')
			.p.p.r('tr')
				.r('td html=telekinesis')
				.p.r('td html=up to 1m/s, 1kg')
				.p.r('td html=up to 10m/s, 10kg')
				.p.r('td html=up to 100m/s, 100kg')
				.p.r('td html=up to 1000m/s, 1000kg')
				.p.r('td html=up to 10000m/s, 10000kg')
			.p.p.r('tr')
				.r('td html=teleportation')
				.p.r('td html=up to 20m, +10kg')
				.p.r('td html=up to 200m, +100kg')
				.p.r('td html=up to 2000m, +1000kg')
				.p.r('td html=up to 20000m, +10000kg')
				.p.r('td html=up to 200000m, +100000kg')
			.p.p.r('tr')
				.r('td html=telepathy')
				.p.r('td html=up to 20m, sense/project emotions')
				.p.r('td html=up to 200m, read/project thoughts(one sentence)')
				.p.r('td html=up to 2000m, read/control mind')
				.p.r('td html=up to 20000m, affect memories')
				.p.r('td html=up to 200000m, clone, swap, reshape mind')
				
		}
		showskills()		
		function showitems(){
			var table=html.r('table class=items'),
				thead=table.r('thead'),
				tbody=table.r('tbody'),
				tr,
				td
			thead.r('tr class=title header')
				.r('td')
					.h('items')
				.p.r('td html=melee damage')
				.p.r('td html=ranged damage')
				.p.r('td html=armor protection')
				.p.r('td html=shiled block')
				.p.r('td html=size')
				.p.r('td')
					.h('+/-')
					.s('cursor:pointer')
					.on('click',function(e){
						var tar=e.target.findup('table').find('tbody')
						if(tar.hasclass('hide')){
							tar.remclass('hide')
						} else {
							tar.addclass('hide')
						}
					})
				
			tbody.r('tr')
				.r('td html=small')
				.p.r('td html=2')
				.p.r('td html=2')
				.p.r('td html=1')
				.p.r('td html=1')
				.p.r('td html=1.2m')
			.p.p.r('tr')
				.r('td html=medium')
				.p.r('td html=4')
				.p.r('td html=3')
				.p.r('td html=2')
				.p.r('td html=2')
				.p.r('td html=1.8m')
			.p.p.r('tr')
				.r('td html=large')
				.p.r('td html=6')
				.p.r('td html=4')
				.p.r('td html=3')
				.p.r('td html=3')
				.p.r('td html=2.7m')
			.p.p.r('tr')
				.r('td html=huge')
				.p.r('td html=8')
				.p.r('td html=6')
				.p.r('td html=4')
				.p.r('td')
				.p.r('td html=4m')
			.p.p.r('tr')
				.r('td html=colossal')
				.p.r('td html=10')
				.p.r('td html=8')
				.p.r('td html=5')
				.p.r('td')
				.p.r('td html=6m')
		}
		showitems()		
		
	}
}
d.on('ready',function(e){
	rulez.css()
	rulez.show()
})