/* requires dom0 */
var dui;
document.onready(function(){	
	(function(){	
		var db=document.body;
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
			},
			sheets: {},
			addsheet: function(id,conf){
				sheet={
					id: id,
					styles: [],
					addstyle: function(style){
						if (style.selector){						
							this.styles.push(style);
						} else {
							console.log('style selector missing');
						}
					},
					render: function(){
						var sheet=document.body.parentNode.find('#'+this.id),
							style,
							val;
							
						if (sheet) sheet.rem()
						sheet=document.head.add('style',{
							id: this.id
						})
						
						for(var key in this.styles){
							style=this.styles[key];
							sheet.innerHTML+=style.selector+'{\n';
							for(var name in style){
								switch (name){
									case('selector'):
										break;
									default:
										val=style[name];
										sheet.innerHTML+='\t'+name+':'+val+';\n';
										break;
								}
							}
							sheet.innerHTML+='}\n';
							sheet.innerHTML=unescape(sheet.innerHTML)
						}
					}
					
				};
				
				document.extend(sheet,conf);
				this.sheets[id]=sheet;			
				return sheet;
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
					for(var nr in rows){
						div=fc.add('div',{
						})
						for(var nr2 in cols){
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
							document.extend(style,names[count].style);
							div.add('button',{
								html: names[count].name,//(cols*rows+1)-(((cols+1)-(ind2+1))+ind*cols),
								style: style
							})
							count++;
						}
					}
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
					
				if (dist>180){
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
	}())
})