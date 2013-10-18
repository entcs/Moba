var loop=require('./loop.js').loop,
	open=require('./open.js').open,
	handler=function(req,res,json){		
		var data='no type'	
		if(json.type){
			data='no handle'
			var fn=handles[json.type]
			if(fn){
				data=fn(req,res,json)
			}
		}
		console.log('data:',data)
		res.writeHead(200)
		res.end(JSON.stringify(data),'utf-8')			
	},
	handles={
		form1:function(req,res,json){
			return 'form1 handle'
		}
	}
exports.handler=handler
console.log('loaded handler')
