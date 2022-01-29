const express = require('express')
const app = express()
const port = 3333
const loop = require('./js/loop.js')
const path = require('path')
const fs = require('fs')
var dirname = process.cwd()

app.use(express.static('public'))
app.use(express.static('js'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static', express.static(path.join(__dirname, 'js')))

var contenttype = {
    'html': { 'Content-Type': 'text/html' },
    'js': { 'Content-Type': 'text/javascript' },
    'css': { 'Content-Type': 'text/css' },
    'png': { 'Content-Type': 'image/png' },
    'jpg': { 'Content-Type': 'image/jpeg' },
    'ico': { 'Content-Type': 'image/gif' },
    'gif': { 'Content-Type': 'image/gif' }

}
var extname = function (url) {
    var p = url.split('/'),
        lp = p[p.length - 1]

    p = lp.split('.')
    lp = p[p.length - 1]

    return lp
}

app.get('/test', (req, res) => {
    //res.send('Hello World!')
    var rp = path.resolve(dirname + '/test/test.txt')//req.url)
    fs.readFile(rp, function (err, data) {
        //resourse not found
        if (err) {
            res.writeHead(400)
            res.end('app.sethandler(fn) not set', 'utf-8')
        } else {
            res.writeHead(200, contenttype[extname(req.url)])
            res.end(data, 'utf-8')
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})