var express = require('express')
var fs=require('fs')
var app = express()

app.use('/appdata/css',express.static(__dirname+'/appdata/css'))
app.use('/appdata/img',express.static(__dirname+'/appdata/img'))
app.use('/appdata/js',express.static(__dirname+'/appdata/js'))
app.use('/appdata/views',express.static(__dirname+'/appdata/views'))

app.get('/', function (req, res) {
	//res.send('Hello World!')
	fs.readFile(__dirname + '/appdata/views/index.html', 'utf8', function(err, text){
		res.send(text);
	});  
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

var kittySchema = mongoose.Schema({
    name: String
})

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name"
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema)

var silence = new Kitten({ name: 'Silence' })
console.log(silence.name) // 'Silence'

var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak() // "Meow name is fluffy"

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens)
})
/**/