var loop=require('./loop.js').loop,
	open=require('./open.js').open,
	ds,
	handler=function(req,res,json){		
		var data='no type'	
		if(json.type){
			data='no handle'
			if(json.type=='user'){		
				data='handle user new123'			
			} else if(json.type=='ds'){				
				data=ds.handle(json)
			}
		}
		res.writeHead(200)
		res.end(JSON.stringify(data),'utf-8')			
	}	

open('ds.js',function(module){
	ds=module.ds	
})		

exports.handler=handler
console.log('loaded handler')
