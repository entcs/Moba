/*
example
var endbut=document.body.r('div class=endbut h=hello world')
	.s('width:64px height:64px background:url(ico64.png) -448px -192px position:absolute top:0px right:0px z-index:1')
	.on(press,function(e){
		console.log('end game')
		tac.endgame()
	})
*/

var loop=function(obj,fn){
	if(obj){
		if(fn===undefined){
			var count=0
			while(obj(count)!==false) count+=1		
		} else if(typeof(obj)=='number'){
			for(var nr=0;nr<obj;nr++) if(fn(nr)===false) break		
		} else if(obj.length){		
			for(var nr=0;nr<obj.length;nr++) if(obj.hasOwnProperty(nr)) if(fn(nr,obj[nr])===false) break					
		} else {
			for(var key in obj) if(fn(key,obj[key])===false) break		
		}	
	}
}
var ext=function(a,b){
	loop(b,function(k,v){
		a[k]=b[k]
	})
	return a
}
document.find = document.querySelector
document.findall = document.querySelectorAll
//node
Node.prototype.find=function(sel){
	return this.querySelector(sel)
}
Node.prototype.findall=function(sel){	
	return this.querySelectorAll(sel).toarray()
}
Node.prototype.trigger=function(n,a){
	var e = document.createEvent("HTMLEvents");
	e.initEvent(n, true, true ); // event type,bubbling,cancelable		
	if (a) e.args=a;
	this.dispatchEvent(e);	
	return this;
}
Node.prototype.on=function(name,fn,haveselector){
	var sel
	if(haveselector){			
		sel=fn			
		fn=haveselector
		this.addEventListener(name,function(e){				
			var tsel=sel				
			if(tsel[0]=='.'){
				if(e.target.hasc(tsel.substr(1))) fn(e)
			} else if (tsel[0]=='#') {
				if(e.target.id==tsel.substr(1)) fn(e)
			} else if (e.target.tagName.toLowerCase()==tsel){
				fn(e)
			}
			
		},false);
		
		if (!this.eventfunctions) this.eventfunctions={};
		this.eventfunctions['efn-'+name+sel]=fn;
		
	} else {
		//this.addEventListener(name,fn, f || false);
		this.addEventListener(name,fn,false);
		if (!this.eventfunctions) this.eventfunctions={};
		this.eventfunctions['efn-'+name]=fn;		
	}
	return this;
}
Node.prototype.off=function(n,fn,f){
	var fn=this.eventfunctions['efn-'+n];
	this.removeEventListener(n,fn, f || false);
	return this;
}
//element
Element.prototype.closest = Element.prototype.findup=function(sel){
	if(this==document.body.p || !sel){
		return false
	} else {
		if(sel[0]=='.'){
			if(this.p.hasc(sel.substr(1))){
				return this.p
			} else {
				return this.p.findup(sel)
			}
		} else if(sel[0]=='#'){
			if(this.p.id==sel.substr(1)){
				return this.p
			} else {
				return this.p.findup(sel)
			}
		} else {
			if(this.p.tagName.toLowerCase()==sel){
				return this.p
			} else {
				return this.p.findup(sel)
			}
		}
	}
}
Element.prototype.next=function(changescope){
	var found=false;
	if (changescope){
		found=this.children[0] || this.nextSibling;
		if (found==null){
			var obj=this;
			//stop if document
			while (found==null){
				obj=obj.parentElement;
				if (obj==document.body){
					found=document.body;
				} else {
					found=obj.nextSibling;
				}
			}
		}		
	} else {
		found=this.nextSibling;
	}
	return found;
}
Element.prototype.prev=function(changescope){
	var found=false;	
	if (changescope){
		found=this.children[this.children.length-1] || this.previousSibling;
		if (found==null){
			var obj=this;
			//stop if body
			while (found==null){
				obj=obj.parentN;
				if (obj==document.body){
					found=document.body;
				} else {
					found=obj.previousSibling;
				}
			}
		}
		
	} else {
		found=this.previousSibling;
	}
	return found;
}
Element.prototype.to=function(parent,l){
	var p=parent.parentElement;
	switch(l){		
		case 'first':
			if (parent.children.length){
				parent.insertBefore(this,parent.children[0])				
			} else {
				parent.appendChild(this);
			}
			break;
		case 'before':
			p.insertBefore(this,parent);
			break;
		case 'after':
			p.insertBefore(this,parent.nextSibling);
			break;			
		default:
			parent.appendChild(this);
	}
	return this;
}
Element.prototype.new=function(tag,attrs,loc){
	var ele=document.createElement(tag);
	ele.tn=document.createTextNode('')
	if (attrs) {
		if(typeof(attrs)=='string') {
			ele.innerHTML=attrs
		} else {
			ele.set(attrs)			
		}
	}
	ele.to(this,loc);
	return ele;		
}
Element.prototype.rem=function(){
	this.parentNode.removeChild(this);
	return this
}
Element.prototype.set = function (a,v) {
	if(v===undefined){
		this.removeAttribute(a)
	} else {
		if(a=='class' || a=='c'){
			this.c(v)
		} else if(a=='html' || a=='h'){
			this.innerHTML=v
		} else if(a=='value' || a=='val' || a=='v'){
			this.value=v
		} else {
			this.setAttribute(a,v)
		}
	}
	return this
}
Element.prototype.get = function (a){
	if(a=='class' || a=='c'){
		return this.className
	} else if(a=='html' || a=='h'){
		return this.innerHTML
	} else if(a=='value' || a=='val' || a=='v'){
		return this.value
	} else {
		return this.getAttribute(a)
	}
}
Element.prototype.show = function () {			
	this.style.display = this.display || window.getComputedStyle(this).display;
	delete this.display;
	var e = document.createEvent("HTMLEvents");
	e.initEvent('show', true, true ); // event type,bubbling,cancelable
	this.dispatchEvent(e);		
};
Element.prototype.hide = function () {
	if(this.style.display!='none'){
		this.display=window.getComputedStyle(this).display;
		this.style.display = 'none';
		var e = document.createEvent("HTMLEvents");
		e.initEvent('hide', true, true ); // event type,bubbling,cancelable
		this.dispatchEvent(e);		
	}
};
Element.prototype.isvis=function(toggle){
	if (toggle=='toggle'){
		this.isvis() == true ? this.hide() : this.show()
	}
	return this.style.display == 'none'?false:true
}
//class
Element.prototype.getc = Element.prototype.addc = Element.prototype.c=function(n){
	if(n===undefined){
		return this.className
	} else {
		var cl=this.className.split(' '),
			nl=n.split(' ');
		if (cl[0]=='') cl.shift()
		loop(nl,function(i,n){
			if (cl.indexOf(n)==-1){
				cl.push(n)
			}
		})	
		this.className=cl.join(' ')
		return this
	}	
}
//removeclass
Element.prototype.remc=function(n){
	if (n){
		var nl=this.className.split(' ');
		if (n.indexOf(' ')!=-1){
			var vl=n.split(' '),
				i;
			for (var nr in vl){
				i=nl.indexOf(vl[nr]);
				nl.splice(i,1);						
			}
		} else {
			var i=nl.indexOf(n);
			if(i!=-1) nl.splice(i,1);
		}
		this.className=nl.join(' ');			
	} else {
		this.className='';
	}
	return this;	
}
//hasclass
Element.prototype.hasc=function(n){
	return this.className.split(' ').indexOf(n)+1
}
//toggle calss
Element.prototype.togglec = function(b){
	this.hasc(b) ? this.remc(b) : this.c(b)
}


