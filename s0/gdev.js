d.on('ready',function(e){
	var gdev={
		showstyles:function(){
			var sh=d.dss.new('gdev-styles')
			sh.new('body',
				'margin:0px'
			)
			sh.new('body, input, button,a',
				'font-family:Open Sans Condensed, sans-serif',
				'font-weight: bold',
				'font-size:15px',
				'color:#333',				
				'text-transform: uppercase'
			)				
			sh.new('.wrap',
				'width:100%',
				'height:100%',
				'background-color:#eee'
			)
			sh.new('.headerwrap',
				'background-color:orange'
			)			
			sh.new('.header',
				'width:960',
				'margin:0 auto',
				'height:96px'
			)
			sh.new('.title',
				'font-size:64px',
				'color:#eee'
			)			
			sh.new('.menuwrap',
				'background-color:#fff'
			)
			sh.new('.menu',
				'width:960px',
				'color:white',
				'margin:0 auto'				
			)
			sh.new('.menuitem',
				'text-align:center',
				'padding:5px 15px',
				'color:#666',
				'font-size:18',
				'cursor:pointer',
				'margin:0 auto',
				'transition:all 0.5s'
			)
			sh.new('.menuitem:hover',
				'color:#eee',
				'background-color:#666'
			)			
			sh.new('.cols',
				'display:table',
				'table-layout:fixed'
			)
			sh.new('.cols>*',
				'display:table-cell',
				'vertical-align:top'
			)
			sh.new('.iblocks > *',
				'display:inline-block',
				'box-sizing:border-box'				
			)	
			sh.new('.contwrap',
				'width:100%',
				'background-color:#eee'
			)						
			sh.new('.cont',				
				'text-align:center',
				'background-color:#eee'						
			)			
			sh.new('.item',
				'position:relative',
				'vertical-align:top',
				'width:300px',
				'height:200px',
				'margin:2px',
				'cursor:pointer',
				'transition:all 1s',
				'display:inline-block',
				'color:#333'
			)
			sh.new('.item:hover',
				''
			)			
			sh.new('.item .rem',
				'position:absolute',
				'top:0px',
				'right:0px',
				'padding:5px 15px',
				'background-color:rgba(0,0,0,0.1)'
			)
			sh.new('.auth',
				'position:absolute',
				'top:4px',
				'right:4px',
				'float:right',
				'text-align:right',
				'width:200px',				
				//'height:100%',
				'background-color:rgba(255,255,255,0.1)',
				'color:#eee'
			)	
			sh.new('.auth,.auth input,.auth button',
				'font-size:10px'
			)
			sh.new('.auth button',
				'display:block',
				'width:100%'
				
			)
			sh.new('.tr',
				'text-align:right'
			)
			sh.new('.tl',
				'text-align:left'
			)
			sh.new('.hide',
				'display:none'
			)
			
			
			sh.show()
			
		},
		show:function(){
			var wrap=d.body.r('div class=wrap'),			
				headerwrap=wrap.r('div class=headerwrap'),
				header=headerwrap.r('div class=header iblocks'),
				menuwrap=wrap.r('div class=menuwrap'),
				menu=menuwrap.r('div class=menu cols'),
				contwrap=wrap.r('div class=contwrap'),
				cont=contwrap.r('div class=cont')
				
			//header
			var title=header.r('div html=gdev class=title')
			
			//login
			var auth=headerwrap.r('div class=auth'),				
				login=auth.r('div class=login'),
				lab=login.r('div class=field')
					.r('label for=name html=name').p
					.r('input id=name'),
				inp=login.r('div class=field')
					.r('label for=pasw html=pasw').p
					.r('input id=pasw type=password'),
				message=login.r('div class=mes'),
				but=login.r('button class=send html=login'),
				register=login.r('button class=register html=register')
				
				
			var logout=auth.r('button class=logout html=logout')					
					.on('click',function(e){
						login.show()
						logout.hide()								
					
						d.send('/logout',function(res){
							console.log('res:',res)
							res=JSON.parse(res)
							if(res.err){
							} else {
							}
							message.h(res.err)
						})
					})
					
			logout.hide()	
			but.on('click',function(e){
				var data=login.getform()
				if(data.name && data.pasw){
					data.pasw=d.hash(data.pasw)
					d.send('/login',data,function(res){
						console.log('res:',res)
						res=JSON.parse(res)
						if(res.err){
							
						} else {
							login.hide()
							logout.show()
						}
						message.h(res.err)
					},'json')
				}
				console.log('data:',data)
			})
			var cookies={}
			loop(d.cookie.split('; '),function(i,cc){
				aa=cc.split('=')
				cookies[aa[0]]=aa[1]
			})
			console.log(cookies)
			if(cookies.user && cookies.sid){
				login.hide()
				logout.show()
			}
			
			
			//menu
			var names=[
					'games','resources','about'
				],				
				item
			loop(names,function(i,name){
				item=menu.r('div class=menuitem')
					.h(name)
				item.on('click',function(e){
					gdev.showcontent(e.target.h())
				})
			})
				
		},
		showcontent:function(name){
			var lists=[
				'games',
				'developers',
				'gevents'
			]
			
			function showcontent(list){
				var cont=d.find('.cont'),
					item,
					rem
				cont.h('')
				loop(list,function(i,kv){
					item=cont.r('div class=item')
					
					item.r('div class=rem html=X')
						.on('click',function(e){
							var data={
									id:e.target.p.find('#id').h(),
									want:'list'
								}
							d.send('/X/rem'.replace('X',name),data,function(res){
								if(res.err){
								} else {
									gdev.showcontent(name)
								}
							},'json')
						})
					
					loop(kv,function(k,v){
						//item.h(name)
						if(k=='link'){
							item.r('a id=link target="_blank" href='+v)
								.h('link')
								.set('title',v)
						} else {
							item.r('div id='+k)
								.h(v)						
						}
					})
				})
				//add new
				var newitem=cont.r('div class=item new html=add '+name),
					url=[
						'/',
						name,
						'/add'
					].join(''),
					form=newitem.r('form class=tr')
				newitem
				d.send(url,function(res){
					console.log('res:',res)
					res=JSON.parse(res)				
					var field,
						lab,
						inp
						
					loop(res.res,function(i,e){					
						if(e.Field!='id'){
							if(!(name=='games' && e.Field=='owner')){
								field=form.r('div class=field')
								
								lab=field.r('label')
								lab.h(e.Field)
								lab.set('for',e.Field)
								
								inp=field.r('input')
								inp.set('name',e.Field)
								inp.id=e.Field
							}
						}
					})
					//add button
					var but=form.r('button type=button html=add')
					but.on('click',function(e){
						
						var url=[
								'/',
								name,
								'/add'
							].join(''),
							data={
								item:form.getform(),
								want:'list'
							}
						d.send(url,data,function(res){
							res=JSON.parse(res)							
							if(res.err){
								console.log('err:',res.err)
							} else {
								gdev.showcontent(name)
							}
						},'json')						
					})
				})
				
				var index=0,
					items=cont.findall('.item'),
					r=(100+(Math.random()*100).round()),
					g=(100+(Math.random()*100).round()),
					b=(100+(Math.random()*100).round()),
					color=['rgb('+r,g,b+')'].join(','),
					color2=['rgb('+(255-r),(255-g),(255-b)+')'].join(',')				
				
				d.find('.headerwrap').s('background-color:'+color2)
				function step(){								
					items[index].s('background-color:'+color)
					setTimeout(function(e){
						if(index<items.length-1){
							index+=1
							step()
						}
					},100)
				}
				step()
			}
			var url='/X/list'.replace('X',name)
			d.send(url,function(res){
				console.log(res)
				res=JSON.parse(res)
				showcontent(res.list)
			})
		}
	}
	gdev.showstyles()
	gdev.show()
	gdev.showcontent('games')
	
	d.on('send',function(e){
		//console.log('send:',e)
	})
	d.on('recv',function(e){
		var headers=e.args[0].getAllResponseHeaders().toLowerCase(),
			hhh=headers.split('\r\n')		
		headers={}		
		loop(hhh,function(i,hh){
			h=hh.split(': ')
			headers[h[0]]=h[1]
		})
		//console.log('headers',headers.isauth.length)		
		//console.log('cookie:',d.cookie)
		var cc=d.cookies(),
			login=d.find('.auth .login'),
			logout=d.find('.auth .logout')
		//if(cc.sid && cc.user){		
		if(headers.isauth==='true'){
			//auth
			login.hide()
			logout.show()				
		} else {
			//not auth
			login.show()
			logout.hide()							
		}
		/*
		var res=e.args[0].responseText
		if(res.length){
			res=JSON.parse(res)
			console.log('recv:',res)
		}
		/**/
	})	
})
