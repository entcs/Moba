var open=require('./open.js').open,
	dns	
open('dns.js',
	function(o){
		dns=o
		dns.start(2222)
	},
	function(o){
		o.close()
	}
)
/*
open('handler.js',function(module){
	dns.sethandler(module.handler)
})
/**/
	

