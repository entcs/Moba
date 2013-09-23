//client
var ds={
	add:function(){
		var len=arguments.length
		if(len==1){
			var data={
				type:'ds',
				com:'addgroup',
				group:arguments[0]
			}
			this.post(data,function(res){})
		} else if (len==2){
			var data={
				type:'ds',
				group:arguments[0],
				com:'additem',
				item:arguments[1]
			}
			this.post(data,function(res){})			
		}
	},
	rem:function(){
		var len=arguments.length		
		if(len==0){
			var data={
				type:'ds',
				com:'remgroups'
			}
			this.post(data,function(res){})		
		} else if(len==1){
			var data={
				type:'ds',
				com:'remgroup',
				group:arguments[0]
			}
			this.post(data,function(res){})
		} else if (len==2){
			var data={
				type:'ds',
				group:arguments[0],
				com:'remitem',
				item:arguments[1]
			}
			this.post(data,function(res){})			
		}	
	},
	get:function(){
		var len=arguments.length		
		if(len==0){
			var data={
				type:'ds',
				com:'getgroups'
			}
			this.post(data,function(res){})		
		} else if(len==1){
			var data={
				type:'ds',
				com:'getitems',
				group:arguments[0]
			}
			this.post(data,function(res){})
		} else if (len==2){
			var data={
				type:'ds',
				group:arguments[0],
				com:'getitem',
				item:arguments[1]
			}
			this.post(data,function(res){})			
		}	
	},
	post:function(data,fn){
		console.log('post:',data)		
		fn(data)
		dss.handle(data)
	}
}
//server
var dss={
	groups:{},
	save:false,
	handle:function(data){
		console.log('handle:',data)
		var res
		if(data.type=='ds'){
			var fn=this[data.com]
			if(fn){
				res=fn(data)
			}
		}
		return res
	},
	remgroups:function(data){
		this.groups={}
		return data
	},
	getgroups:function(data){		
		data.groups=[]
		loop(this.groups,function(k,v){
			data.groups.push(k)
			data.mes='ok'
		})
		return data
	},
	addgroup:function(data){
		this.groups[data.group]={
			items:{}			
		}
		data.mes='ok'
		if(this.save || data.save){
			//save
		}
		return data
	},
	remgroup:function(data){
		delete this.groups[data.group]
		data.mes='ok'
		if(this.save || data.save){
			//save
		}		
		return data
	},
	getitems:function(data){
		data.val={}
		loop(this.groups[data.group].items,function(k,v){
			data.val[k]=v
		})
		data.mes='ok'
		if(this.save || data.save){
			//save
		}		
		return data
	},	
	additem:function(data){
		//maybe data should have key and val and not id attr
		this.groups[data.group].items[data.item.id]=data.item
		data.mes='ok'
		data.val='ok'
		if(this.save || data.save){
			//save
		}
		return data
	},
	remitem:function(data){
		delete this.groups[data.group].items[data.item]
		data.mes='ok'
		if(this.save || data.save){
			//save
		}
		return data
	},
	getitem:function(data){
		data.val=this.groups[data.group].items[data.item]
		data.mes='ok'
		if(this.save || data.save){
			//save
		}
		return data
	}
}
//rem all groups
ds.rem()
//get all group names
ds.get()

//add group
ds.add('users')
//get all items
ds.get('users')

//add item to group
ds.add('users',{id:1})
//get item from group
ds.get('users',123)
//rem item from group
ds.rem('users',123)

//rem group
ds.rem('users')
