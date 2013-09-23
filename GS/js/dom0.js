var d=document,
	dss,
	dom0

(function(){//dom0
	//string to arguments for render and styles
	function stoa(obj,s,sep){	
		var tonext,
			tothis,
			ele,
			stl
		s=s.split(sep)
		for(var ind in s){
			ele=s[ind]
			ele=ele.split(' ')
			if(ind==0){
				if(sep=='=') {
					obj=d.new(ele[0])
					if(ele.length>1) {
						ele.shift()
						tonext=ele[0]
					}
				} else {
					tonext=ele[0]
				}			
			} else {					
				tothis=tonext
				if(ind!=s.length-1){
					if(ele.length>1) {
						tonext=ele.pop()
					}				
				}
				if(sep=='=') {
					obj.set(tothis,ele.join(' '))				
				} else {					
					stl={}
					stl[tothis]=ele.join(' ')
					obj.set('style',stl)
				}
			}
		}
		return obj	
	}
	//node
	Node.prototype.find=function(sel){
		return this.findall(sel)[0];
	}
	Node.prototype.findall=function(sel){	
		function findit(sel,tars){	
			var tars1=[];
			for (var nr in tars){
				var tar=[],
					ctar=tars[nr];
				switch (sel[0]){
					case '.':
						tar=ctar.getElementsByClassName(sel[1]);
						break;
					case '#':
						tar.push(document.getElementById(sel[1]) || '');
						break;
					default:
						tar=ctar.getElementsByTagName(sel[1]);
						break;
				}
				//return tar;
				if ('toarray' in tar){
					tar=tar.toarray()
				}					
				tars1=tars1.concat(tar);			
				//remove duplicates
				var nodup=[];
				for(var nr in tars1){
					if(nodup.indexOf(tars1[nr])==-1) nodup.push(tars1[nr]);
				}		
			}
			return nodup;
		}

		var sel=sel.split(' '),
			arr=[],
			csel='',
			found=[this];
					
		for(var nr=0;nr<sel.length;nr++){
			csel=sel[nr];
			if (csel[0]=='.' || csel[0]=='#') {
				csel=[csel[0],csel.substr(1,csel.length-1)]
			} else {
				csel=['',csel]
			}
			found=findit(csel,found);
		}		
		return  found;
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
	//document
	document.extend=function(o1,o2){
		for(var k in o2) o1[k]=o2[k];
	};
	document.on('DOMContentLoaded',function(){
		document.trigger('ready');
	})	
	document.new=function(tag,attrs){
		var ele=document.createElement(tag)
		ele.tn=document.createTextNode('')
		if (attrs) ele.set(attrs)
		return ele
	}
	document.r=function(s){
		return stoa(0,s,'=')
	}
	//element
	//Element.prototype.display='initial'
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
		if(this.parentNode) this.parentNode.removeChild(this)
		return this
	}
	Element.prototype.set = function (a,v) {
		if (typeof(a)=='object'){
			var v
			for (var k in a) {
				v = a[k]
				this.set(k,v)
			}
		} else {	
			var nn
			switch (a) {
				case 'html':
					this.innerHTML = v
					break;
				case 'style':
					for (var n in v) {						
						nn=n
						nn=stylenaming(n)
						addprefixstyles(nn,v[n],this)
						this.style[nn] = v[n]
					}
					break;
				default:
					this.setAttribute(a, v)
					break;
			}
		}
		return this
	}
	Element.prototype.get = function (n,n2){
		switch(n){
			case 'html':
				n=this.innerHTML;
				break;
			case 'style':
				if (n2) {
					n=this.style[n2];
				} else {
					n=this.style;
				}
				break;
			default:
				n=this.getAttribute(n)
				break;
		}	
		return n;
	};
	Element.prototype.show = function () {			
		if(this.style.display=='none') this.style.display=''
		this.style.display = this.display || window.getComputedStyle(this).display;
		delete this.display;
		var e = document.createEvent("HTMLEvents");
		e.initEvent('show', true, true ); // event type,bubbling,cancelable
		this.dispatchEvent(e)
		return this
	};
	Element.prototype.hide = function () {
		if(this.style.display!='none'){
			this.display=window.getComputedStyle(this).display;
			this.style.display = 'none';
			var e = document.createEvent("HTMLEvents");
			e.initEvent('hide', true, true ); // event type,bubbling,cancelable
			this.dispatchEvent(e);		
		}
		return this
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
		for(var nr in nl){
			n=nl[nr]
			if (cl.indexOf(n)==-1){
				cl.push(n)
			}
		}	
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
	Element.prototype.toggleclass=function(n){
		this.hasclass(n)==true?this.remclass(n):this.addclass(n)
	}
	Element.prototype.r=function(){
		var a=[]
		loop(arguments,function(i,e){
			a.push(e)
		})
		a=a.join(' ')
		return stoa(this,a,'=').to(this)
	}
	Element.prototype.s=function(){		
		var s=[]
		loop(arguments,function(i,e){
			s.push(e)
		})				
		s=s.join(' ')
		return stoa(this,s,':')
	}
	Element.prototype.__defineGetter__("p", function(){
		return this.parentNode;
	});
	Element.prototype.__defineSetter__("p", function(p){
		this.to(p)
	});
	Element.prototype.h=function(){
		if (arguments.length) {
			var a=[]
			loop(arguments,function(i,e){
				a.push(e)
			})
			a=a.join(' ')
			this.innerHTML=a
			return this
		} else {
			return this.innerHTML
		}
	}
	Element.prototype.fn=function(callback){
		callback(this)
		return this
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
		return this
	}
	
	console.log('loaded dom0');
		
	//drag drop
	var drag={
		tar:0,
		start:0,
		off:0
	}
	d.on('mousedown',function(e){	
		if(e.target.hasclass('drag') && e.which==1){			
			e.preventDefault()			
			var tar=e.target.findup('.dragtarget')
			if(!tar) tar=e.target						
			drag.tar=tar
			drag.start=tar.getpos()			
			drag.off={
				x:e.pageX-drag.start.x,
				y:e.pageY-drag.start.y
			}
			tar.s('position:absolute')			
				.s('left:'+drag.start.x+'px')
				.s('top:'+drag.start.y+'px')
		}
	})
	d.on('mouseup',function(e){
		if(e.which==1 && drag.tar){
			if(e.target.hasclass('drop')){
				
			}
			drag.tar=0
		}
	})
	d.on('mousemove',function(e){
		if(drag.tar){
			drag.tar.setpos({
				x:e.pageX-drag.off.x,
				y:e.pageY-drag.off.y
			})
		}
	})

	//dynamic style sheets
	dss={
		sheets:{},
		new:function(id){
			var sh={
				id:id,
				styles:{}
			}
			sh.body=d.r('style id='+id)
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
				return this
			}
			sh.show=function(){
				sh.hide()
				dss.rs(sh.id,sh.styles)
				return sh
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
			if(d.find('#'+id)) d.find('#'+id).rem()
			var ele=d.r('style id='+id),
				str=''
			ele.to(d.head)				
			loop(sheet,function(k,v,i){
				str+=k+'{\n'
				loop(v,function(i2,v2){					
					var v3=addprefixes(v2)
					loop(v3,function(i,style){
						str+='\t'+style+';\n'
					})
					//str+='\t'+v2+';\n'
				})
				str+='}\n'
			})
			ele.h(str)
			return ele
		}				
	}
	
	var names=[
			'transition',
			'border-radius',			
			'box-shadow'			
		],
		prefixes=[
			'-webkit-',
			'-moz-',
			'-o-'
		]
	
	//add prefixes for sheets
	function addprefixes(str){
		//prefixes
		var res=[str]
		
		loop(names,function(i,name){													
			if(str.indexOf(name)!=-1){
				loop(prefixes,function(i2,pref){
					res.push(pref+str)
				})
			}
		})
		return res						
	}
	//add prefixes for inline styles
	function addprefixstyles(name,val,ele){
		loop(names,function(i,n){
			if(name==n){
				loop(prefixes,function(i,p){
					ele.style[p+name]=val
				})
			}
		})
	}
	//ff uppercase
	function stylenaming(str){		
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
	console.log('loaded dss')
})();
//dnet
(function(){
	var dnet={
		get: function (url,ready,async){
			return dnet.XMLHR('GET',url,async,ready);
		},
		post: function (url,ready,async){
			return dnet.XMLHR('POST',url,async,ready);
		},
		XMLHR: function (method,url,async,ready){
			async=async || true;
			var req=new XMLHttpRequest();
			req.open(method,url,async);
			req.send();
			req.onreadystatechange=function(e){				
				if(req.readyState==4){// && req.status==200){
					if (req.ready) {
						req.ready(req.responseText)
					} else if (ready) {
						ready(req.responseText)
					}						
				}
			}
			
			return req;
		}	
	}	
	d.get=dnet.get
	d.post=dnet.post
	
})();
//dview
var dview=function(name,draw,to,keep){
	var v={
		draw:draw,
		html:0,
		r:function(to,keep){
			if(!keep && this.html) this.html.rem()
			this.html=d.r('div id='+name)
			if(this.draw) this.draw()
			if(to) this.html.to(to)
			return this.html
		}		
	}
	if(to) v.r(to,keep)
	return v
}