
d.on('ready',function(e){
	var dices=d.body.r('input type=number value=1')
	var sides=d.body.r('input type=number value=20')
	var result=d.body.r('div')
	d.body.r('button html=roll')
		.on('click',function(e){
			var di=dices.val().int(),
				si=sides.val().int(),
				hig=0,
				res=0,
				sum=0,
				count=100000
				
			loop(count,function(i){
				hig=0
				loop(di,function(i2){
					res=roll(si)
					//console.log('res:',res)
					if(res>hig){
						hig=res
					}					
				})
				//console.log('hig:',hig)
				sum+=hig
			})
			//console.log('SUM:',sum)
			res=sum/count
			result.h(res)
		})
})
function roll(nr){
	res=parseInt(Math.random()*nr)+1
	if(res==21){
		res=roll(nr)
	}
	return res
}
