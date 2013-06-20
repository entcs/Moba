var dnet;
(function(){
	dnet={
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
})();
if (typeof exports !== 'undefined') {
	for(var key in dnet){
		exports[key]=dnet[key];
	}	
}
console.log('loaded dnet');
