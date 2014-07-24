var dr={	
	init:function(){
		d.on('ready',function(e){
			dr={
				
			}
		})
		this.setcss()
		this.show()
		
	},
	setcss:function(){
		var css=d.dss.new('dungeonrun-styles')
		css.new('.sec',
			'border:1px solid #aaa',
			'background-color:#eee',
			'display:inline-block',
			'padding:10px'
		)
		this.css=css
		this.css.show()
	},
	show:function(){
		html=d.body.r('div class=dungeonrun')
		this.html=html
		
		//actions
		var sec=html.r('div class=actions sec'),
			list=[
				'move and attack',
				'attack and move',
				'attack and attack',
				'move and move'
			]
		sec.r('div html=actions')
		loop(list,function(k,v){
			sec.r('div')
				.h(v)
		})
						
		//skills
		var sec=html.r('div class=skills sec'),
			list={
				melee:'+4hp, parry: 1 less melee damage',
				ranged:'2 tile range, longshot: +1 tile to range',
				critical:'on hit +1 dam',
				snare:'on hit enemy loses 1 move',
				blind:'on hit enemy loses 1 attack',
				swift:'take one extra move action',
				skillful:'flip 2 of your skills',
				defencive:'+4 ac',
				precision:'+4 to hit',
				counter:'when attacked you get 1 attack action',
				heal:'you or an adjacent target regains 1hp (action)',
				berserk:'deal 2 damage to all adjacent enemies, you take 1 damge (action)',
				dodge:'take 1 less damage'
			}
		sec.r('div html=skills')
		loop(list,function(k,v){
			sec.r('div')
				.h([k,v].join(' : '))
		})
		//items
		var sec=html.r('div class=items sec'),
			list={
				'potion of healing':'you regain 2hp',
				'potion of swiftness':'+1 move action',
				'potion of fire':'deals 1 damage to all enemies in a tile, 1 tile range',
				'potion of web':'all enemies in a tile lose one move action,1 tile range',
				
			}
		sec.r('div html=items')
		loop(list,function(k,v){
			sec.r('div')
				.h([k,v].join(' : '))
		})
		//card editor
		var ce=d.body.r('div class=cardeditor'),
			card=ce.r('div class=card')
				.s('border-radius:15px background-color:#222 width:200px height:300px')
				.s('box-sizing:border-box padding:10px')
		card.r('div class=pad1')
			.s('border-radius:10px background-color:green width:100% height:100%')
			.s('box-sizing:border-box padding:5px')
			.r('div class=pad2')
				.s('border-radius:5px background-color:white width:100% height:100%')
				.s('box-sizing:border-box padding:5px position:relative')				
				.r('div class=header')
					.h('melee')
					.s('width:100% box-sizing:border-box')					
				.p.r('div class=img')
					.h('img')
					.s('box-sizing:border-box font-size:12px')
					.s('height:100px border:1px solid grey')
				.p.r('div class=desc')
					.h('parry: 1 less melee damage')
					.s('font-size:12px box-sizing:border-box')					
				.p.r('div class=passive')
					.h('passive: +4hp')
					.s('font-size:12px box-sizing:border-box')					
				.p.r('div class=fancy')
					.h('fancy text to match the skill')
					.s('width:100% box-sizing:border-box')
					.s('position:absolute bottom:0px font-size:12px')
	}
}
dr.init()