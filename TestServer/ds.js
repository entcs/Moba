if (typeof exports !== 'undefined') {		
	var loop=require('./loop.js').loop,
		fs=require('fs'),
		path=require('path'),
		dirname=process.cwd()
}
var group=function(){
	var gr1={
		parent:0,
		name:'ds',
		getscope:function(){
			var scope=[gr1.name],
				tar=gr1
				
			loop(function(i){
				tar=tar.parent
				if(tar){
					scope.push(tar.name)
				} else {
					scope=scope.reverse().join('/')
					return false
				}
			})
			return scope
		},
		addgroup:function(json,fn){			
			//add to mem		
			if(!(json.key in gr1.groups)){
				var gr=group()
				gr.server=gr1.server
				gr.parent=gr1
				gr.name=json.key
				gr1.groups[json.key]=gr
				console.log('#### addgroup:',gr.name,json.scope)
			}
			
			if(ds.server){
				//dump				
				var dirs=json.scope.split('/'),
					fpath=dirname				
				dirs.push(json.key)
				loop(dirs,function(i,name){
					fpath=path.resolve(fpath,name)
					fs.exists(fpath, function (err) {
						if(!err){
							fs.mkdirSync(fpath)
						}
					})
				})
				
				
			} else {
				//post
				json.scope=gr1.getscope()
				json.type='ds'
				json.method='addgroup'
				dnet.post(json,function(res){					
					fn(gr)
				})
			}			
			return json
		},
		getgroups:function(json){//for client json is callback			
			if(ds.server){
				//load or get from mem
				json={}								
				loop(gr1.groups,function(k,v){
					//json.push(k)
					json[k]={
						key:k,
						name:k,
						scope:v.getscope()
					}
				})				
			} else {
				//post
				var data={
					type:'ds',
					method:'getgroups',
					scope:gr1.getscope()
				}
				dnet.post(data,function(res){					
					res=JSON.parse(res)
					loop(res,function(k,v){												
						var scope=v.scope.split('/'),
							last=scope.pop(),
							scope=scope.join('/')
							console.log('gettar:',scope)
							tar=ds.gettar(scope)
						
						console.log('getgroups:',k,v,tar,scope)
						
						/*
						var gr=group()
						gr.server=gr1.server
						gr.parent=gr1
						gr.name=json.key
						gr1.groups[json.key]=gr
						console.log('#### addgroup:',gr.name,json.scope)					
						/**/
					})
					json(res)
				})				
			}
			return json
		},
		add:function(json,fn){									
			if(ds.server){
				//add to mem		
				gr1.items[json.key]=json.val

				//dump				
				var fpath=path.resolve([dirname,json.scope,json.key+'.json'].join('/'))				
				fs.writeFile(fpath, JSON.stringify(json.val), function (err) {
					if (err) throw err					
				})
			} else {
				//post
				json.scope=gr1.getscope()
				json.type='ds'
				json.method='add'
				dnet.post(json,function(res){					
					fn(json)
				})
			}			
			return json			
		},
		get:function(){},
		save:function(){},
		load:function(){
			var scope=gr1.getscope(),
				fpath=path.resolve(dirname,scope),
				lpath
							
			fs.readdir(fpath,function(err,files){				
				loop(files,function(i,name){
					lpath=path.resolve(fpath,name)
					fs.stat(lpath, function(err, stat) {												
						if (stat && stat.isDirectory()) {							
							var gr=group()
							gr.server=gr1.server
							gr.parent=gr1
							gr.name=name
							gr1.groups[name]=gr
													
							gr.load()
						} else {
							fs.readFile(lpath, function (err, data) {
								if (err) throw err
								gr1.items[name]=JSON.parse(data)
							})							
						}
					})
				})
			})			
		},
		groups:{},
		items:{}
	}	
	return gr1
}
var gr2=group()
var ds={
	server:false,
	gettar:function(scope){
		console.log('gettar:',scope)
		tar=ds
		scope=scope.split('/')
		scope.shift()		
		loop(scope,function(i,name){
			tar=tar.groups[name]
			if(!tar) return false
		})
		return tar
	},
	handle:function(json){
		console.log('ds handler',json.method,json.key,json.scope)
		var tar=ds.gettar(json.scope)
		if(tar){
			var fn=tar[json.method]
			if(fn){			
				json=fn(json)
			} else {
				json.unhandled=true
			}			
		} else {
			json.unhandled=true
		}
		console.log('handler res;',json)
		return json
	}
}
loop(gr2,function(k,v){
	ds[k]=v
})
console.log('loaded ds 12')
if (typeof exports !== 'undefined') {		
	ds.server=true
	ds.load()
	exports.ds=ds
} else {
	//client testing
	ds.getgroups(function(res){
		console.log('getgroups1:',res)
	})	
	/*
	var data={
		type:'ds',		
		key:'tartu'
	}		
	ds.addgroup({
		key:'tartu'
	},function(res){
		tartu=res
		ds.getgroups(function(res){
			console.log('getgroups1:',res)
		})
		tartu.addgroup({key:'users'},function(res){
			users=res
			tartu.getgroups(function(res){
				console.log('getgroups2:',res)
			})			
			data={
				key:'user1',
				val:{
					name:'user1',
					age:123,
					friends:[1,2,3,4,5]
				}
			}
			users.add(data,function(res){
				console.log('add res:',res)
			})
		})
	})
	/**/
}
