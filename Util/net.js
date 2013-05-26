var Net;
(function(){
	Net={
		get: function (url,callback,async){
			return Net.XMLHR('GET',url,async,callback);
		},
		post: function (url,callback,async){
			return Net.XMLHR('POST',url,async,callback);
		},
		XMLHR: function (method,url,async,callback){
			async=async || true;
			var req=new XMLHttpRequest();
			req.open(method,url,async);
			req.send();	
			req.onreadystatechange=callback;	
			return req;
		}	
	}
})();
if (typeof exports !== undefined) exports.Net =Net;