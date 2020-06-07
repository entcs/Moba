/*make me lazy*/
function get(id) {return document.getElementById(id)};
function log(s) {console.log(s)};
function gets(obj,style) {return window.getComputedStyle(obj)[style]};
/*make me lazy*/

//block IE users
var IE = document.all?true:false
log(get('wrap'))
if (!IE) {
	get('wrap').style.display='block'
	get('no-ie').style.display='none'
}


var ml=setInterval(loop,20),
	ct=new Date().getTime(),
	lt=ct,
	ft=ct-lt,
	upd=[];

function loop(){
	ct=new Date().getTime();
	ft=ct-lt;
	
	var obj,
		tdif,
		rval,
		rtime,
		val,
		v1,
		v2;
	for (var nr in upd){
		obj=upd[nr];		
		obj.ltime=ct;
		rval=obj.val-obj.sval;		
		rtime=obj.start+obj.time-ct;
		val=rval*ft/rtime;	
		obj.sval+=val
		obj.obj.style[obj.style]=obj.sval+'px';		
		if (rtime<=0){
			upd.pop(nr);
			log('end');
		};		
	};
	var vv=parseInt(nav.style.marginLeft);
	
	if (vv) {
		vv=parseInt(vv)
	} else {
		vv=0
	}
	//get('display').innerHTML=mval+':'+parseInt(nav.style.marginLeft)
	nav.style.marginLeft=vv+(mval-vv)/16+'px'
	
	lt=ct;
	
};
function tween(obj,style,val,time){
	upd.push({
		obj:obj,
		style:style,
		val:val,
		time:time,
		ltime:ct,
		start:ct,
		sval:parseInt(window.getComputedStyle(obj)[style])
	});	
};
var nav=get('nav-main');
var navdif=(nav.scrollWidth-nav.clientWidth)/2;

if (navdif==0) {
	navdif=300
}

var	navrat=(navdif)/((nav.clientWidth-200)/2);

	
//document.onmousemove=getmpos
nav.onmousemove=getmpos

var mx=0,my=0,dx=0,dy=0,mval=0
function getmpos(e) {
    mx=e.pageX
    my=e.pageY
	dx=mx-window.innerWidth/2
	dy=mx-window.innerHeight/2
	
	if (Math.abs(dx)<480){
		//strict
		mval=-navdif-dx*navrat
		//nav.style.marginLeft=-navdif-dx*navrat+'px'		
	}
}
//document.onclick=click
document.onmousedown=click
function click(e){
	log(e)
	if (e.target.parentElement.id=='nav-main') {
		navsel(e.target)
		
	}
	return false
}
function navsel(tar){
	for (var nr in nav.children){
		if (nav.children[nr].style) {
			if (nav.children[nr]==tar){
				get('content-main').children[nr].style.display='block'
			}
			else {
				get('content-main').children[nr].style.display='none'
			}
		}
	}
}
navsel(nav.children[0])