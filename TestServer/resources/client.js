var views={}
d.on('ready',function(e){
	var body=d.body
	console.log('client ready')
	body.r('div class=code')				
		.r('textarea rows=10 class=code')
			.s('display:block width:100% max-width:100%')
			.on('keydown',function(e){			
				var tar=e.target,
					pos=tar.caret(),
					text=tar.val
				
				//console.log(e.which)
				if(e.which==9){
					tar.val=text.slice(0,pos)+'    '+text.slice(pos)
					tar.caret(pos+4)
					e.preventDefault()
					e.stopPropagation()
				} else if(e.which==8){//backspace
					var pchar=text[pos-1],
						count=0,
						over=0
						
					loop(function(i){
						pchar=text[pos-1-i]
						if(pchar!=' '){
							return false
						} else {
							count+=1
						}
					})
					if(count){
						over=(count-1)%4				
						if(over){
							tar.val=tar.value.splice(pos-over,over)
							tar.caret(pos-over)
						}
					}
				} else if(e.which==46){//del
					var pchar=text[pos-1],
						count=0,
						over=0
						
					loop(function(i){
						pchar=text[pos+i]
						if(pchar!=' '){
							return false
						} else {
							count+=1
						}
					})
					if(count){
						over=(count-1)%4				
						if(over){
							tar.val=tar.value.splice(pos,over)
							tar.caret(pos)
						}
					}
				}
			}).p
			.r('button html=eval')
				.s('display:block width:100%')
				.on('click',function(e){
					eval.call(window,this.prev().val)
				})
})


/*
d.get('views/form1.js',function(res){
	console.log(res?true:false)
})
/**/
var helloglobal='akjsdhkasjdfh'
d.getscript('views/form1.js',function(res){
	views.form1=res
	views.form1.show(d.body)	
})
/**/
/*
d.send('/index.html',function(res){
	eval.call(window,res)
	//console.log('res:',res)
})
/**/

/*
fs.add('users')
fs.add('users/user1.json',{
	name:'user1',
	age:19
})
fs.add('users/user2.json','lalalla')
/**/

/*	
var chunk={}
loop(10000000,function(i){
	chunk[i]='kasjdhajkhsfkjshdfkjhasdjkfhksjdfh'+i
})
/**/
console.log('loaded client')