var loop=function(obj,fn){	
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
if (typeof exports !== 'undefined') exports.loop =loop;
console.log('Loaded loop');