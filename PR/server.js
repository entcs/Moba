var express = require('express'),
	url = require('url'),
	mysql=require('mysql'),	
	app = express(),
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'',
		database:'pr'
	})	
	
app.use(express.bodyParser())
	
connection.connect()	
app.get('/', function(req, res) {
	if(req.url=='/') req.url='/index.html'		
	res.sendfile(__dirname + req.url);
})

app.get('/tegevused/all',function(req,res){
	connection.query("select * from tegevused",function(err,qres){		
		res.send(qres)
	})		
})

app.get('/tegevused/add',function(req,res){	
	connection.query('SHOW COLUMNS FROM tegevused', function(err, qres) {
		//console.log(err,qres)
		var prop,
			view='<form id="tegevused" data-view="add">',
			hide=['id']
			
		for(var nr in qres){		
			prop=qres[nr]
			if(hide.indexOf(prop.Field)==-1){
				view+='<div class="field">'
				view+='<label for="'+prop.Field+'">'+prop.Field+'</label>'
				view+='<input id="'+prop.Field+'" name="'+prop.Field+'" />'
				view+='</div>'
			}
		}
		view+='<button class="add">add</div>'
		view+='<button class="autofill">autofill</div>'
		view+='</form>'
		res.send(view)
	});		
	
	//res.send(view)
})
app.post('/tegevused/add',function(req,res){	
	var item=req.body	
	console.log('item:',item)
	connection.query('INSERT INTO tegevused SET ?', item, function(err, qres) {
		//console.log(err,qres)
		res.send(err)
	});		
})

app.get('/tegevused/rem',function(req,res){	
	connection.query("SELECT * FROM t1",function(err,qres){
		res.send(qres)
	})		
})
app.get('/tegevused/get',function(req,res){	
	connection.query("SELECT * FROM t1",function(err,qres){
		res.send(qres)
	})
})
app.get('/tegevused/set',function(req,res){	
	connection.query("SELECT * FROM t1",function(err,qres){
		res.send(qres)
	})
})

app.listen(2222);
console.log('Listening on port 2222')