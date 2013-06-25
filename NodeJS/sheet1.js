var s=dss.add('sheet1')
dss.vars={
	dark: '#6C8541',
	light: '#9CC05E',
	border1: '2px solid #6C8541',
	font: 'Jolly Lodger'
}
s.add('html,body',{
	width: '100%',
	height: '100%'
})

s.add('body',{
	margin: '0px',
	'font-family': 'dss.font',
	'font-size': '24px',
	color: 'dss.dark'
})
s.add('.logowrap',{
	'text-align': 'center',
	'margin-top': '10px'
	
})
s.add('.logo',{
	'font-family': 'dss.font',
	'font-size': '64px',
	color:'dss.dark',
	margin: '0 auto',
	display: 'inline-block',
	'vertical-align': 'top',
	'line-height': '64px',
	'margin-right': '5px'
})
s.add('.logowrap .img',{
	background: 'url(/images/shell.png)',
	display: 'inline-block',
	width: '64px',
	height: '64px'	
})
s.add('.nav',{
	'text-align':'center',
	'padding':'10px 30px',
	border: 'dss.border1',
	'border-radius': '64px',
	margin: '0px auto 10px auto',
	display: 'table'
})
s.add('button',{
	border: '2px solid #fff',
	padding: '3px 12px',
	cursor: 'pointer',
	'border-radius': '64px',
	'font-family': 'dss.font',
	background: 'dss.dark',
	'font-size':'24px',
	color: '#fff',
	'-webkit-transition': 'all 0.5s'
	
})
s.add('button.selected',{
	border: 'dss.border1',
	background: '#fff',
	'font-size':'24px',
	color: '#6C8541'
	
})

s.add('.mapwrap',{
	padding: '10px',
	margin: '50px',
	'border-radius': '15px',
	border: 'dss.border1',
	width: '512px',
	margin: '0px auto'
})
s.add('.map',{
	width: '100%',
	'height': '512px',
})

//modal
/*
s.add('.modalwrap',{
	position: 'absolute'
})
/**/
s.add('.modal',{
	width: '512px',
	'border-radius': '64px',
	margin: '0 auto',
	'border-radius': '15px',
	border: 'dss.border1',
	background: '#DCFFA0'
})
s.add('.modal .header',{
	background: 'dss.light',
	'border-radius': '13px 13px 0px 0px',
	padding: '0px 10px',
	color: '#fff',
	position: 'relative'
})
s.add('.modal .header .close',{
	position: 'absolute',
	top: '-20px',
	right: '-20px'
})
s.add('.modal .content',{
	padding: '10px 10px'
})
s.add('.modal .controls',{
	'text-align':'right',
	padding: '10px'
})

//input
s.add('input,textarea',{
	border: 'dss.border1',
	'border-radius': '5px',
	padding: '4px',
	'box-sizing': 'border-box',
	'font-family': 'dss.font',
	'font-size': '24px',
	color: 'dss.dark',
	'max-width': '100%'
})


s.show();
console.log('loaded sheet1.js')