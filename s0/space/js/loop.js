var loop;
(function(){
	loop=function(tar,fn,how){
		var type=typeof(tar);
		switch(type){
			case 'number':
				for (var nr=0;nr<tar;nr++){
					if (fn(nr)==false) break;
				}
				break;
			case 'string':
				if (how){				
					var nr=0,
						seq=tar.substring(nr,nr+fn || tar.length),
						len=Math.ceil(tar.length/fn);				
					for (var nr=0;nr<len;nr++){
						seq=tar.substring(nr*fn,(nr+1)*fn || tar.length);
						if (how(nr,seq)==false) break;
					}
				} else {
					for(var nr in tar){
						if (fn(nr,tar[nr])==false) break;				
					};
				}
				break;
			case 'object':
				if (how){
					if (tar.length!=undefined){
						//array
						var nr=0,
							seq=tar.slice(nr,fn);
							len=Math.ceil(tar.length/fn);				
						for (var nr=0;nr<len;nr++){		
							seq=tar.slice(nr*fn,(nr+1)*fn);
							if (how(nr,seq)==false) break;
						}	
					} else {
						//object
						var seq=[],ind=0,obj;
						for (var key in tar){
							if(seq.length==fn) {
								if (how(seq,ind)==false) {
									seq=[];
									break;
								}				
								seq=[];
								obj={};
								obj[key]=tar[key];
								seq.push(obj);
								ind++;							
							} else {
								obj={};
								obj[key]=tar[key];
								seq.push(obj);						
							}
						}
						if (seq.length) how(seq,ind++)
					}
				} else {
					var res;
					if (tar.length==undefined){
						var ind=0;
						for (var nr in tar){
							if (fn(nr,tar[nr],ind)==false) break;
							ind++;
						}			
					} else {
						for (var nr in tar){
							if (fn(nr,tar[nr])==false) break;
						}			
					}			
				}
				break;
			default :
				fn=tar;
				var nr=0
				while (fn(nr)!=false){
					nr++;
				}
				break;
		}
	}
})();
if (typeof exports !== 'undefined') exports.loop =loop;
console.log('Loaded loop');