console.log('---------UPDATED DEV.JS--------');

exports.dev=function(p,socket){
	var io=p.io,
		s=p.s,
		app=p.app,
		fs=p.fs,
		sendall=function(data){
			io.sockets.emit('mes',data);
		},
		send=function(data,soc){
			soc=soc || socket;
			soc.emit('mes',data);
		};

	function len(obj){
		var count=0;
		for(var key in obj){
			count++;
		}
		return count;
	}
	
	//users
	s.addUser=function(soc,data){
		console.log('add user: '+data.username)	
		var user=s.guests[soc.id];
		user.name=data.username;
		s.users[soc.id]=user;
		delete s.guests[soc.id];
		s.usernames[data.username]=soc.id;
							
		var userlist=s.getNames(s.usernames);
		messagehandler.joinchan({
			channame: 'global',
			username: data.username
		});		
	}
	s.remUser=function(soc,data){
		var user=s.users[soc.id];
		if (user){
			console.log('user disconnected',user.name);
			var user=s.users[soc.id];
			if (user){
				delete s.users[soc.id];
				delete s.usernames[user.name];
			};
			//remove from channels
			if (user.chans){
				for (var key in user.chans){
					var chan=user.chans[key];
					delete chan.users[user.name];
				}
				for (key in user.chans){
					var chan=user.chans[key];
					for (var name in chan.users){
						send({
							tag: 'leavechan',
							channame: chan.name,
							username: data.username
						},
						chan.users[name].socket
						);
					}
				}
			}
		} else {
			var guest=s.guests[soc.id];
			if (guest){
				delete s.guests[soc.id];
			}
			console.log('user disconnected',user.name);
		};			
	}
	s.addGuest=function(soc){
		s.guests[soc.id]={
			name:'',
			socket:soc,
			chans:[],
			gueststart:new Date().getTime()
		}
	}
	s.getNames=function(obj){		
		var names=[];
		for (var key in obj){
			names.push(key);
		};
		return names;
	};
	//chans
	s.addChan=function(name){}
	s.remChan=function(data){
		chan=s.chans[data.name];
		if (chan){
		};
	},
	//disco
	socket.on('disconnect', function (data) {
		s.remUser(socket,data);
	});	
	//authent
	socket.on('aut',function(data){
		if (data.username && data.pasw){			
			if (s.guests[socket.id]){
				//authent
				if (s.usernames[data.username]){
					send({
						tag:'nametaken',
						name: data.username
					});
					//socket.emit('aut',{res:'enterName'});
				//adduser
				} else {
					send({
						tag: 'setname',
						name: data.username
					});
					s.addUser(socket,data);					
				}
			//name change
			} else if (s.users[socket.id]){				
				var user=s.users[socket.id];
				//pasw check missing
				if (s.usernames[data.username]){
					mes('name taken');
					socket.emit('aut',{res:'enterName'});
				} else {										
					mesAll('namechange from '+user.name+' to '+data.username)
					delete s.usernames[user.name];
					user.name=data.username;
					s.usernames[user.name]=socket.id;
					
				}				
			}
		}			
	});
	//message handling
	socket.on('mes',function(data){
		if (data.tag){
			console.log('messagehandler '+data.tag);
			var fn=messagehandler[data.tag];
			if (fn){
				data.username=s.users[socket.id].name;	
				fn(data);
			} else {
				console.log('Missing message handler for '+data.tag);
			}			
		} else {
			console.log('Missing message tag',data);
		};
	});
	var messagehandler={
		//chat
		chat: function(data){
			if (data.channame && data.mes){
				var chan=s.chans[data.channame];
				if (chan){
					if (chan.users[data.username]){						
						for (var key in chan.users){
							var chanuser=chan.users[key];
							send(data,chanuser.socket);
							console.log('sent chat');
						}
					}
				}
			}
		},
		//chans
		joinchan: function(data){
			if (data.channame){
				var chan=s.chans[data.channame],
					user=s.users[socket.id]								
				//new chan
				if (!chan){	
					console.log('create chan:',data.channame);
					chan={
						name: data.channame,
						owner: user,
						status: 0,
						users: {}
					}
					chan.users[user.name]=user;
					user.chans[chan.name]=chan;
					s.chans[chan.name]=chan;
					
					send({
						tag:'joinchan',
						status: 0,
						owner: chan.owner.name,
						channame: chan.name,
						userlist: s.getNames(chan.users)
					});					
				} else {
					chan.users[user.name]=user;
					console.log('join existing channel',user.name);
					for (var username in chan.users){
						console.log('match names:',username,user.name);
						//to existing users
						if (username!=user.name){	
							console.log('add to chan:',username);
							send({
								tag: 'joinchan',
								channame: chan.name,
								username: user.name
							},chan.users[username].socket);
						//to joined user
						} else {
							send({
								tag:'joinchan',
								status: 0,
								owner: chan.owner.name,
								channame: chan.name,
								userlist: s.getNames(chan.users)
							});						
						}
					}					
					chan.users[user.name]=user;
					user.chans[chan.name]=chan;						
				};
			};			
		},
		leavechan: function(data){
			console.log('user left channel');
			if (data.channame){
				var chan=s.chans[data.channame];
				console.log('leave chan:',chan.name);
				if (chan){
					for (var chanuser in chan.users){
						send({
							tag:'leavechan',
							channame: chan.name,
							username: data.username
						},chan.users[chanuser].socket)
						console.log(data.username,chan.name);
					};
					delete chan.users[s.users[data.username]];
				}
			}
		}
	};	
	
	if (s.users[socket.id]){		
		//is authented user
	} else if (s.guests[socket.id]){
		//anonymous user
	} else {
		send({
			tag:'welcome'
		});
		//new connection
		s.addGuest(socket);
		console.log('guest connected');
	}
	

};