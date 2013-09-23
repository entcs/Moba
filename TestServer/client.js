var ds1
d.on('ready',function(e){
	console.log('client ready')
	d.body.r('button html=send')
		.s('display:block')
		.on('click',function(e){
			var data={
				type:'user',
				name:'lalalala',
				age:18,
				friends:[1,2,3,4,5,6]
			}
			dnet.get(data,function(res){
				console.log('got res:',res)
				d.find('.res').h(d.find('.res').innerHTML+res+'\n')
			})
		}).p
		.r('textarea class=res')
			.s('display:block height:400px')
	
	d.body.r('form class=user')		
		.r('label for=type html=type').p
		.r('input id=type').p
		.r('label for=type html=type').p
		.r('input id=type').p
		.r('label for=type html=type').p
		.r('input id=type').p
		.r('label for=type html=type').p
		.r('input id=type').p
		.r('label for=type html=type').p
		.r('input id=type').p
		.r('button html=send')
})
/*	
var chunk={}
loop(10000000,function(i){
	chunk[i]='kasjdhajkhsfkjshdfkjhasdjkfhksjdfh'+i
})
/**/
console.log('loaded client')