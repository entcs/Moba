var sc={
	html:'',
	addstyles:function(){
		var sh=d.dss.new('sc-styles')
		
		sh.new('td',
			'border:1px solid #aaa'
		)
		sh.new('table',			
			'border-collapse:collapse'
		)
		
		sh.show()
	},
	pts:12,
	durbuff:1,
	setduration:function(){
		var sl=d.find('.skilllist tbody'),
			trs=sl.findall('tr'),
			durtr=sl.find('.duration'),
			dur=durtr.find('.pts input').val.int(),
			desc,
			val		
		
		loop(trs,function(i,tr){			
			if(tr.hasclass('duration') || tr.hasclass('cooldown')){
				
			} else {
				val=tr.find('.pts input').val.int(),
				desc=tr.find('.desc')
				
				if(tr.data.desc){
					val*=1+dur*durtr.data.mul
					var text=tr.data.desc.replace('X',(val*tr.data.val).round()).replace('Y',dur*4)
					desc.h(text.replace('X',val.round()))
				}
			}
		})
	},
	setval:function(e){
		var tr=e.target.findup('tr'),
			ele=tr.find('.pts input'),
			val=ele.val.int(),
			max=tr.data.max || 12,
			trs=e.target.findup('tbody').findall('tr'),
			alloc=0,
			maxval
		
		//get allocated points
		loop(trs,function(i,tr1){
			if(tr1!=tr){
				alloc+=tr1.find('.pts input').val.int()
			}							
		})			
		
		maxval=12-alloc						
		if(val>max){
			val=max
			
		} else if(val>maxval){
			val=maxval							
		} else if(sc.pts<0){
			sc.pts=0
			if(val<0){
				val=0								
			}							
		} else if(val<0){
			val=0
		} else if(val){
			sc.pts-=1							
		}	
		ele.val=val
		ele=tr.find('.desc')
		ele.h(tr.data.desc.replace('X',val*tr.data.val))
		sc.setduration()
		
	},
	draw:function(){
		var time=[0,4,8,12]
		var skills={
			duration:{
				desc:'Spell lasts for X seconds(2 sec pulsing)',
				val:4,
				max:3,
				mul:1
			},
			cooldown:{
				desc:'Cooldown X sec',
				val:4,
				max:3
			},
			heal:{
				desc:'Heals X health over Y seconds.',
				val:10
			},
			damage:{
				desc:'Deals X damage over Y seconds.',
				val:10			
			},
			swift:{
				desc:'Move faster by X % over Y seconds.',
				val:10			
			},
			slow:{
				desc:'Move slower by X % over Y seconds.',
				val:10						
			},
			blink:{},
			grasp:{},
			cleanse:{
				desc:'X % chance to remove a negative effect. Lasts Y seconds.',
				val:300/12					
			},
			purge:{
				desc:'Remove X positive effects over Y seconds.',
				val:100/12							
			},
			shield:{
				desc:'Shields from X negative effects over Y seconds.',
				val:100/12							
			},
			seal:{
				desc:'Remove X negative effects over Y seconds.',
				val:100/12							
			},
			invis:{
				desc:'You are invisible for Y seconds.',
				val:10									
			},
			vision:{
				desc:'You can see invisible for Y seconds.',
				val:10									
			}
		}
		var fields=['name','desc','pts']
		var html=d.r('div class=sc')
		var table=html.r('table class=skilllist'),
			thead=table.r('thead'),
			tbody=table.r('tbody'),
			tr=thead.r('tr'),
			td
		
		table.s('width:512px')
		
		loop(fields,function(i,e){
			tr.r('td')
				.s('background-color:#eee')
				.h(e)
		})
		loop(skills,function(k,v){
			tr=tbody.r('tr class='+k)
			tr.data=v
			td=tr.r('td class=name')
			td.h(k)

			td=tr.r('td class=desc')			
			td.h(v.desc)

			tr.r('td class=pts')
				.r('input type=number val=0')
					.s('width: 38px')
					.on('change',function(e){
						sc.setval(e)						
					})
					.on('wheel',function(e){						
						if(e.wheelDelta>0){
							e.target.val=e.target.val.int()+1
						} else {
							e.target.val=e.target.val.int()-1
						}
						sc.setval(e)
					})
					
		})
		html.to(d.body)
		
		sc.html=html
	}
}
d.on('ready',function(e){
	sc.addstyles()
	sc.draw()
	
})