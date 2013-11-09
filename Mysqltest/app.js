var mysql=require('mysql'),
	loop=require('./loop.js').loop,
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'',
		database:'mydb'
	})

connection.connect()
/*
var string='CREATE DATABASE mydb DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;'
connection.query(string,function(err,rows){
  if (err) throw err

  console.log('The solution is: ', rows)	
})
/*
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})
/**/
/*
var post  = {id: 1, nimi: 'Hello MySQL'}
	str="INSERT INTO t1(id,nimi) VALUES(3,'123')"
var query = connection.query(str,function(err, result) {
  // Neat!
})
/**/
/*
var post  = {id: 11, nimi: 'Hello MySQL'};
var query = connection.query('INSERT INTO t1 SET ?', post, function(err, result) {
  // Neat!
});
/**/
/*
var query = "SELECT * FROM t1 WHERE nimi=" + mysql.escape("Hello MySQL");
connection.query(query,function(err,res){
	console.log(res)
})
/**/
/*
function add(table,item){	
	connection.query('INSERT INTO '+table+' SET ?', item, function(err, result) {
	  // Neat!
	  console.log(err,result)
	});	
}
var item={
	id:123,
	nimi:'123'
}
add('t1',item)
/**/
/*
function getall(table,fn){
	connection.query("SELECT * FROM t1",function(err,res){
		if(fn) fn(res)
	})	
}
getall('t1',function(res){
	console.log(res)
})
/**/
connection.query("SHOW COLUMNS FROM t1",function(err,res){		
		loop(res,function(i,e){
			console.log(e)
			/*
			loop(e,function(i2,e2){
				console.log(i2,e2)
			})
			/**/
		})
	})	
connection.end()
