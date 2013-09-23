var express=require('express'),
	app=express(),
	loop=require('./loop.js').loop,
	passport = require('passport'),
	querystring=require('querystring'),
	GoogleStrategy = require('passport-google').Strategy,
	users={
		list:{},
		add:function(data){
			var user={}
			user.sid=data.sid
			user.firstname=data.firstname
			user.lastname=data.lastname
			user.email=data.email
			user.sstart=new Date().getTime()
			users.list[user.sid]=user
			console.log('added user:',user.email)
			return user
		},
		rem:function(sid){
			if(sid in users.list){
				delete users.list[sid]
			}
		}
	},
	canauth={},	
	idcounter=0,
	isauthented=function(req){
		var sid=getcookie(req.headers.cookie).sid
		if(sid in users.list) return sid
		return 0
	},
	getcookie=function(cookie){
		var obj={},
			kv
		if (cookie){
			loop(cookie.split(';'),function(i,e){
				kv=e.split('=')
				obj[kv[0]]=kv[1]
			})
		}
		return obj
	}

passport.use(new GoogleStrategy({
	returnURL: 'http://local.host:3000/auth/google/return',
	realm: 'http://local.host:3000/'
  },
  //return url callback, will not use it
  function(identifier, profile, done) {
	/*
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
	/**/	
	console.log('verify user')
	var user={
		id:new Date().getTime(),
		identifier: identifier,
		profile: profile,
		done: done	
	}
	users[user.id]=user	
	console.log('here:',user)
	var err=0
	done(err, user);			
  }
))
app.get('/', function(req, res){
	var sid=isauthented(req)
	if(sid){
		var user=users.list[sid]
		res.writeHead(200, {
			'Set-Cookie': 'sid='+sid+'; path=/',
			'Content-Type': 'text/html'
		});				
		res.end(
			user.firstname+'<br>'+
			'<a href="/logout">LOGOUT</a><br>'
		)		
	}else{
		res.send('<a href="/auth/google">GOOGLE AUTH</a><br>')		
	}
})
var counter=0
app.get('/auth/google', 
	function(req,res){
		passport.authenticate('google')(req,res)
	}
);
app.get('/auth/google/return', 		
	function(req,res){					
		var sid=getcookie(res.req.headers.cookie).sid
		console.log('return sid:',sid)			
		var data=querystring.parse(req.url),
			newsid=data['openid.sig'].replace('=',''),
			udata={
				firstname:data['openid.ext1.value.firstname'],
				lastname:data['openid.ext1.value.lastname'],
				email:data['openid.ext1.value.email'],
				sid:newsid
			}
		if(sid in users.list) delete users.list[sid]
		var user=users.add(udata)
		//console.log('data:',data)
		console.log('users:',users.list)
		//res.send('authented:'+udata.firstname)
		//console.log(res)
		//res.send(JSON.stringify(data))
		var str=unescape(req.url.split('?')[1].split('&').join('\n'))
		//res.send('<pre>'+str+'</pre>')			
		var data=JSON.stringify({
			type:'userdata',
			userdata:udata
		})
		//res.send(data)
		//res.redirect('/')
		res.writeHead(200, {
			'Set-Cookie': 'sid='+udata.sid+'; path=/'
		});			
		res.end([
			'<script>'+
			'document.cookie="sid='+udata.sid+'"',
			'var sid="'+udata.sid+'"',
			'console.log(document.cookie)',
			'window.location="/"',
			'console.log(document.cookie)',
			'</script>'
		].join(';'))
	}
	/**/	
	//this calls return url callback
	/*
	passport.authenticate('google', { successRedirect: '/success',
                                    failureRedirect: '/fail' })
	/**/
)
app.get('/logout', function(req, res){
  var sid=getcookie(req.headers.cookie).sid
  console.log('logout:',users.list[sid])
  if(sid in users.list){
	users.rem(sid)
  }  
  res.redirect('/')
})
app.listen(3000);
console.log('Listening on port 3000');