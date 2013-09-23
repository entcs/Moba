var battle={};
(function(){
	console.log('loaded battle')

	battle.dss=dss.new('battledss')		
		.show()
	
	//social ui
	battle.r=function(){	
		if(battle.html) battle.html.rem()
		d.body.find('.battle')
			.s('text-align:middle')
			.r('div class=wrap')
				.r('div class=iblocks')
					.r('div class=but html=solo battle').p
					.r('div class=but html=merc battle').p
					.r('div class=but html=team up')
						.on('click',function(e){
							e.preventDefault()														
							soc.friends.r()
							modal.open(soc.friends.html,'modalforteamup')
								.html.find('.header')
									.h(this.innerHTML)
						}).p
					.r('div class=but html=clan battle').p.p
				.r('div class=stats')
					.s('display:inline-block')					
		d.trigger('battle ready')		
		return battle.html
	}
	battle.r()
	
})()