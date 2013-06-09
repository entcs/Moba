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
Node.prototype.trigger=function(name,args){
	var e = document.createEvent("HTMLEvents");
	e.initEvent(name, true, true ); // event type,bubbling,cancelable		
	if (args) e.args=args;
	this.dispatchEvent(e);	
	return this;
}
Node.prototype.on=function(name,fn,flag){
	this.addEventListener(name,fn, flag || false);
	if (!this.eventfunctions) this.eventfunctions={};
	this.eventfunctions['efn-'+name]=fn;
	return this;
}
Node.prototype.off=function(name,fn,flag){
	var fn=this.eventfunctions['efn-'+name];
	this.removeEventListener(name,fn, flag || false);
	return this;
}
//document
/*
document.onready=function(fn){
	document.doonready.push(fn);
}
document.doonready=[];
document.onreadystatechange=function(fn){
	//console.log(document.readyState)
	document.trigger(document.readyState);
	//if (document.readyState=='complete') document.trigger('ready');
	
	if (document.readyState=='complete'){
		for(var nr in document.doonready){
			document.doonready[nr]();
		}
		document.doonready=[];
	}
}
/**/
document.extend=function(o1,o2){
	for(var k in o2) o1[k]=o2[k];
};
document.on('DOMContentLoaded',function(){
	document.trigger('ready');
})
//element
Element.prototype.findup=function(sel){
	if (!sel) {
		return this.parentNode;
	} else {
		var sel=sel.split(' '),
			arr=[],
			csel='';
				
		for(var nr=0;nr<sel.length;nr++){
			csel=sel[nr];
			if (csel[0]=='.' || csel[0]=='#') {
				arr.push([csel[0],csel.substr(1,csel.length-1)])
			} else {
				arr.push(['',csel])
			}
		}			
		var f=this.findargs({
			sel: arr,
			parent: 'up',
			found: false
		});
		return f.found;
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
Element.prototype.visibilityevent=true;
Element.prototype.to=function(parent,loc){
	var p=parent.parentElement;
	switch(loc){		
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
Element.prototype.add=function(tag,attr,loc){
		switch(tag){
			case 'class':
				var nlist=this.className.split(' ');
				if (attr.indexOf(' ')!=-1){
					dlist=attr.split(' ');
					for(var nr in dlist){
						nlist.push(dlist[nr]);
					}
				} else {
					nlist.push(attr);
				}
				this.className=nlist.join(' ');
				break;
			default:
				var ele=document.createElement(tag);
				if (attr) ele.set(attr);
				ele.to(this,loc);
				return ele;		
		}
}
Element.prototype.rem=function(key,val){
	switch (key){
		case 'class':
			if (val){
				var nlist=this.className.split(' ');
				if (val.indexOf(' ')!=-1){
					vlist=val.split(' ')
					var ind;
					for (var nr in vlist){
						ind=nlist.indexOf(vlist[nr]);
						nlist.splice(ind,1);						
					}
				} else {
					var ind=nlist.indexOf(val);
					nlist.splice(ind,1);
				}
				this.className=nlist.join(' ');			
			} else {
				this.className='';
			}
			return this;
			
		default:
			this.parentNode.removeChild(this);
			break;
	}	
}
Element.prototype.set = function (attr,val) {
    if (typeof(attr)=='object'){
		var val;
		for (key in attr) {
			val = attr[key];
			this.set(key,val);
		}
	} else {	
		switch (attr) {
			case 'html':
				this.innerHTML = val;
				break;
			case 'style':
				for (var name in val) {
					this.style[name] = val[name];
				}
				break;
			case 'onclick':
			case 'onmouseup':
			case 'onmousedown':
			case 'onkeypress':
			case 'onkeyup':
			case 'onkeydown':
			case 'onmousemove':
			case 'onmousewheel':
			case 'onmouseout':
			case 'onmouseover':
				this[attr]=val;
			break;
			default:
				this.setAttribute(attr, val);
				break;
		};
	}
};
Element.prototype.get = function (name,name2){
	switch(name){
		case 'html':
			attr=this.innerHTML;
			break;
		case 'style':
			if (name2) {
				attr=this.style[name2];
			} else {
				attr=this.style;
			}
			break;
		case 'class':
			if (name2) {
				console.log('return specific style:',name2);
				attr=this.getAttribute(name).indexOf(name2)+1;
			} else {	
				attr=this.getAttribute(name)
			}
			break;
		default:
			attr=this.getAttribute(name)
			break;
	}	
	return attr;
};
Element.prototype.hasclass=function(name){
	return this.get('class').indexOf(name)+1;
}
Element.prototype.show = function (tag) {	
	this.style.display = this.display || window.getComputedStyle(this).display;
	delete this.display;
	if (tag!=undefined) this.visibilityevent=tag;
	if (this.visibilityevent){
		var e = document.createEvent("HTMLEvents");
		e.initEvent('showhide', true, true ); // event type,bubbling,cancelable
		e.showhide='show';
		this.dispatchEvent(e);		
	}
};
Element.prototype.hide = function (tag) {
	this.display=window.getComputedStyle(this).display;
	this.style.display = 'none';
	if (this.visibilityevent){
		var e = document.createEvent("HTMLEvents");
		e.initEvent('showhide', true, true ); // event type,bubbling,cancelable
		e.showhide='hide';
		this.dispatchEvent(e);		
	}	
};

//Nodelist
NodeList.prototype.toarray=function(){
	var arr = [];
	for (var i = 0, ref = arr.length = this.length; i < ref; i++) {
		arr[i] = this[i];
	}
	return arr;
}
console.log('loaded dom0');