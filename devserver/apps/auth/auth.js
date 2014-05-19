var auth

//extend dom0
function addfield(name,type){
	type=type || 'text'
	var field=d.r('div class=field'),
		lab=field.r('label for='+name),
		inp=field.r('input type='+type)	
	lab.h(name)
	inp.id=name
	return field
}

d.on('ready',function(e){
	auth={
		sheet:'',
		showsheet:function(){
			var sh=d.dss.new('auth_sheet')
			sh.new('body, input, button',
				'font-family:Open Sans Condensed, sans-serif',
				'font-weight: bold',
				'font-size:14px',
				'color:#666',				
				'text-transform: uppercase'
			)			
			sh.new('.form',
				'background-color:#eee',
				'border:1px solid #aaa',
				'width:256px',
				'text-align:right'
			)
			sh.new('.w100',
				'width:100%'
			)
			sh.show()
			auth.sheet=sh
		},
		show:function(){
			var view=d.body.r('div id=auth')
			view.r('button')
				.h('register')
				.on('click',function(e){
					if(this.view=='register'){
						d.find('#register').rem()
						auth.showlogin()
						this.view='login'
						this.h('register')
					} else {
						d.find('#login').rem()
						auth.showregister()						
						this.view='register'
						this.h('login')
					}
				})
		},
		showlogin:function(){
			var login=d.r('div id=login class=form'),
				div
				
			addfield('name').to(login)
			addfield('pasw','password').to(login)
			login.r('input type=hidden id=url')
				.val('/return/url')
			
			login.r('button class=send w100')
				.h('send')
				.on('click',function(e){
					var data=login.getform()
					data.pasw=d.hash(data.pasw)
					if(data.name && data.pasw){
						d.send('users/login',data,function(res){
							console.log('res:',res)
							login.find('.res').h(res)
						},'json')
					}
					
				})
				login.r('div class=res')
			login.to(d.body)
			return login
		},
		showregister:function(){
			var register=d.r('div id=register class=form')
				
			addfield('name').to(register)
			addfield('email').to(register)
			addfield('pasw','password').to(register)
			//addfield('confirmpasw','password').to(register)

			register.r('button class=w100')
				.h('send')
				.on('click',function(e){
					var data=register.getform()
					
					if(data.name && data.email && data.pasw){// && data.pasw==data.confirmpasw){
						data.pasw=d.hash(data.pasw)
						//data.confirmpasw=d.hash(data.confirmpasw+stamp)
						console.log('send:',data)
						data={
							item:data
						}
						d.send('users/register',data,function(res){
							console.log('res:',res)
							register.find('.res').h(res)
						},'json')
					}
				})		
			register.r('div class=res')				
			register.to(d.body)
		}
	}
	auth.showsheet()
	auth.show()
	auth.showlogin()
	console.log('auth ready')
})