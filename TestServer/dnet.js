var dnet;
(function(){
	dnet={
		get: function (url,fn,async){
			return dnet.XMLHR('GET',url,async,fn);
		},
		post: function (url,data,fn,async){
			return dnet.XMLHR('POST',url,async,fn,data);
		},
		XMLHR: function (method,url,async,fn,data){
			async=async || true;
			var req=new XMLHttpRequest();
			req.open(method,url,async);
			if(method=='GET'){
				req.send();
			} else {
				req.send(data);
			}
			req.onreadystatechange=function(e){				
				if(req.readyState==4){// && req.status==200){
					if (req.fn) {
						req.fn(JSON.parse(req.responseText))
					} else if (fn) {
						fn(JSON.parse(req.responseText))
					}						
				}
			}
			
			return req;
		}	
	}	
})();
if (typeof exports !== 'undefined') {
	for(var key in dnet){
		exports[key]=dnet[key];
	}	
}
console.log('loaded dnet');
