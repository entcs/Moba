var d=document
d.on('ready', function(){
	console.log('Document ready')
	
	d.body.s('margin:0px')
	//battle
	var battle=function(){
		var top,
			bottom,
			social,
			units
			
		var unitedito=d.body.r('div class=uniteditor drag section')
			.s('position:absolute background-color:#fff z-index:10')
			.r('div class=uniteditorheader dragtarget html=unit editor').p
			.r('div class=unit section html=unit data')
	
		top=d.body.r('div class=battle section')
			.s('text-align:center')
			.r('button html=battle title=join battle').p
			.r('button html=team up title=team up with up to 2 friends')
				.on('click',function(e){
					if(teamup.style.display!='none'){
						teamup.hide()
					} else {
						teamup.show()
					}
				}).p
		
		//team up
		teamup=d.body.r('div class=teamup section drag')
			.s('position:absolute background-color:#fff box-shadow: 0px 5px 15px -5px#888888 z-index:10')
			.r('div html=team up class=dragtarget').p
			.r('div class=cols')
				.r('div class=team section')
					.r('div html=team class=section').p.p					
				.r('div class=friends section')
					.r('div html=friends class=section').p
					.loop(5,function(i,tar){
						console.log('this:',tar)
						tar.r('div class=cols')
							.r('button html=add')
								.on('click',function(e){
									e.target.trigger('addfriendtoteam')
								}).p
							.r('div html=friend'+i)
					}).p.p
					
		d.on('remfriendfromteam',function(e){
			console.log('remfriendfromteam:',e)
			e.target.p.to(e.target.p.p.p.find('.friends'))
			p=e.target.p
			e.target.rem()
			p.r('button html=add').to(p,'first')
				.on('click',function(e){
					e.target.trigger('addfriendtoteam')
				}).p				
			
		})
		d.on('addfriendtoteam',function(e){
			console.log('addfriendtoteam:',e)
			var team=e.target.p.p.p.find('.team')
			if(team.childNodes.length<3){
				e.target.p.to(team)
				p=e.target.p
				e.target.rem()
				p.r('button html=rem')
					.on('click',function(e){
						e.target.trigger('remfriendfromteam')
					})
				}
			})
			
		
		bottom=d.body.r('div bottom')
			.s('position:absolute bottom:0px width:100%')
		
		social=bottom.r('div class=social section')			
			controls=social.r('div class=controls section')
				.s('display:inline-block')
			channels=social.r('div class=channels section')
				.s('display:inline-block')
				.r('button class=chan')
					.h('chat1')
			
		names=['friends','foes','search']
		loop(names,function(i,e){
			controls.r('button')
				.h(e)
		})
		units=bottom.r('div class=units section')
			.s('text-align:center')
			
		loop(12,function(i){
			units.r('button unit')
				.s('width:64px height:64px')
				.h('unit'+(i+1))
		})
	
	var dodrag=0,
		lastdrag
	function startdrag(tar,e){
		tar.trigger('startdrag')
						
		dodrag={
			start: {
				x:e.pageX,
				y:e.pageY
			},
			zindex: tar.style.zIndex,
			tar: tar,
			off: {
				x:e.pageX-tar.offsetLeft,
				y:e.pageY-tar.offsetTop
			}
		}
		
		if(lastdrag){
			if(lastdrag.zindex){
				lastdrag.tar.s('z-index:'+lastdrag.zindex)
			} else {
				lastdrag.tar.s('z-index:')
			}
		}
		
		
		tar.s('z-index:999')
		e.preventDefault()
	}
	d.body.on('mousedown',function(e){
		var tar=e.target
		if(tar.hasclass('drag')){
			startdrag(tar,e)
		} else if(tar.hasclass('dragtarget')){
			tar=tar.findup('.drag')			
			startdrag(tar,e)
		}
		
	})
	d.body.on('mouseup',function(e){
		if(dodrag){			
			dodrag.tar.trigger('enddrag')
			lastdrag=dodrag
			dodrag=0
			
			
		}
	})
	d.body.on('mousemove',function(e){
		if(dodrag){
			dodrag.tar.style.left=e.pageX-dodrag.off.x
			dodrag.tar.style.top=e.pageY-dodrag.off.y
		}
	})
	d.body.on('startdrag',function(e){
		console.log('drag started:',e)
	})	
	d.body.on('enddrag',function(e){
		console.log('drag ended:',e)
	})	
					
	}()	
})