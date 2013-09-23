var fs=require('fs'),
	path=require('path'),
	dns=require('./dns.js'),
	open=require('./open.js').open,
	dns	

open('handler.js',function(module){
	dns.sethandler(module.handler)
})
dns.start(2222)

/*
setTimeout(function(e){
	console.log(dns.data)
},1000)
/**/
	

