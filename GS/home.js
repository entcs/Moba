var gui={}	
d.on('ready',function(e){	
	var redfont='color:red';
	(function sheet1(){		
		var	font='font: bold 16px Open Sans Condensed, sans-serif',
			color='color:#666',			
			ucase='text-transform:uppercase',
			pointer='cursor:pointer'
			
		gui.sh1=dss.new('sheet1')
			.new('body',
				font,
				color,
				ucase,
				'margin:0px'
				//,'overflow:hidden'
			)
			.new('button',
				font,
				color,
				ucase,
				pointer,
				'border:2px solid #aaa'
			)
			.new('div',
				font,
				color,
				ucase
			)
			.new('.cont',
				'border:1px solid #fff',
				'background:#eee'
			)
			.new('.block',
				'display:block'
			)	
			.new('.big',
				'font-size:24px'
			)		
			.new('.iblock',
				'display:inline-block'
			)	
			.new('.cols',
				'display:table',
				//'table-layout:fixed',
				'width:100%'
			)	
			.new('.cols>*',
				'display:table-cell'
			)	
			.new('.rows',
				'display:table'
			)	
			.new('.rows>*',
				'display:table-row'
			)	
			.new('div, button',
				'box-sizing:border-box'
			)	
			.new('.item',
				'box-sizing:border-box',
				'height:64px',
				'width:64px',
				'margin:3px'
			)	
			.new('.but',				
				'border:1px solid #aaa',
				'border-radius:10px',
				'background:#eee',
				'padding:0px 6px',
				'margin:0px',
				pointer
			)	
			.new('input',				
				'border:1px solid #aaa',
				'border-radius:10px',
				'padding:0px 6px',
				'margin:0px',
				ucase,
				color,
				font
			)	
			.new('table',
				'border-spacing: 0',
				'border-collapse: collapse'
			)
			.new('td,th',
				'margin: 0',
				'padding: 0'
			)
			.new('.iblocks>*',
				'display:inline-block'			
			)
			/**/
			.show()		
	})()
	
	gui.html=d.body.r('div class=gui')
		.s('width:100% height:100% text-align:center')
		.r('div class=top cont')
			.s('position:absolute top:0px width:100%')
			.r('div class=battle').p.p
		.r('div class=mid cont').p
		.r('div class=bot cont')
			.s('position:absolute bottom:0px width:100%')
			.r('div class=social').p
	
	d.body.r('script src=social.js')
	d.body.r('script src=battle.js')
	d.body.r('script src=stats.js')
	d.body.r('script src=units.js')
	d.body.r('script src=modal.js')		
})
