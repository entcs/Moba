var d=document
//node
Node.prototype.find=function(sel){
	return this.querySelector(sel)
}
Node.prototype.findall=function(sel){	
	return this.querySelectorAll(sel)
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
				if(e.t.hasclass(tsel.substr(1))) fn(e)
			} else if (tsel[0]=='#') {
				if(e.t.id==tsel.substr(1)) fn(e)
			} else if (e.t.tagName.toLowerCase()==tsel){
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
Element.prototype.findup=function(sel){
	if(this==document.body.p || !sel){
		return false
	} else {
		if(sel[0]=='.'){
			if(this.p.hasclass(sel.substr(1))){
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
	if(a=='class' || a=='c'){
		this.addclass(v)
	} else if(a=='html' || a=='h'){
		this.innerHTML=v
	} else if(a=='value' || a=='val' || a=='v'){
		this.value=v
	} else {
		this.setAttribute(a,v)
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
Element.prototype.addclass=function(n){
	var cl=this.className.split(' '),
		nl=n.split(' ');
	if (cl[0]=='') cl.shift()
	loop(nl,function(i,n){
		if (cl.indexOf(n)==-1){
			cl.push(n)
		}
	})	
	this.className=cl.join(' ');
	return this;
}
Element.prototype.remclass=function(n){
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
Element.prototype.hasclass=function(n){
	var nl=this.className.split(' '),
		ns=n.split(' '),
		o=1;
	for(var nr in ns){
		n=ns[nr]
		if (nl.indexOf(n)==-1){
			o=0
		}
	}
	return o;
}
Element.prototype.r=function(str){
	var ele=document.r(str)
	ele.to(this)
	return ele
}
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
Element.prototype.__defineGetter__("p", function(){
	return this.parentNode;
})
Element.prototype.__defineSetter__("p", function(p){
	this.to(p)
})
Element.prototype.__defineGetter__("val", function(){
	if(this.type=='checkbox' || this.type=='radio'){
		return this.checked
	} else {
		return this.value
	}
})
Element.prototype.__defineSetter__("val", function(val){
	if(this.type=='checkbox' || this.type=='radio'){
		this.checked=val
	} else {
		this.value=val
	}
})
Element.prototype.__defineGetter__("tag", function(){
	return this.tagName.toLowerCase()
});
Element.prototype.h=function(val){
	if (val) {
		this.innerHTML=val
		return this
	} else {
		return this.innerHTML
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
		
	fields=fields.concat(this.findall('input').toarray())	
	fields=fields.concat(this.findall('select').toarray())
	fields=fields.concat(this.findall('textarea').toarray())
	
	loop(fields,function(i,field){				
			if(fn){
				val=fn(field)
			} else {
				val=field.val				
			}
			if(!(field.type=='radio' && !val)){
				data[field.id]=field.val
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
				field.val=fn(field)
			} else {
				field.val=v
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
Event.prototype.__defineGetter__("t", function(){
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
		ppos=this.p.getpos(d.body)
		var x=pos.x-ppos.x,
			y=pos.y-ppos.y
		this.style.left=x+'px'
		this.style.top=y+'px'
	} else {
		this.style.left=pos.x+'px'
		this.style.top=pos.y+'px'
	}
}	
//Array helpers
Arr={
	last:function(){
		return this[this.length-1]
	},
	pick:function(count){
		var res=[]
		count=count||1
		if(count<this.length){
			var arr=this.slice(),				
				val=arr.length
				
			loop(count,function(i){			
				loop(function(i2){
					val=Math.floor(Math.random()*arr.length)				
					if(val!=arr.length) return false
				})				
				res.push(arr.splice(val,1)[0])
			})					
		}
		return res		
	}
}
//number
Number.prototype.px=function(){
	return this+'px'
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
d.on('ready',function(e){//style setters and getters
	var styles=window.getComputedStyle(d.body)
	loop(styles,function(name,val){
		Element.prototype.__defineGetter__(name, function(){
			return window.getComputedStyle(this)[name]
		})
		Element.prototype.__defineSetter__(name, function(val){
			this.style[name]=val
		})			
	})		
})		
d.extend=function(o1,o2){
	for(var k in o2) o1[k]=o2[k]
}
d.on('DOMContentLoaded',function(){
	document.trigger('ready')
})	
d.new=function(tag,attrs){
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
d.r=function(str){
	var split=str.split('='),
		parts,
		tonext,
		tothis,
		ele
		
	loop(split,function(i,part){
		parts=part.split(' ')
		if(i==0){
			ele=d.new(parts.shift())
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
d.len=function(o){
	var len=0
	loop(o,function(k,v,i){
		len=i+1
	})
	return len
}
//dynamic style sheets
d.dss={
	sheets:{},
	new:function(id){
		var sh={
			id:id,
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
			d.dss.rs(sh.id,sh.styles)
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
				var v3=d.dss.addprefixes(v2)
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
		'border-radius',			
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
		
		loop(d.dss.names,function(i,name){													
			if(str.indexOf(name)!=-1){
				loop(d.dss.prefixes,function(i2,pref){
					res.push(pref+str)
				})
			}
		})
		return res						
	},	
	addprefixstyles:function (name,val,ele){
		//add prefixes for inline styles
		loop(d.dss.names,function(i,n){
			if(name==n){
				loop(d.dss.prefixes,function(i,p){
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
//loop
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
//net
d.send=function(){
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
	} else if(len==3){
		var data=arguments[1]
		if(typeof(data)=='object') data=JSON.stringify(data)
		req.open('POST',url,true)
		req.setRequestHeader("X-Requested-With","XMLHttpRequest")
		req.send(arguments[1])
	}
	req.onreadystatechange=function(e){				
		if(req.readyState==4){// && req.status==200){
			callback(req.responseText)
		} else {
			//handle errors
		}
	}	
}
//node js homebrew dont use
d.add=function(path,filedata,fn){
	var data={
		type:'fs',
		action:'add',
		path:path,
		data:filedata
	}
	d.send(data,fn)		
}
d.rem=function(path,fn){
	var data={
		type:'fs',
		action:'rem',
		path:path
	}
	d.send(data,fn)			
},
d.get=function(path,fn){
	var data={
		type:'fs',
		action:'get',
		path:path
	}
	d.send(data,fn)					
}
d.getfiles=function(path,fn){
	var data={
		type:'fs',
		action:'getfiles',
		path:path
	}
	d.send(data,fn)						
}
d.set=function(path,filedata,fn){
	var send={
		type:'fs',
		action:'set',
		path:path,
		filedata:filedata
	}
	d.send(data,fn)					
}
d.getscript=function(path,fn){
	var script
	d.get(path,function(res){		
		script=eval(res)		
		fn(script)
	})
}
//node js homebrew dont use

console.log('loaded dom0')