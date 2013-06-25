var dss;
(function(){
	var d=document,
		addsheet=function(id){
			id=id || 'sheet'+new Date().getTime()				
			var sheet={
				id: id,
				styles: {},
				add:function(sel,args){
					return addstyle(sheet,sel,args)
				},
				rem:function(args){},
				hide:function(){
					this.ele.rem()
				},
				show:function(){
					//render styles
					var str='\n',
						style,
						val,
						spl
					
					for(var key in this.styles){							
						style=this.styles[key]
						if (!style.ishidden){
							str+=style.selector+' {\n'
							for(var k2 in style){
								switch(k2){
									case 'parent':
									case 'selector':
									case 'show':
									case 'hide':
									case 'comment':
									case 'ishidden':
									case 'rem':
									case 'set':
										break;
									default:
										val=style[k2]										
										spl=val.split('.')
										if (spl[0]=='dss') val=dss.vars[spl[1]]
										str+='\t'+k2+':'+val+';\n'									
										break;
								}
							}			
							str+='}\n'
						}
					}						
					this.ele.innerHTML=str
					d.head.appendChild(this.ele)
				},
				ele: d.createElement('style')
			}
			sheet.ele.id=id
			dss.sheets[id]=sheet			
			return sheet				
		},
		addstyle=function(sheet,sel,args){
			var style=null
			if (args){
				style={
					selector: sel || 'style'+new Date().getTime(),
					ishidden: false,
					parent: sheet,
					rem: function(update){
						delete this.parent.styles[this.selector]
						if (update) this.parent.show()
					},
					set: function(args,update){
						for( var k in args){
							this[k]=args[k]
						}
						if (update) this.parent.show()
					},
					show: function(update){
						this.ishidden=false
						if (update) this.parent.show()
					},
					hide: function(update){
						this.ishidden=true
						if (update) this.parent.show()
					}
				}
				for(var k in args){
					style[k]=args[k]
				}
				sheet.styles[style.selector]=style
			}
			return style
		
		};
	
	dss={
		sheets: {},
		reserved: {
			selector:0,
			parent: 0,
			show: 0,
			hide: 0
		},
		vars:{
			col1: 'green'
		},
		add: function(id){
			return addsheet(id)
		},
		rem: function(id){
			var sheet=this.sheets[id]
			if (sheet){
				sheet.ele.rem()
				delete this.sheets[id]
			}
		},
		load: function(){
			var sheet,
				sh,
				rule,
				st,
				str,
				id,
				kv,
				k,
				v;
				
			for(var nr in d.styleSheets){
				sheet=d.styleSheets[nr]
				if (sheet.ownerNode){
					id=sheet.ownerNode.id || 'sheet-'+new Date().getTime()
					sheet.ownerNode.id=id
					sh=this.add(id)
					for (var n2=0;n2<sheet.rules.length;n2++){
						rule=sheet.rules[n2]
						//rule.selectorText
						str=rule.cssText.split('{')[1].split('}')[0].split(';')
						str.pop()
						st={}
						for(var n3 in str){
							kv=str[n3].split(':')							
							k=kv[0].replace(/ /g,'')
							st[k]=kv[1]							
						}
						st=sh.add(rule.selectorText,st)
						console.log('st:',st);
					}
				}
			}
		}
	}
})()
/*
var sh1=dss.add('sh1')	

sh1.add('body',{
	background: 'dss.col1',
	margin: '0px'
})
sh1.add('.d1',{
	background: 'red'
})
sh1.show()
/**/
