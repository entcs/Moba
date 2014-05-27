/* requires dom0 */
var dui,
	dss,
	d=document,
	oi
	
d.on('ready',function(){	
	dui={
		edit: false,
		act: 0,
		keydown:'',
		root: d.body.r('div id=dom0ui')
			.s('position:absolute height:100% background-color:#eee top:0 right:0 box-sizing:border-box'),
		dist: function(p1,p2){
			var dx=p1.x-p2.x,
				dy=p1.y-p2.y;
			return dist=Math.sqrt(dx*dx+dy*dy)
		},
	}	
	
	dss={
		sheets:{},
		new:function(id){
			var sh={
				styles:{}
			}
			sh.body=d.head.r('style id='+id)
			sh.new=function(){
				var sel,args=[]
				loop(arguments,function(i,e){
					if(i==0){
						sel=e
					} else {						
						args.push(e)
					}
				})	
				this.styles[sel]=args
			}
			sh.show=function(){
				sh.hide()
				dss.rs(sh.id,sh.styles)
			}
			sh.hide=function(){
				var t=d.head.find('#'+sh.id)
				if(t)t.rem()
			}
			sh.shows=function(sel){
			}
			sh.hides=function(sel){
			}
			this.sheets[id]=sh
			return sh	
		},
		rs:function(id,sheet){
			//render style sheet out of object
			var ele=d.find('#'+id) || d.r('style id='+id),
				str=''
			ele.to(d.head)				
			loop(sheet,function(k,v,i){
				str+=k+'{\n'
				loop(v,function(i2,v2){
					str+='\t'+v2+';\n'
				})
				str+='}\n'
			})
			ele.h(str)
			return ele
		}				
	}
	
	var sh1=dss.new('sheet2')
	sh1.new('body',
		'background:red'
	)
	sh1.show()
	/**/
	//floatingcontrols
	var fc={
		body:d.body.r('div class=fc')
			.s('position:absolute opacity: 0.2 z-index:100')
			.on('mouseover', function(){
				this.s('opacity: 1')
			})						
			.on('mouseout',function(){
				this.s('opacity: 0.2')			
			}),		
		changemode:function(mode){
			switch(mode){
				case 'nav':
					var cols=3,
						rows=3,
						names=[{
							name: 'add',
							style: {
								borderRadius: '24px',
							}
						},
						{
							name: 'parent',
							style: {
								borderRadius: '24px 24px 0px 0px',
							}
						},					
						{
							name: 'rem',
							style: {
								borderRadius: '24px',
							}
						},					
						{
							name: 'prev',
							style: {
								borderRadius: '24px 0px 0px 24px',
							}
						},					
						{
							name: 'show',
							style: {
								
							}
						},					
						{
							name: 'next',
							style: {
								borderRadius: '0px 24px 24px 0px',
							}
						},					
						{
							name: 'copy',
							style: {
								borderRadius: '24px',
							}
						},					
						{
							name: 'child',
							style: {
								borderRadius: '0px 0px 24px 24px',
							}
						},					
						{
							name: 'to',
							style: {
								borderRadius: '24px',
							}
						}],
						count=0,
						style;
					fc.info=fc.body.r('div class=duiinfo')
					loop(rows,function(nr){
						div=fc.body.r('div')
						loop(cols,function(nr2){						
							div.r('button class=fcbut')
								.h(names[count].name)
								.set('style',names[count].style)
								.set('data-nr',count)
								.on('click',function(e){
									var nr=count
									console.log('trigger fn',this.get('data-nr'))
								})
							count++
						})					
					})
					
					break
				
			}
		},
		move:function(e){
			var cstyle=window.getComputedStyle(fc.body),
				shift={
					x: parseInt(cstyle.width)/2,
					y: parseInt(cstyle.height)/2
				},
				mpos={
					x:e.pageX-shift.x,
					y:e.pageY-shift.y
				},				
				cpos={
					x:fc.body.offsetLeft,//+parseInt(cstyle.width)/2,
					y:fc.body.offsetTop//+parseInt(cstyle.height)/2
				},
				dist=dui.dist(mpos,cpos);
				
			if (dist>512){
				var off={
					x: (cpos.x+(mpos.x-cpos.x)/32),
					y: (cpos.y+(mpos.y-cpos.y)/32)
				}
				
				fc.body.set('style',{
					top: (off.y)+'px',
					left: (off.x)+'px'
				})
			}			
		}
			
	}
	fc.changemode('nav')

	//navbar
	var names=['nav','layo','style']
	loop(names,function(i,e){
		dui.root.r('button')
			.h('nav')
			.s('width:48px height:48px display:block border-radius:10px')
			.on('click',function(e){
				console.log('nav mode')
			})
	})
	dui.run=function(){
		dui.timo=setTimeout(function(){			
			dui.run();
		},16);
	}
	dui.run();
	
	//object info
	oi={}
	oi.body=d.body.r('div class=oi cont')
		.s('position:absolute text-align:right right:0px background:#fff')
		.r('div class=objname html=objname')
			.s('text-align:center border-bottom:1px solid #ddd').p
		.r('div class=field')
			.r('lable for=objclass html=class').p
			.r('input id=objclass')
				.on('keyup',function(e){
					oi.tar.className=e.t.value
				}).p.p
		.r('div class=field')
			.r('lable for=objid html=id').p
			.r('input id=objid')
				.on('keyup',function(e){
					oi.tar.id=e.t.value
				}).p.p			
		.r('div class=field')
			.r('lable for=objhtml html=html').p
			.r('input id=objhtml')
				.on('keyup',function(e){
					oi.tar.innerHTML=e.t.value
				}).p.p
			
	oi.select=function(obj){
		oi.tar=obj
		oi.body.find('.objname').value=obj.tagName
		oi.body.find('#objclass').value=obj.className
		oi.body.find('#objid').value=obj.id
		oi.body.find('#objhtml').value=obj.innerHTML
	}
	
	//global triggers
	d.body
		.on('mouseover',function(e){
			if(!e.t.findup('.fc')) e.t.addclass('duihover')
		})
		.on('mouseout',function(e){
			if(!e.t.findup('.fc')) e.t.remclass('duihover')
		})
		.on('click',function(e){
			if(!(e.t.findup('.fc')||e.t.findup('.oi'))){
				if (dui.act) dui.act.remclass('duiact')
				dui.act=e.t	
				oi.select(e.t)
				e.t.addclass('duiact')
				
				var inf=[e.t.tagName,e.t.id,e.t.className.replace('duiact','').replace('duihover','')].join(' : ')
				fc.body.title=inf
				fc.info.innerHTML=inf
			}
		})
		.on('mousemove',function(e){
			fc.move(e)
			drag.dodrag(e)
		})
		.on('keydown',function(e){
			dui.keydown=e.keyCode			
		})
		.on('keyup',function(e){
			console.log('keyup:',dui.keydown)
			dui.keydown=''
			var k=e.keyCode			
			
			//if(dui.act && dui.act.style.position=='absolute') dui.act.style.position=''
			if(k==37){				
				if(dui.act.style.float=='left') {
					dui.act.style.float=''
				} else {
					dui.act.style.float='left'
				}				
			} else if(k==39){				
				if(dui.act.style.float=='right') {
					dui.act.style.float=''
				} else {
					dui.act.style.float='right'
				}				
			} else if(k==38){				
				if(dui.act.style.width=='auto') {
					dui.act.style.width='100%'
				} else {
					dui.act.style.width='auto'
				}				
			} else if(k==40){				
				if(dui.act.style.float=='right') {
					dui.act.style.float=''
				} else {
					dui.act.style.float='right'
				}				
			}			
		})
	var drag={
		start:0,
		type:0,
		off:{
			x:0,
			y:0
		},
		t:0,
		dodrag:function(e){
			if(drag.start){
				if(drag.type=='resize'){
					drag.t.style.width=e.pageX-drag.start.x
					drag.t.style.height=e.pageY-drag.start.y
				} else if (drag.type=='move'){
					drag.t.style.left=e.pageX-drag.off.x
					drag.t.style.top=e.pageY-drag.off.y					
				}
			}
		}
	}
	
	d.body
		.on('mousedown',function(e){
			if(dui.keydown==65){
				if(e.t.hasclass('duiact')){				
					drag.start={
						x:e.pageX,
						y:e.pageY
					}			
					drag.type='resize'
					var ele=e.t.r('div class=newele')	
						.s('position:absolute')
					
					var pos={
						x:e.pageX,
						y:e.pageY
					}
					ele.setpos(pos,d.body)
					/*ele.set('style',{
						left: (e.pageX-ele.p.offsetLeft)+'px',
						top: (e.pageY-ele.p.offsetTop)+'px'
					})
					/**/
					drag.t=ele
					e.preventDefault()
				}
			} else {
				drag.start={
					x:e.pageX,
					y:e.pageY
				}
				var pos=e.t.getpos(d.body)
				drag.off.x=e.pageX-pos.x
				drag.off.y=e.pageY-pos.y
				drag.t=e.t
				drag.type='move'				
			}
		})
		.on('mouseup',function(e){
			//drag.t.remclass('newele')
			if(drag.start){
				console.log('drag end')
				drag.start=0
				drag.t=0
			}
		})
	
	//add styles
	;(function(){
		var css=dss.new('duicss'),
			font='font: bold 14px Open Sans Condensed, sans-serif',
			color='color:#666',
			ucase='text-transform:uppercase'
			
		css.new('body',
			'margin: 0px',
			'width:100%',
			'height:100%',
			'background:#eee'
		)
		css.new('body,input,select,button,div,span,ul,li,table,tr,ts,th',
			font,
			color,
			ucase,
			'box-sizing:border-box'
		)
		css.new('input',
			'border:2px solid #aaa',
			'margin:0px',
			'padding:0px'
		)
		css.new('.fc .duiinfo',
			'text-align:center'
		)
		css.new('.fcbut',
			'display:table-cell',
			'text-align:center',
			'border:3px solid #ccc',
			'padding:0px',
			'background-color:#ddd',
			'width:48px',
			'height:48px'	
		)
		css.new('.duihover',
			'background-color:#FFE2AD!important'
		)
		css.new('.duiact',
			'background-color: #DAF0FF!important'
		)
		css.new('#dom0ui button',
			'text-align: center',
			'border: 2px solid #ccc',
			'background-color: #ddd'
		)
		css.new('.cols',
			'display: table'
		)
		css.new('.cols > * ',
			'display: table-cell'
		)
		css.new('.cont',
			'border: 2px solid #ddd'
		)
		css.new('.green',
			'background:green'
		)
		css.new('.red',
			'background:red'
		)
		css.new('.newele',
			'border: 1px solid red',
			'background:#fff'
		)
		css.show()
	})()			
})