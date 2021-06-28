const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));

app.get('/', (req, res) => {
  console.log(req.headers.host)
  res.sendFile('index.html', {root: __dirname })
  //res.send('index.html')
})
app.post('/', function (req, res) {
  res.send('Got a POST request')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})