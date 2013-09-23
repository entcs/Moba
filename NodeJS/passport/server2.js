var express = require('express'),
    passport = require('passport'),
	GoogleStrategy = require('passport-google').Strategy,
    //TwitterStrategy = require('passport-twitter').Strategy,
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    app = express();
 
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
 
passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 
/* 
var TWITTER_CONSUMER_KEY = "INSERT_KEY_HERE";
var TWITTER_CONSUMER_SECRET = "INSERT_SECRET_HERE";
 
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // NOTE: You'll probably want to associate the Twitter profile with a
    //       user record in your application's DB.
    var user = profile;
    return done(null, user);
  }
));
/**/
passport.use(new GoogleStrategy({
    returnURL: 'http://local.host:3000/auth/google/return',
    realm: 'http://local.host:3000/'
  },
  function(identifier, profile, done) {
	//console.log(identifier, profile, done)	
	//console.log('verify user')
	var user={
		id:new Date().getTime(),
		identifier: identifier,
		profile: profile,
		done: done	
	}
	//users[user.id]=user	
	//console.log('here:',user)
	var err=0
	done(err, user);		
	//done(0,'user12345')	
	/*
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
	/**/
  }
));
 
 
app.get('/', function(req, res){
    res.send('Hello World');
  });


app.get('/account',
  ensureLoggedIn('/login'),
  function(req, res) {
    res.send('Hello ' + req.user.profile.displayName);
  });
 
app.get('/login',
  function(req, res) {
    //res.send('<html><body><a href="/auth/twitter">Sign in with Twitter</a></body></html>');
	res.send('<a href="/auth/google">GOOGLE AUTH</a><br>')	
  });
  
app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });
 
app.get('/auth/twitter', 
	passport.authenticate('twitter')
);
app.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { 
		successReturnToOrRedirect: '/', 
		failureRedirect: '/login' 
	})
);

app.get('/auth/google', 
	passport.authenticate('google')
);
app.get('/auth/google/return', 
	passport.authenticate('google', { 
		successRedirect: '/',
		failureRedirect: '/login' 
	})
); 
 
var server = app.listen(3000);
console.log('Express server started on port %s', server.address().port);