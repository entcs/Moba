var dns=require('./js/dns.js'),
	app=dns.listen(3333)
	
dns.load('/js/handler.js',function(module){
	app.sethandler(module)
})