//render
Element.prototype.r=function(str){
	var ele=document.r(str)
	ele.to(this)
	return ele
}
//style
Element.prototype.s=function(str){
	var split=str.split(':'),
		parts,
		tonext,
		tothis,
		ele=this
		
	loop(split,function(i,part){
		parts=part.split(' ')
		if(i==0){
			tonext=parts[0]
		} else {
			tothis=tonext
			if(i!=split.length-1)tonext=parts.pop()
			ele.style[tothis]=parts.join(' ')
		}
	})
	return this
}
Element.prototype.__defineGetter__("tag", function(){
	return this.tagName.toLowerCase()
})
Element.prototype.__defineGetter__("p", function(){
	return this.parentNode;
})
//text
Element.prototype.t=function(v){
	if (v===undefined) {
		return this.innerText
	} else {
		this.innerText=v
		return this		
	}
}
//html
Element.prototype.h=function(v){
	if (v===undefined) {
		return this.innerHTML
	} else {
		this.innerHTML=v
		return this
	}
}
Element.prototype.fn=function(callback){
	callback(this)
	return this
}
Element.prototype.getform=function(fn){
	//fn(field){} for altering values
	var data={},
		name,
		fields=[],
		val
		
	fields=fields.concat(this.findall('input'))	
	fields=fields.concat(this.findall('select'))
	fields=fields.concat(this.findall('textarea'))
	
	loop(fields,function(i,field){				
			if(fn){
				val=fn(field)
			} else {
				val=field.val				
			}
			if(!(field.type=='radio' && !val)){
				data[field.id]=field.val()
			}
	})
	return data
}
Element.prototype.setform=function(json,fn){
	//fn(field){} for altering values
	if(typeof(json)=='string'){
		json=JSON.parse(json)
	}
	var field,
		ele=this
	loop(json,function(k,v){
		field=ele.find('#'+k)
		if(field){
			if(fn){
				field.val(fn(field))
			} else {
				field.val(v)
			}
		}
	})
	
}
Element.prototype.caret=function(start,end){
	if(end){
		this.setSelectionRange(start,end)
	} else if (start){
		/*
		var range = this.createTextRange()
		range.collapse(true)
		range.moveEnd('character', start)
		range.moveStart('character', start)
		range.select()
		/**/
		//this.focus()
		this.setSelectionRange(start,start)
	} else {
		return this.selectionStart
	}
}
Element.prototype.append=function(obj){
	this.appendChild(obj)
	return this
}
Element.prototype.loop=function(obj,fn){
	if(obj){
		if(fn===undefined){
			var count=0
			while(obj(this,count)!==false) count+=1		
		} else if(typeof(obj)=='number'){
			for(var nr=0;nr<obj;nr++) if(fn(this,nr)===false) break		
		} else if(obj.length){		
			for(var nr=0;nr<obj.length;nr++) if(obj.hasOwnProperty(nr)) if(fn(this,nr,obj[nr])===false) break					
		} else {
			for(var key in obj) if(fn(this,key,obj[key])===false) break		
		}	
	}
	return this
}
Element.prototype.getstyle=function(style){
	return window.getComputedStyle(this)[style]
}
Element.prototype.toggle=function(style,val1,val2){
	var val=this.getstyle(style)
	if(val2){
		if(val==val2){
			this.style[style]=val1
		} else {
			this.style[style]=val2
		}
	} else if(val==val1){
		this.style[style]=''
	} else {
		this.style[style]=val1
	}
}
Element.prototype.val=function(a){
	if(a===undefined){
		return this.value
	} else {
		this.value=a
		return this
	}
}
//Nodelist
NodeList.prototype.toarray=function(){
	var arr = [];
	for (var i = 0, ref = arr.length = this.length; i < ref; i++) {
		arr[i] = this[i];
	}
	return arr;
}
//ff nodelist
HTMLCollection.prototype.toarray=function(){
	var arr = [];
	for (var i = 0, ref = arr.length = this.length; i < ref; i++) {
		arr[i] = this[i];
	}
	return arr;
}
//Event
Event.prototype.__defineGetter__("tXXX", function(){
	return this.target
})
Element.prototype.getpos=function(tar){		
	var pos={
			x:this.offsetLeft,
			y:this.offsetTop
		}
	if(tar && this!=tar){
		pos=this.p.getpos(tar)	
		pos.x+=this.offsetLeft
		pos.y+=this.offsetTop
	}
	return pos
}	
Element.prototype.setpos=function(pos,tar){	
	if(tar){
		ppos=this.p.getpos(document.body)
		var x=pos.x-ppos.x,
			y=pos.y-ppos.y
		this.style.left=x+'px'
		this.style.top=y+'px'
	} else {
		this.style.left=pos.x+'px'
		this.style.top=pos.y+'px'
	}
}	
//getbounds
Element.prototype.getbounds = Element.prototype.getBoundingClientRect

