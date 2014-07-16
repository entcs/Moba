d.on('ready',function(e){
	var istouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
		green='#7db100',
		red='#ff5a00',
		black='#222',
		down='mousedown',
		up='mouseup',
		press='click',
		move='mousemove'
		
	if(istouch){		
		down='touchstart'
		up='touchend'
		press='touchstart'
		move='touchmove'		
	}
	
	var gdev={
		showstyles:function(){
			var sh=d.dss.new('gdev-styles')
			sh.new('body',
				'margin:0px'
			)
			sh.new('body, input, button,a',
				'font-family:Open Sans Condensed, sans-serif',
				'font-weight: bold',
				'font-size:24px',
				'color:#333',				
				'text-transform: uppercase'
			)				
			sh.new('.wrap',
				'width:100%',
				'height:100%'
			)
			sh.new('.headerwrap',
				'background-color:orange'
			)			
			sh.new('.header',
				''
			)
			sh.new('.title',
				'font-size:64px',
				'color:#eee'
			)			
			sh.new('.vtops > *',
				'vertical-align:top'
			)
			sh.new('.menuitem',
				'text-align:center',
				'padding:6px 12px',				
				'margin:0 auto',				
				'transition:all 0.5s'
			)
			sh.new('.cols',
				'display:table',
				'table-layout:fixed',
				'width:100%'
			)
			sh.new('.cols>*',
				'display:table-cell',
				'vertical-align:top'
			)
			sh.new('.iblocks > *',
				'display:inline-block',
				'box-sizing:border-box'				
			)	
			sh.new('.logowrap',
				'padding-left: 20px',
				'font-size: 49px',
				'vertical-align: middle',				
				'color:#eee'
			)
			sh.new('.contwrap',
				'width:100%'
			)						
			sh.new('.cont',				
				'text-align:center'				
			)	
			sh.new('.but',
				'color:#222',
				'cursor:pointer',
				'border-radius: 64px',
				'border: 2px solid #eee',
				'margin: 2px',
				'background-color:#fff',
				'box-shadow: inset #222 0px 0px 10px 0px',
				'transition:all 0.5s'
			)
			sh.new('.but:hover',
				'color:#eee',
				'background-color:#666'
			)			
			sh.new('.item',
				'position:relative',
				'vertical-align:top',
				'width:320px',
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
			var wrap=d.body.r('div class=gdev')
			//header
			var header=wrap.r('div class=header cols')
				.s('background-color:#eee')
			var logowrap=header.r('div')
			var logo=logowrap.r('div class=logo iblocks vtops but')
				.s('padding:0px 14px 0px 10px display:inline-block')
			logo.on(down,function(e){
				var about=d.body.r('div class=about')
					.s('position:absolute top:0px left:0px width:100% height:100% background-color:rgba(0,0,0,0.7)')
					.s('text-align:center')
				about.r('div class=but')
					.s('margin:0 auto width:320px')
					.h('skype:hendrik.kangro')
				about.r('div class=but')
					.s('margin:0 auto width:320px')
					.h('hendrik.kangro@gmail.com')
				about.r('div class=but')
					.s('margin:0 auto width:320px')
					.h('+372 5515325')
				close=about.r('div class=but close')
					.s('width:64px height:64px background-image:url(ico64.png) background-position:-448px -192px')
					.s('margin:0 auto')
					.on(down,function(e){
						about.rem()
					})					
			})				
			//boy
			logo.r('div class=ico')
				.s('width:64px height:64px background-image:url(ico64.png) background-position:-192px -128px')				
			logo.r('div class=text html=gdev')
				.s('font-size:49px color:#77AF00')				
				
			var controls=header.r('div class=controls')
				.s('width:64px')
			var loginbut=controls.r('div class=but')
				.s('width:64px height:64px float:right cursor:pointer')
				.s('background-image:url(ico64.png) background-position:0px -128px')
			var logoutbut=controls.r('div class=but')
				.s('width:64px height:64px float:right cursor:pointer')
				.s('background-image:url(ico64.png) background-position:-64px -192px')
			logoutbut.hide()
			loginbut.on(down,function(e){
				var login=d.body.r('div class=login')
					.s('position:absolute top:0px left:0px width:100% height:100% background-color:rgba(0,0,0,0.7)')
					.s('text-align:center')
				login.r('input id=name class=but')
					.s('display: block margin: 0 auto margin-top:64px text-align:center')					
				login.r('input id=pasw type=password class=but')
					.s('display: block margin: 0 auto text-align:center')					
				bwrap=login.r('div class=iblocks')
					.s('text-align:center')
				//save
				bwrap.r('div id=save class=but')
					.s('width:68px height:68px background-image:url(ico64.png) background-position:-512px -128px')
				//cancel
				bwrap.r('div id=cancel class=but')
					.s('width:68px height:68px background-image:url(ico64.png) background-position:-448px -192px')
					.on(down,function(e){
						login.rem()
					})
			})
			
			//content
			var content=wrap.r('div class=content')
			
			var wrap=d.body.r('div class=wrap'),				
				menu=wrap.r('div class=menu iblocks'),
				contwrap=wrap.r('div class=contwrap'),
				cont=contwrap.r('div class=cont')							
						
			menu.s('padding:3px text-align: center')
				.s('background-color:'+black)
			/*
			//login
			var auth=d.r('div class=auth'),				
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
			/**/
			var cookies={}
			loop(d.cookie.split('; '),function(i,cc){
				aa=cc.split('=')
				cookies[aa[0]]=aa[1]
			})
			
			if(cookies.user && cookies.sid){
				loginbut.hide()
				logoutbut.show()
			}
			/**/
			
			//menu			
			var names=[
					'games','projects','events'
				],				
				item
			loop(names,function(i,name){
				item=menu.r('div class=menuitem but')					
					.h(name)
				item.on(down,function(e){
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
					item=cont.r('div class=item id=item'+d.uid())
						.s('background-image:url(./screens/'+kv.name.split('-')[0].replace(/ /g,'')+'.png)')
						.s('position:relative')
						.on(press,function(e){
							var tar=e.target,
								link=tar.get('data-link')
							if(link){
								window.open(link,'_blank')
							}
						})
					if(kv.color){
						item.s('color:#eee')
					}
						
					loop(kv,function(k,v){
						//item.h(name)
						if(k=='name'){
							item.r('div id='+k)
								.s('background-color:rgba(0,0,0,0.3)')
								.h(v)
						} else if(k=='description'){
							item.r('div id='+k)
								.s('font-size:18px')
								.s('background-color:rgba(0,0,0,0.3)')
								.h(v)
								
						} else if(k=='link'){
							item.set('data-link',v.toLowerCase())
							if(v){
								item.r('div class=ico but')
									.s('width:64px height:64px')
									.s('background-image:url(ico64.png) background-position:-64px -128px')
									.s('position:absolute right:0px bottom:0px pointer-events: none')
							}
							/*
							item.r('a id=link target="_blank" href='+v)
								.h('link')
								.set('title',v)
							*/
						}
					})
				})
				d.send(url,function(res){					
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
				})
				
				var index=0,
					items=cont.findall('.item'),
					r=(150+(Math.random()*100).round()),
					g=(150+(Math.random()*100).round()),
					b=(150+(Math.random()*100).round()),
					color=['rgb('+r,g,b+')'].join(','),
					color2=['rgb('+(355-r),(355-g),(355-b)+')'].join(',')				
				
				d.find('.header').s('background-color:'+color2)
				
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
				
				//change logo
				var nr1=Math.random()>0.5,
					nr2=Math.random()>0.5,
					text=d.find('.logo .text'),
					ico=d.find('.logo .ico'),
					icox=-192,
					icoy=-64					
				console.log(nr1,nr2)
				if(nr2){
					icox=-256
				}
				if(nr1){
					text.s('color:'+green)										
					icoy=-128
				} else {
					text.s('color:'+red)
					icoy=-192
				}
				ico.s('background-position:'+icox+'px '+icoy+'px')
				
			}
			var url='/X/list'.replace('X',name)
			d.send(url,function(res){				
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
