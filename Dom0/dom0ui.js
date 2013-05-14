/* requires dom0 */
(function(dom0){
	var db=document.body,
		dui={
		edit: false,
		act: 0,
		root: db.add('div',{
			id: 'dom0ui',
			style: {
				position: 'absolute',
				height: '100%',
				//width: '48px',
				backgroundColor: '#eee',
				top: 0,
				right: 0,
				boxSizing: 'border-box'
			}
		}),
		dist: function(p1,p2){
			var dx=p1.x-p2.x,
				dy=p1.y-p2.y;
			return dist=Math.sqrt(dx*dx+dy*dy)
		}
	}	
	/*
	document.body.add('div',{
		class: 'floatingcontrols',		
		html:'<div class="cols"><button>7</button><button>8</button><button>9</button></div>'+
			 '<div class="cols"><button>4</button><button>5</button><button>6</button></div>'+
			 '<div class="cols"><button>1</button><button>2</button><button>3</button></div>',			 
		style:{
			position: 'absolute'
		}
			 
	})
	/**/
	dui.drawfloatingcontrols=function(mode){
		if (dui.floatingcontrols) dui.floatingcontrols.rem();
		fc=db.add('div',{
			class: 'floatingcontrols',
			style: {
				position: 'absolute',
				opacity: 0.2
			},
			onmouseover: function(){
				this.set('style',{
					opacity: 1
				})
			},
			onmouseout: function(){
				this.set('style',{
					opacity: 0.2
				})			
			}
		})
		switch(mode){
			case 'nav':
				var cols=3,
					rows=3,
					names=[{
						name: 'add',
						style: {
							borderRadius: '10px',
						}
					},
					{
						name: 'parent',
						style: {
							borderRadius: '10px 10px 0px 0px',
						}
					},					
					{
						name: 'rem',
						style: {
							borderRadius: '10px',
						}
					},					
					{
						name: 'prev',
						style: {
							borderRadius: '10px 0px 0px 10px',
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
							borderRadius: '0px 10px 10px 0px',
						}
					},					
					{
						name: 'copy',
						style: {
							borderRadius: '10px',
						}
					},					
					{
						name: 'children',
						style: {
							borderRadius: '0px 0px 10px 10px',
						}
					},					
					{
						name: 'to',
						style: {
							borderRadius: '10px',
						}
					}],
					count=0;
				var style;
				loop(rows,function(ind){
					div=fc.add('div',{
					})
					loop(cols,function(ind2){
						style={
								display: 'table-cell',
								fontFamily: 'Open Sans Condensed, sans-serif',
								fontWeight: 'bold',
								textTransform: 'uppercase',
								textAlign: 'center',
								border: '2px solid #ccc',
								padding: '0px',
								fontSize: '9px',
								backgroundColor: '#ddd',
								color: '#666'
							};
						dom0.extend(style,names[count].style);
						div.add('button',{
							html: names[count].name,//(cols*rows+1)-(((cols+1)-(ind2+1))+ind*cols),
							style: style
						})
						count++;
					})
				})
				break;
		}
		return fc;
	}
	dui.floatingcontrols=dui.drawfloatingcontrols('nav');
	dui.root.add('button',{
		html: 'nav',
		style: {
			width: '48px',
			height: '48px',
			display: 'block',
			borderRadius: '10px'
		},
		onclick: function(e){
			console.log('nav mode');
		}
	})
	dui.root.add('button',{
		html: 'layo',
		style: {
			width: '48px',
			height: '48px',
			display: 'block',
			borderRadius: '10px'
		},
		onclick: function(e){
			console.log('placement mode')
		}
	})
	dui.root.add('button',{
		html: 'style',
		style: {
			width: '48px',
			height: '48px',
			display: 'block',
			borderRadius: '10px'
		},
		onclick: function(e){
			console.log('style mode')
		}
	})
	
	dui.loop=function(){
		dui.timo=setTimeout(function(){			
			dui.loop();
		},16);
	}
	dui.loop();
	
	//global triggers
	db.set({
		'onmouseover': function(e){
			e.target.add('class','hover');
		},
		'onmouseout': function(e){
			e.target.rem('class','hover');
		},
		'onclick': function(e){
			
			if (dui.act) dui.act.rem('class','act');
			dui.act=e.target;		
			e.target.add('class','act');
		},
		'onmousemove': function(e){
			var cstyle=window.getComputedStyle(dui.floatingcontrols),
				shift={
					x: parseInt(cstyle.width)/2,
					y: parseInt(cstyle.height)/2
				},
				mpos={
					x:e.pageX-shift.x,
					y:e.pageY-shift.y
				},				
				cpos={
					x:dui.floatingcontrols.offsetLeft,//+parseInt(cstyle.width)/2,
					y:dui.floatingcontrols.offsetTop//+parseInt(cstyle.height)/2
				},
				dist=dui.dist(mpos,cpos);
				
			if (dist>256){
				var off={
					x: (cpos.x+(mpos.x-cpos.x)/32),
					y: (cpos.y+(mpos.y-cpos.y)/32)
				}
				
				dui.floatingcontrols.set('style',{
					top: (off.y)+'px',
					left: (off.x)+'px'
				})
			}
		}
		
	})
	dom0.ui=dui;
}(dom0))