Element.prototype.clone=function(){
	var html = this.outerHTML,
		ele = document.createElement(this.tagName)
	ele.innerHTML = html.trim()		
	return ele.firstChild
}

//number
Number.prototype.px=function(){
	return this+'px'
}
Number.prototype.round=function(rounding){
	rounding=rounding || 0
	var r=Math.pow(10,rounding)
	return Math.round(this*r)/r
}
//string
String.prototype.int=function(){		
	return parseInt(this.replace('px',''))
}
String.prototype.float=function(){		
	return parseFloat(this.replace('px',''))
}
String.prototype.splice=function(index,count,add){
	add=add || ''
	var text=this.toString()
	text=text.slice(0,index)+add+text.slice(index+count)
	return text
}
//document
document.on('ready',function(e){//style setters and getters
	var styles=window.getComputedStyle(document.body)
	loop(styles,function(name,val){
		Element.prototype.__defineGetter__(name, function(){
			return window.getComputedStyle(this)[name]
		})
		Element.prototype.__defineSetter__(name, function(val){
			this.style[name]=val
		})			
	})		
})		
document.on('DOMContentLoaded',function(){
	document.trigger('ready')
})	
document.new=function(tag,attrs){
	var ele
	if(tag=='check'){
		ele=document.createElement('input')
		ele.set('type','checkbox')
	} else if(tag=='radio'){
		ele=document.createElement('input')
		ele.set('type','radio')	
	} else {
		ele=document.createElement(tag)
	}
	//ele.tn=document.createTextNode('')
	if (attrs) ele.set(attrs)
	return ele
}
document.r=function(str){
	var split=str.split('='),
		parts,
		tonext,
		tothis,
		ele
		
	loop(split,function(i,part){
		parts=part.split(' ')
		if(i==0){
			ele=document.new(parts.shift())
			if(parts) tonext=parts[0]
		} else {
			tothis=tonext
			if(i!=split.length-1) tonext=parts.pop()				
			ele.set(tothis,parts.join(' '))
		}
	})
	//ele.to(this)
	return ele
}	
//dynamic style sheets
document.dss={
	sheets:{},
	new:function(id){
		var sh={
			id:id,
			styles:{}
		}
		sh.body=document.head.r('style id='+id)
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
			document.dss.rs(sh.id,sh.styles)
		}
		sh.hide=function(){
			var t=document.head.find('#'+sh.id)
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
		var ele=document.find('#'+id) || document.r('style id='+id),
			str=''
		ele.to(document.head)				
		loop(sheet,function(k,v,i){
			str+=k+'{\n'
			loop(v,function(i2,v2){					
				var v3=document.dss.addprefixes(v2)
				loop(v3,function(i,style){
					str+='\t'+style+';\n'
				})
				//str+='\t'+v2+';\n'
			})
			str+='}\n'
		})
		ele.h(str)
		return ele
	},
	names:[
		'transition',			
		'box-shadow'			
	],
	prefixes:[
		'-webkit-',
		'-moz-',
		'-o-'
	],
	addprefixes:function (str){
		//prefixes
		var res=[str]
		
		loop(document.dss.names,function(i,name){													
			if(str.indexOf(name)!=-1){
				loop(document.dss.prefixes,function(i2,pref){
					res.push(pref+str)
				})
			}
		})
		return res						
	},	
	addprefixstyles:function (name,val,ele){
		//add prefixes for inline styles
		loop(document.dss.names,function(i,n){
			if(name==n){
				loop(document.dss.prefixes,function(i,p){
					ele.style[p+name]=val
				})
			}
		})
	},	
	stylenaming:function(str){		
		//ff uppercase
		var ind=str.indexOf('-'),
			chunk,
			ch
		if(ind!=-1){
			ch=str[ind+1]
			chunk='-'+ch
			str=str.replace(chunk,ch.toUpperCase())
		}			
		return str
	}		
}

