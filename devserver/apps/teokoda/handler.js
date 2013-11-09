var loop=require(process.cwd()+'/loop.js').loop,
	fs=require('fs')
	
exports.handler=function(req,res){
	var parts=req._parsedUrl.pathname.split('/'),
		appname=parts[1],
		controller=parts[2],
		action=parts[3]
		query=req.query,
		method=req.method.toLowerCase(),
		hres='not handled'
	
	if(controller==undefined){
		res.send( fs.readFileSync(__dirname+'/index.html','utf-8'))		
	} else if(controller in handle){
		if(action in handle[controller]){
			if(method in handle[controller][action]){
				handle[controller][action][method](req,res)		
			} else {
				res.send(appname+' '+controller+' '+action+' no method: '+method)
			}
			
		} else {
			res.send( appname+' '+controller+' no action: '+action)
		}
	} else {
		res.send( appname+' no controller: '+controller)
	}
}