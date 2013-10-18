var codeeditor={
	new:function(name){
		var editor={
			html:'',
			lines:[],
			text:'',
			show:function(tar){				
				var html=d.body.r('div class=codeeditor')
				
				html.s('width:100% height:100%')
				html.addclass(name)
				html.r('textarea rows=10 class=code')
					.h("var f={\n\ta:[1,2,3,4,5,6],\n\tb:'adasdasdasd'\n}")
					.s('display:block width:100% max-width:100% margin:0px padding:0px')
					.on('keydown',function(e){			
						var tar=e.target,
							pos=tar.caret(),
							text=tar.val
						
						//console.log(e.which)
						if(e.which==9){
							tar.val=text.slice(0,pos)+'    '+text.slice(pos)
							tar.caret(pos+4)
							e.preventDefault()
							e.stopPropagation()
						} else if(e.which==8){//backspace
							var pchar=text[pos-1],
								count=0,
								over=0
								
							loop(function(i){
								pchar=text[pos-1-i]
								if(pchar!=' '){
									return false
								} else {
									count+=1
								}
							})
							if(count){
								over=(count-1)%4				
								if(over){
									tar.val=tar.value.splice(pos-over,over)
									tar.caret(pos-over)
								}
							}
						} else if(e.which==46){//del
							var pchar=text[pos-1],
								count=0,
								over=0
								
							loop(function(i){
								pchar=text[pos+i]
								if(pchar!=' '){
									return false
								} else {
									count+=1
								}
							})
							if(count){
								over=(count-1)%4				
								if(over){
									tar.val=tar.value.splice(pos,over)
									tar.caret(pos)
								}
							}
						}
					})
					.on('click',function(e){
						var pos=this.caret(),
							text=this.value,
							lines=text.substr(0,pos).split('\n')												
						console.log('x:',lines[lines.length-1].length,'y:',lines.length-1)
						
					})
					.p.r('button html=eval')
						.s('display:block width:100%')
						.on('click',function(e){
							eval.call(window,this.prev().val)
						})	
				this.html=html
				return html
			},
			hide:function(){
				this.html.rem()
				this.html=''
			}
		}
		this.list[name]=editor
		return editor
	},
	rem:function(name){},
	list:{},
	addevents:function(){}
}

d.on('ready',function(e){
	var ed1=codeeditor.new('ed1')
	ed1.show(d.body)
})
var sh1=d.dss.new('sheet1')
sh1.new('body,html',
	'width:100%',
	'height:100%',
	'margin:0px'
)
sh1.show()