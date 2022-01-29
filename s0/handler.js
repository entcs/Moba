var loop=require('loop.js').loop,
	http=require('http'),
	crypto=require("crypto"),
	path=require('path'),
	fs=require('fs'),	
	url=require('url'),
	dbconf={
		host: 'localhost',
		port:3333,
		user:'root',
		password:'Loikam22',
		database:'gdev'
	}
		
//base
var mysql=require('mysql'),
	connection,
	//connection=mysql.createConnection(),
	dbconnect=function(){
		connection = mysql.createConnection(dbconf)
		connection.connect(function(err) {              // The server is either down
			if(err) {                                     // or restarting (takes a while sometimes).
				console.log('error when connecting to db:', err);
				setTimeout(dbconnect, 1000); // We introduce a delay before attempting to reconnect,
			}                                     // to avoid a hot loop, and to allow our node script to
		});                                     // process asynchronous requests in the meantime.
											  // If you're also serving http, display a 503 error.
		connection.on('error', function(err) {
			console.log('db error', err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
				dbconnect()                        // lost due to either server restart, or a
			} else {                                      // connnection idle timeout (the wait_timeout
				throw err;                                  // server variable configures this)
			}
		})
	},
	//post to auth server
	post=function(path,data,fn){
		if(typeof(data)!='string'){
			data=JSON.stringify(data)
		}
		var opts = {
			host: '88.196.53.29',
			port: 2222,
			path: path,//'/auth',
			method: 'POST',
			headers: {
				'Content-Type':'application/json;charset=UTF-8',
				//'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(data)
			}
		}		
		var req = http.request(opts, function(res) {
			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				if(fn){
					fn(chunk)
				}				
			})
		})		
		console.log('data123:',data)
		req.write(data)
		req.end()	
	},
	vq=function(q){		
		if(!(q.match(/['";]/)===null)){
			q=''
		}
		return q
	}
//dbconnect()
var sessions={
	users:{},
	add:function(name){
		var sid=crypto.createHash('sha1')							
		sid.update(data.res.name)
		sid.update(new Date().getTime().toString())
		sid=sid.digest('hex')		
	
		var time=new Date()
		time.setHours(time.getHours()+2)
		var user={
			name:name,
			sid:sid,
			time:time.getTime()
		}
		this.users[name]=user
		return user
	},
	rem:function(name){
		delete this.users[name]
	},
	get:function(name){
		return this.users[name] || ''
	},
	run:function(){
		setTimeout(function(){
			console.log('rem users')
			var time=new Date().getTime(),
				rem=[]
			loop(sessions.users,function(name,user){
				if(time>user.time){
					rem.push(name)
				}
			})
			loop(rem,function(i,name){
				delete session.users[name]
			})
			sessions.run()
		},3600*1000)//1h
	}
}
Number.prototype.round=function(rounding){
	rounding=rounding || 0
	var r=Math.pow(10,rounding)
	return Math.round(this*r)/r
}
var tacmap={
	unitstats:{},
	setmapdata:function(){
		tacmap.bushes=[]
		tacmap.size=2000
		loop(256,function(i){
			tacmap.bushes.push({
				x:Math.random(),
				y:Math.random()
			})
		})		
	},
	setunitstats:function(){
		var types={
				swo:{
					hp:1,
					dam:1,
					speed:1,
					range:1,
					spot:1,
					vmounted:1,			
					vfoot:1,
					name:'swordsmen'
				},
				spe:{
					hp:0.9,
					dam:0.8,
					speed:0.9,
					range:1,
					spot:1,
					vmounted:2,
					vfoot:1,
					name:'pikemen'
				},
				bow:{
					hp:0.5,
					dam:0.34,
					speed:0.8,
					range:3,
					spot:1.2,
					vmounted:1,
					vfoot:1,
					name:'archers'
				}
			},
			mods={
				'':{
					hp:1,
					dam:1,
					speed:1,
					range:1,
					spot:1,
					vmounted:1,
					vfoot:1,
					name:''
				},
				h:{
					hp:1.25,
					dam:1.2,
					speed:0.9,
					range:1.1,
					spot:0.9,
					vmounted:1,
					vfoot:1,
					name:'heavy'
				},
				m:{
					hp:1.6,
					dam:1.6,
					speed:1.6,
					range:0.5,
					spot:1.2,
					vmounted:1,
					vfoot:1.6,
					name:'mounted'
				}
			},
			name,
			hp=100,
			dam=10,
			speed=50,
			range=72,
			spot=192
		mods.hm={
			hp:mods.h.hp*mods.m.hp,
			dam:mods.h.dam*mods.m.dam,
			speed:mods.h.speed*mods.m.speed,
			range:mods.h.range*mods.m.range,
			spot:mods.h.spot*mods.m.spot,
			vmounted:mods.h.vmounted*mods.m.vmounted,
			vfoot:mods.h.vfoot*mods.m.vfoot,
			name:'heavy mounted'
		}
		var desc=''
		loop(types,function(i1,n1){
			loop(mods,function(i2,n2){					
				name=i1+i2
				desc=''
				if(i1=='spe' && i2.indexOf('m')==-1){
					desc='Double dam vs mounted.Half dam from mounted'
				}
				tacmap.unitstats[name]={				
					//basestats
					hp:(hp*types[i1].hp*mods[i2].hp).round(),
					dam:(dam*types[i1].dam*mods[i2].dam).round(),
					speed:(speed*types[i1].speed*mods[i2].speed).round(),
					range:(range*types[i1].range*mods[i2].range).round(),
					spot:(spot*types[i1].spot*mods[i2].spot).round(),
					name:n2.name+' '+n1.name,
					desc:desc
				}
				if(i1!='bow'){
					tacmap.unitstats[name].range=range
				}
			})
		})	
	},
	pls:{
		list:[],
		add:function(socket){
			tacmap.pls.list.push(socket)			
		},
		rem:function(socket){
			var ind=tacmap.pls.list.indexOf(socket)
			if(ind!=-1){
				this.list.splice(ind,1)
			}
		}
	},
	que:{
		list:[],
		add:function(socket){
			tacmap.que.list.push(socket)
		},
		rem:function(socket){
			var ind=tacmap.que.list.indexOf(socket)
			if(ind!=-1){
				this.list.splice(ind,1)
			}
		}
	},
	games:{
		list:[],
		add:function(p1,p2){
			var game={
				p1:p1,
				p2:p2,
				start:new Date().getTime()
			}
			tacmap.games.list.push(game)
			p1.game=game
			p1.userdata.team=1
			p2.game=game
			p2.userdata.team=2
			return game
		},
		rem:function(game){
			var ind=tacmap.games.list.indexOf(game)
			game.p1.userdata.game=0
			game.p2.userdata.game=0
			tacmap.games.list.splice(ind,1)
		}
	},
	socket:function(socket,data,io){
		console.log('connect:',socket.handshake.address)
		console.log('sockets:',io.sockets.sockets.length)
		
		
		socket.emit('tacmap',{
			type:'unitstats',
			unitstats:tacmap.unitstats
		})
				
		var handle={
			joinque:function(data){
				console.log('joinque:',data.name)
				socket.userdata.name=data.name
				socket.userdata.army=data.army
				socket.emit('tacmap',data)
				tacmap.que.add(socket)

				if(tacmap.que.list.length>1){				
					var game=tacmap.games.add(socket,tacmap.que.list[0]),					
						data={
							type:'joingame',
							p1:game.p1.userdata,
							p2:game.p2.userdata,
							mapsize:tacmap.size,
							bushes:tacmap.bushes
						}
					game.p1.emit('tacmap',data)
					game.p2.emit('tacmap',data)
					tacmap.que.rem(game.p1)
					tacmap.que.rem(game.p2)
				}

				
				console.log('que:',tacmap.que.list.length)				
			},
			leaveque:function(data){
				socket.emit('tacmap',data)
				tacmap.que.rem(socket)			
				console.log('que:',tacmap.que.list.length)				
			},
			action:function(data){
				var game=socket.game
				game.p1.emit('tacmap',data)
				game.p2.emit('tacmap',data)					
			},
			remunit:function(data){
				var game=socket.game
				game.p1.emit('tacmap',data)
				game.p2.emit('tacmap',data)						
			},
			disconnect:function(){
				console.log('disco')
			}
		
		}
		if(handle[data.type]){
			handle[data.type](data)
		}
	},
	handledisco:function(socket){
		if(socket.game){
			console.log('have game:')
			var data={
				type:'disco'
			}
			socket.game.p1.emit('tacmap',data)
			socket.game.p2.emit('tacmap',data)
		}
	}
}
tacmap.setunitstats()
tacmap.setmapdata()
	
exports.http=function(req,res){
	req.user=sessions.get(req.cookies.user)
	res.isauth=filters.isauth(req,res)	
	var act=actions[req.route]
	if(act){
		var auth=true,
			filter
			
		if(act.filters){
			loop(act.filters,function(i,filtername){
				filter=filters[filtername]
				if(filter){
					auth=filter(req,res)
				} else {
					console.log('missing filter:',filtername)
				}
			})
		}
		//handle action
		if(auth){			
			act.fn(req,res)
		} else {			
			res.send('{"err":"'+req.route+' forbidden'+'"}','text/html',403)
		}				
	} else {
		res.sendfile(req,res)
	}
}
exports.socket=function (socket,io) {		
	//connect
	socket.userdata={}
	socket.on('tacmap',function(data){
		tacmap.socket(socket,data,io)
	})
	socket.on('disconnect',function(){
		console.log('disco',socket.userdata.name)
		tacmap.handledisco(socket)
		console.log('sockets:',io.sockets.sockets.length)
	})
	
	/*
	socket.on('event', function (data) {
		console.log('Message Received3: ', data)
		socket.emit('event', data)
	})
	/**/
}

var filters={
	'isauth':function(req,res){		
		var user=sessions.get(req.cookies.user),
			sid=req.cookies.sid,
			time=new Date().getTime()
			
		if(user){
			if(user.sid==sid){
				if(time<user.time){
					return true
				} else {
					sessions.rem(user.name)
				}
			} 
		}
		//clear cookies
		res.setcookie('sid','expired',-1)
		res.setcookie('user','expired',-1)		
		return false
	},	
	'isadmin':function(req,res){
		return true
	}
}
var actions={
	'/ get':{
		fn:function(req,res){
			res.writeHead(200, {
				'Content-Type': 'text/html', 
			})
			var rs = fs.createReadStream('./gdev/index.html')
			rs.pipe(res)				
		}
	},
	'/login post':{
		//filters:['isguest'],
		fn:function(req,res){			
			var data=JSON.parse(req.data)			
			if(data.name && data.pasw){				
				post('/auth/users/login',data,function(sres){					
					//res.send(JSON.stringify(data))
					var data=JSON.parse(sres)
					if(data.err){
						
					} else {
						//add cookie
						//console.log('datad:',data)
						var user=sessions.add(data.res.name)
						res.setcookie('sid',user.sid)
						res.setcookie('user',data.res.name)
						
						console.log(sessions.users)
					}
					res.send(sres)
				})
			}		
		}		
	},
	'/logout get':{
		filters:['isauth'],
		fn:function(req,res){
			//console.log('cookies:',req.cookies,res.cookie)
			
			var sid=req.cookies.sid,
				name=req.cookies.user,
				q=req.query,
				user=sessions.get(name)
				
			if(user){
				sessions.rem(name)
			} else {				
			}
			res.setcookie('sid','expired',-1)
			res.setcookie('user','expired',-1)
			
			
			res.send('{res:"ok"}')			
		}		
	},
	'/register post':{
		fn:function(req,res){
			res.send('register not available')
		}
	},

	'/games/add get':{
		filters:['isauth'],
		fn:function(req,res){
			connection.query('show columns from games',function(err,qres){						
				var data={}
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},
	'/games/add post':{
		filters:['isauth'],
		fn:function(req,res,user){
			var user=sessions.get(req.cookies.user)
			if(user){
				var data=JSON.parse(req.data),
					item=data.item,
					columns=[],
					values=[]		
				
				item.owner=user.name
				
				connection.query('insert into games set ?',item,function(err,qres){											
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					delete data.item
					
					//console.log('data:',err)
					
					if(data.want=='list' && !err){
						actions['/games/list get'].fn(req,res)
						//handle[name].list.get(req,res)
						//res.send(JSON.stringify(data))
					} else {
						res.send(JSON.stringify(data))
					}
				})
			} else {
				res.send(JSON.stringify({
					err:'forbidden'
				}))
			}		
		}
	},
	'/games/rem post':{
		filters:['isauth'],
		fn:function(req,res){
			console.log('user:',req.user)
			if(req.user){
				var data=JSON.parse(req.data)					
				
				var id=vq(data.id)
				console.log('rem game:',id)
				connection.query('select * from games where id='+id,function(err,qres){
					if(err){
						data.err=err
					} else {
						data.res=qres
						if(qres[0].owner==req.user.name){
							console.log('qres:',qres[0].owner,req.user)
							connection.query('delete from games where id='+id,function(err,qres){
								if(err){
									data.err=err
									res.send(JSON.stringify(data))
								} else {
									if(data.want=='list' && !err){
										actions['/games/list get'].fn(req,res)
										//handle[name].list.get(req,res)
										//res.send(JSON.stringify(data))
									} else {
										res.send(JSON.stringify(data))
									}							
									
								}
							})

						} else {
							res.send(JSON.stringify(data))
						}											
					}					
				})				
			} else {
				res.send(req.data)
			}
		}
	},
	'/games/list get':{
		filers:['isauth'],
		fn:function(req,res){
			connection.query('select * from games',function(err,qres){						
				var data={
					err:'',
					list:'',
					schema:''
				}
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},

	'/projects/add get':{
		filters:['isauth'],
		fn:function(req,res){
			connection.query('show columns from projects',function(err,qres){						
				var data={}
				if(err){
					data.err=err
				} else {
					data.res=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},
	'/projects/add post':{
		filters:['isauth'],
		fn:function(req,res,user){
			var user=sessions.get(req.cookies.user)
			if(user){
				var data=JSON.parse(req.data),
					item=data.item,
					columns=[],
					values=[]		
				
				item.owner=user.name
				
				connection.query('insert into projects set ?',item,function(err,qres){											
					if(err){
						data.err=err
					} else {
						data.res=qres
					}
					delete data.item
					
					//console.log('data:',err)
					
					if(data.want=='list' && !err){
						actions['/projects/list get'].fn(req,res)
						//handle[name].list.get(req,res)
						//res.send(JSON.stringify(data))
					} else {
						res.send(JSON.stringify(data))
					}
				})
			} else {
				res.send(JSON.stringify({
					err:'forbidden'
				}))
			}		
		}
	},
	'/projects/rem post':{
		filters:['isauth'],
		fn:function(req,res){
			console.log('user:',req.user)
			if(req.user){
				var data=JSON.parse(req.data)					
				
				var id=vq(data.id)				
				connection.query('select * from projects where id='+id,function(err,qres){
					if(err){
						data.err=err
					} else {
						data.res=qres
						if(qres[0].owner==req.user.name){
							console.log('qres:',qres[0].owner,req.user)
							connection.query('delete from projects where id='+id,function(err,qres){
								if(err){
									data.err=err
									res.send(JSON.stringify(data))
								} else {
									if(data.want=='list' && !err){
										actions['/projects/list get'].fn(req,res)
										//handle[name].list.get(req,res)
										//res.send(JSON.stringify(data))
									} else {
										res.send(JSON.stringify(data))
									}							
									
								}
							})

						} else {
							res.send(JSON.stringify(data))
						}											
					}					
				})				
			} else {
				res.send(req.data)
			}
		}
	},	
	'/projects/list get':{
		filers:['isauth'],
		fn:function(req,res){
			var q='select * from projects',
				data={
					list:[],
					fields:{}
				}				
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},
	
	'/events/list get':{
		filers:['isauth'],
		fn:function(req,res){
			var q='select * from events',
				data={
					list:[],
					fields:{}
				}				
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	},	
	'/resources/list get':{
		filers:['isauth'],
		fn:function(req,res){
			var q='select * from resources',
				data={
					list:[],
					fields:{}
				}				
			connection.query(q,function(err,qres){						
				if(err){
					data.err=err
				} else {
					data.list=qres
				}
				res.send(JSON.stringify(data))
			})			
		}
	}
}	

//tacmap
actions['/tacmap/tobattle post']={
	fn:function(req,res){		
		var data=JSON.parse(req.data)
		console.log('to battle',data)
		res.send(JSON.stringify(data))
	}
}

actions['/doit/now get']={
	//filters:['isauth'],
	fn:function(req,res){
		res.send(req.route)
	}
}

sessions.run()


console.log('s0 handler')