//net
document.send=function(){
	//url,fn
	//url,data,fn
	var len=arguments.length,
		req=new XMLHttpRequest(),
		callback=arguments[2] || arguments[1],
		url=arguments[0]
		
	if(typeof(url)=='object') url=JSON.stringify(url)
		
	if(len==2){
		req.open('GET',url,true)
		req.setRequestHeader("X-Requested-With","XMLHttpRequest")
		req.send()
	} else if(len>=3){
		var data=arguments[1]
		if(typeof(data)=='object') data=JSON.stringify(data)
		req.open('POST',url,true)
		req.setRequestHeader("X-Requested-With","XMLHttpRequest")		
		if(arguments[3]=='json'){
			req.setRequestHeader('Content-Type','application/json;charset=UTF-8')
		}
		req.send(data)
	}
	req.onreadystatechange=function(e){				
		if(req.readyState==4){// && req.status==200){
			callback(req.responseText)
		} else {
			//handle errors
		}
	}	
}
document.hash = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0).toString(16)              
}
//unigue id
document.uidcount=0
document.uid=function(){	
	var time=new Date().getTime()
		uid=[time.toString(16),(time+document.uidcount).toString(16)].join('')
	document.uidcount+=1
	document.uidcount%=Number.MAX_VALUE
	return uid
}
document.rng=function(nr){
	if(nr && nr!=1){
		var rnr=Math.floor(Math.random()*nr)
		if(rnr==nr){
			rnr=document.rng(nr)
		}
	} else {
		return Math.random()
	}
	return rnr
}

//draggable
document.on('mousedown',function(e){
	var d = e.target.closest('.draggable') || (e.target.hasc('draggable') ? e.target : '')
	if(d){
		console.log('mousedown',e)
		e.preventDefault()
		e.stopPropagation()
		var bounds = d.getbounds()
		d.draggingshift={
			x:bounds.left-e.clientX,
			y:bounds.top-e.clientY
		}
		document.draggable = d
	}
})
document.on('mousemove',function(e){
	var d=document.draggable	
	if(d){
		
		d.style.left=(e.clientX+d.draggingshift.x)+'px'
		d.style.top=(e.clientY+d.draggingshift.y)+'px'
	}
})
document.on('mouseup',function(e){
	var d=document.draggable
	if(d){}
	document.draggable=''
})


console.log('loaded dom0')