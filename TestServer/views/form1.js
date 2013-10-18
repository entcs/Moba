//alert(helloglobal)
script={
	win:this,
	show:function(tar){
		var html=d.r('div class=form1')
		
		html.r('label for=name').p
			.r('input id=name').p
			.r('button html=send')
				.on('click',function(e){
					var data={
						type:'form1',
						action:'post',
						formdata:html.getform()
					}
					console.log('form data:',data)
					d.send(data,function(res){
						console.log('form send:',res)
					})
				})
		tar=tar || this.tar
		if(tar) {
			this.tar=tar
			this.html=html
			html.to(tar)
		}
	},
	tar:'',
	hide:function(){
		this.html.rem()
		this.html=''
	},
	html:'',
	log:function(){
		console.log('lastview:',lastview)
	}
}

//console.log('loaded form1')