var ds={
	data:{},
	count:0,
	genid:function(pre){
		pre=pre || ''
		var nr=new Date().getTime(),
			nr2=nr.toString(16)
		loop(function(i){
			id=pre+nr2+(nr-i).toString(16)			
			if(ds.data[id]==undefined) return false			
		})
		console.log(id)
		return id
	},
	add:function(key,val){
		if(val==undefined){
			val=key
			key=ds.genid()
		}
		if(this.data[key]==undefined){
			this.count+=1
		}
		this.data[key]=val		
	},
	rem:function(key){
		delete this.data[key]
		this.count-=1
	},
	get:function(key){
		if(typeof(key)=='object'){
			
		}
		return this.data[key]
	},
	set:function(key,val){
		this.data[key]=val
	},
	dump:function(key){
		if(typeof(key)=='object'){
			loop(key,function(i,e) {
				this.dump(i)
			})			
		} else {
			//dump key			
		}
		
	},
	dumpall:function(){
		loop(this.data,function(i,e) {
			this.dump(i)
		})
	},
	controller:function(data){
		//authorize
		
		//handle
	}
}

var u1={
	name:'name',
	age:18
}
var u2={
	name:'name',
	age:18
}
loop(10,function(i){
	ds.add(u1)
})
console.log(ds.data)


