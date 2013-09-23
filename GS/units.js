var units=dview('units',function(){
	this.html.r('div class=iblocks')
		.fn(function(o){
			loop(3,function(i){
				o.r('div class=but unit html=unit'+i)
					.s('background:url(./img/avatars.png) '+(-128*i)+'px 0px')
					.on('click',function(e){
						//units.unit.set('data')
						units.unit.r()
						modal.open(units.unit.html,'modalforunit')
							.html.find('.header')
								.h(this.innerHTML)
						
					})
			})
		})
},d.body.find('.bot'))
units.dss=dss.new('unitsdss')
	.new('.unit',
		'width:128px',
		'height:128px',
		'margin:10px'
	)
	.show()
units.unit=dview('unit',function(){
	this.html.r('div class=unitinfo')
		.r('div class=header html=unit name')
			.s('text-align:center')
		.r('div class=unitstats')
			.s('text-align:left')
			.r('div class=unitstats cols')
				.r('div class=but')
					.r('div class=hp html=hp: 1000').p					
					.r('div class=speed html=speed: 1000').p
					.r('div class=en html=energy: 1000').p.p
				.r('div class=but')
					.r('div class=ap html=ap: 1000').p
					.r('div class=armor html=armor: 1000').p.p					
				.r('div class=unitstats but')					
					.r('div class=sp html=sp: 1000').p
					.r('div class=resist html=resist: 1000').p.p.p.p
			.r('div class=unitabiliries but iblocks')
				.fn(function(o){
					loop(6,function(i){
						o.r('div class=but html=ability'+i)
							.s('width:64px height:64px margin:5px')
					})
				}).p
			.r('div class=unititems but iblocks')
				.fn(function(o){
					loop(6,function(i){
						o.r('div class=but html=item'+i)
							.s('width:64px height:64px margin:5px')
					})
				}).p
				
				
				
})
console.log('loaded units')