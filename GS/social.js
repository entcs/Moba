var soc={};
(function(){
	console.log('loaded social')

	soc.dss=dss.new('socialdss')
		.new('.but64',
			'width:64px',
			'height:64px'
		)		
		.new('.but32',
			'width:32px',
			'height:32px'
		)		
		.new('.chat',			
			'background:#ddd'
		)
		.new('div',
			'box-sizing:border-box'
		)
		.new('.field',
			'border:1px solid #aaa',
			'background:#eee'
		)
		.new('.pinned .pin',
			'background:red'
		)
		.show()
	
	//social ui
	soc.r=function(){	
		if(soc.html) soc.html.rem()
		d.body.find('.social')	
			//.addclass('pinned')
			.fn(function(o){soc.html=o})
			.s('border:2px solid #aaa transition: all 0.5s overflow:hidden')
			.s('height:30px')
			//.s('height:260px')
			.on('mouseover',function(e){
				this.s('height:260px')
			})
			.on('mouseout',function(e){
				if(!this.hasclass('pinned')) this.s('height:30px')
			})
			.r('div class=socmenu cols')
				.s('height:256px')
				.fn(function(o){
					var names=['friends','chat','guild'],
						wid=['1px','auto','1px']
					loop(names,function(i,name){
						o.r('div class=cont '+name)
							.s('display:table-cell width:'+wid[i])							
					})
				})
		
		soc.friends={
			r:function(to){
				d.r('div class=friends')
					.fn(function(o){						
						soc.friends.html=o
						if(to) o.to(to)
					})
					.s('height:256px')
					.r('table')
						.s('height:100%')
						.r('tr')
							.s('height:1px')						
							.r('td')
								.r('div')
									.r('td')
										.r('div class=but html=f title=my friends')
											.on('click',function(e){
												var fr=soc.friends.html
												fr.find('.list').show()
												fr.find('.foundlist').hide()
												console.log(fr.find('.foundlist'))
											}).p.p
									.r('td')
										.r('input value=input').p.p
									.r('td')
										.r('div class=but html=find')
											.on('click',function(e){
												var fr=soc.friends.html
												fr.find('.list').hide()
												fr.find('.foundlist').show()
												console.log(fr.find('.foundlist')).show()
											}).p.p.p.p.p
						.r('tr')
							.r('td class=list')						
								.r('div')
									.s('height:100% overflow:auto width:100%')
									.fn(function(o){
										loop(15,function(i){
											o.r('div html=item'+i)
										})
									}).p.p
							.r('td class=foundlist')						
								.r('div')
									.s('height:100% overflow:auto width:100%')
									.fn(function(o){
										loop(15,function(i){
											o.r('div html=found item'+i)
										})
									}).p.hide()
			
				}
			}
		soc.friends.r(soc.html.find('.friends'))				
		soc.guild={
			r:function(to){			
				d.r('div class=guild')
					.fn(function(o){
						soc.guild.html=o
						if(to) o.to(to)
					})
					.s('height:256px')
						.r('table')
							.s('height:100%')
							.r('tr')
								.s('height:1px')
								.r('td')
									.r('td')
										.r('div class=but html=g title=my guild')								
											.on('click',function(e){
												var fr=soc.guild.html
												fr.find('.list').show()
												fr.find('.foundlist').hide()
											}).p.p
									.r('td')
										.r('input value=input').p.p
									.r('td')
										.r('div class=but html=find')
											.on('click',function(e){
												var fr=soc.guild.html
												fr.find('.list').hide()
												fr.find('.foundlist').show()
											}).p.p.p.p
							.r('tr')
								.r('td class=list')						
									.r('div')
										.s('height:100% overflow:auto width:100%')
										.fn(function(o){
											loop(15,function(i){
												o.r('div html=item'+i)
											})
										}).p.p
								.r('td class=foundlist')						
									.r('div')
										.s('height:100% overflow:auto width:100%')
										.fn(function(o){
											loop(15,function(i){
												o.r('div html=found item'+i)
											})
										}).p.hide()
				
			}
		}
		soc.guild.r(soc.html.find('.guild'))
		//chat
		d.body.find('.chat')
			.s('vertical-align: top')
			.r('div')
				.s('height:100% width:100%')
				.r('table')
					.s('height:100% width:100%')
					.r('tr')
						.s('height:1px')
						.r('td')
							.r('div class=cols')
								.r('div')
									.s('background:#eee')
									.fn(function(o){
										loop(5,function(i){
											o.r('div class=but iblock html=chan'+i)
										})
									}).p
								.r('div class=cols')
									.s('width:1px')
									/*
									.r('div')
										.r('div class=but html=f')
										.on('click',function(e){
											modal.r()
											soc.friends.r()
											modal.set(soc.friends.html)
										}).p.p
									.r('div')
										.r('div class=but html=g')
										.on('click',function(e){
											modal.r()
											soc.guild.r()
											modal.set(soc.guild.html)
										})										
										.p.p
									/**/
									.r('div')
										.r('div class=but pin html=pin')
										.on('click',function(e){
											this.findup('.social').toggleclass('pinned')
										}).p.p.p.p.p.p
					.r('tr')
						.r('td')
							.r('div class=chatlines')
								.s('height:100% overflow:auto')
								.fn(function(o){
									loop(25,function(i){
										o.r('div class=line html=(hh:mm:ss) name: message'+i)
									})
								}).p.p.p
					.r('tr')
						.s('height:1px')
						.r('td')
							.r('div class=cols')
								.s('width:100% background:#eee')
								.r('div')
									.s('width:1px')
									.r('div class=but send iblock html=send').p.p
								.r('div')									
									.r('input class=iblock html=type here')
										.s('width:100%').p.p
								.r('div')
									.s('width:1px')
									.r('div class=but join iblock html=join').p.p
									
		d.trigger('social ready')		
		return soc.html
	}
	soc.r()
})()

