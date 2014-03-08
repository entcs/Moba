d.on('ready',function(e){
	var minpts=0,
		maxpts=12,
		defpts=minpts+Math.floor((maxpts-minpts)/2)
		
	function calcval(pts,min,max,round){
		var step=(max-min)/(maxpts-minpts)							
			
		val=(min+step*(pts-minpts)).round(round || 0)
		return val
	}	
	var tank={
			hull:{
				tankmobility:{
					def:36,
					getval:function(pts){
						var val=[
							'topspeed:'+calcval(pts,20,80)+' km/h',
							'acceleration:'+calcval(pts,5,20)+' km/h2',
							'turning:'+calcval(pts,15,60)+' deg/s'
						].join('<br>')
						return val
					}
				},
				gun:{
					def:100,
					getval:function(pts){
						var dam=calcval(pts,100,400),
							rel=calcval(pts,3,15,2),
							val=[
							'damage:'+dam,
							'reload:'+rel+'s',
							'dps:'+(dam/rel).round(2),							
							'ammo:'+(6000/dam).round()
						].join('<br>')
						return val
					}					
				},
				turret:{
					def:36,
					getval:function(pts){
						var an=calcval(pts,5,20)
						var val=[
							'turning:'+calcval(pts,15,60)+' deg/s',
							'angle: +'+(15+an)+'/-'+an,
							'accuracy at 100m: '+calcval(pts,0.6,0.2,2)+'m',
							'aiming time: '+calcval(pts,5,2,2)+'s',
							'view range: '+calcval(pts,300,600)+'m',
						].join('<br>')		
						return val
					}
				},
				armor:{
					def:100,
					getval:function(pts){
						var arm=calcval(pts,100,400)
						var val=[
							'front:'+arm,
							'sides:'+arm/2,
							'back:'+arm/4,
							'hp:'+(750+arm)
						].join('<br>')		
						return val
					}					
				}
			}
		}
	var wrap=d.body.r('div class=tank')
		.s('display:inline-block')
	var ele
	loop(tank,function(i,e){
		console.log(i,e)
		ele=wrap.r('div')
			.addclass(i)
			.s('display:block margin-bottom:20px')
		loop(e,function(k,v){
			ele.r('div')
				.r('label')
					.h(k)
					.s('display:block text-transform:uppercase').p				
				.r('input type=number class=pts')
					.set('id',k)
					.set('val',defpts)
					.on('change',function(e){
						if(this.val>maxpts){
							this.val=maxpts
						} else if(this.val<minpts){
							this.val=minpts
						}
						console.log(v.getval(this.val))
						this.p.find('.final').h(v.getval(this.val))
					})
					.s('width:48px').p				
				.r('div class=final')
					.fn(function(o){												
						o.h(v.getval(o.p.find('.pts').val))
					})
		})
	})
})