var form
d.on('ready',function(e){
	form=d.body.r('div')
	
	form.r('input id=field1 value=10').p
		.r('select id=field2')
			.r('option value=1 html=esimene').p
			.r('option value=2 html=teine').p.p
		.r('check id=field3').p
})