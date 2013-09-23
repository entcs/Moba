var modal={
	open:function(cont,unique){
		var cmodal=dview('modal'+new Date().getTime(),function(){		
			this.html
				.s('position:absolute padding:0px background:#fff')
				.addclass('dragtarget but')
				.r('div class=cols')
					.r('div class=but header drag html=modal header')
						.s('border-radius:10px 0px 0px 0px background:#eee').p
					.r('div class=but close html=x')	
						.s('border-radius:0px 10px 0px 0px background:#eee width:1px')
						.on('click',function(e){
							cmodal.close()
						}).p.p
				.r('div class=modalcontent')
					.s('padding:10px').p
			})		
		cmodal.close=function(){
			cmodal.html.rem()
			cmodal.html=0
		}
		cmodal.set=function(cont){
			cmodal.r(d.body)
			cont.to(cmodal.html.find('.modalcontent'))
			cmodal.html.s('position:absolute')
			var mwid=parseInt(window.getComputedStyle(cmodal.html).width)/2,
				mhig=parseInt(window.getComputedStyle(cmodal.html).height)/2,	
				wwid=window.innerWidth/2,
				whig=window.innerHeight/2,
				pos={
					x:wwid-mwid,
					y:whig-mhig
				}
			cmodal.html.setpos(pos)		
		}			
		cmodal.set(cont)
		if(unique){
			var old=d.body.find('.'+unique)
			if(old) old.rem()
			cmodal.html.addclass(unique)
		}
		return cmodal
	}
}
/*
var modal=dview('modal',function(){		
		this.html
			.s('position:absolute padding:0px background:#fff')
			.addclass('dragtarget but')
			.r('div class=cols header')
				.r('div class=but header drag html=modal header')
					.s('border-radius:10px 0px 0px 0px background:#eee').p
				.r('div class=but close html=x')	
					.s('border-radius:0px 10px 0px 0px background:#eee width:1px')
					.on('click',function(e){
						modal.close()
					}).p.p
			.r('div class=modalcontent')
				.s('padding:10px').p
})
modal.close=function(){
	modal.html.rem()
	modal.html=0
}
modal.set=function(cont){
	modal.r(d.body)
	cont.to(modal.html.find('.modalcontent'))
	modal.html.s('position:absolute')
	var mwid=parseInt(window.getComputedStyle(modal.html).width)/2,
		mhig=parseInt(window.getComputedStyle(modal.html).height)/2,	
		wwid=window.innerWidth/2,
		whig=window.innerHeight/2,
		pos={
			x:wwid-mwid,
			y:whig-mhig
		}
	modal.html.setpos(pos)
}
/**/
console.log('loaded modal')