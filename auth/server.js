//s0
var http=require('http'),
	path=require('path'),
	loop=require('./loop.js').loop,
	fs=require('fs'),	
	url=require('url'),	
	reqp = http.IncomingMessage.prototype,
	resp = http.ServerResponse.prototype,
	data,
	port = process.argv[2] || 2000,
	handler='',
	maxsize=1e6//1 * Math.pow(10, 6)~~~ 1MB,
	handlecookies=function(req,res){		
		var data={},
			cookie=req.headers.cookie
			
		req.cookies={}
		res.cookies={}
			
		if(cookie){
			var cc=cookie.split('; ')
			loop(cc,function(i,c){
				i=c.split('=')
				data[i.splice(0,1)]=i.join('=')
			})					
			req.cookies=data
		}
		//res.cookies=data
		
		//res.headers['Set-Cookie']=req.headers.cookie
	}
reqp.user=''
resp.isauth=false
resp.sendfile=function(req,res){
	//file request
	var filename = path.join(process.cwd(), req.pathname),			
		ext=path.extname(req.pathname).replace('.',''),
		dirname
		
	if(ext){
		dirname=path.dirname(filename)
	} else {
		dirname=filename
	}
	if(filename.indexOf('handler.js')!=-1 || filename.indexOf('server.js')!=-1){
		res.send("{'err':'You are not here'}",403)
		return
	}
	fs.exists(filename, function(exists) {
		if(!exists) {
			res.send('"err":{"They are not here"}',404)
			return
		}
		if (fs.statSync(filename).isDirectory()) {
			/*
			filename += '/index.html'
			ext='html'
			/**/
			res.writeHead(200, {
				'Content-Type': 'text/plain', 
			})			
			res.end('i was here first!')
		} else {				
			switch(ext){
				case 'wav':
				case 'ogg':
					var stat = fs.statSync(filename)    
					res.writeHead(200, {
						'Content-Type': 'audio/'+ext, 
						'Content-Length': stat.size,
						'Accept-Ranges': 'bytes',
						'Content-Range': ['bytes 0-',stat.size-1,'/',stat.size-1].join('')
					})					
					var rs = fs.createReadStream(filename)
					rs.pipe(res)					
					break
				case 'js':
					res.writeHead(200, {
						'Content-Type': 'text/javascript', 
					})
					var rs = fs.createReadStream(filename)
					rs.pipe(res)
					break					
				case 'html':
					res.writeHead(200, {
						'Content-Type': 'text/html', 
					})
					var rs = fs.createReadStream(filename)
					rs.pipe(res)
					break
				default:
					res.writeHead(200, {
						'Content-Type': 'text/plain', 
					})
					var rs = fs.createReadStream(filename)
					rs.pipe(res)
					//res.send(file,'200',ext)
					break
			}	
		}		
	})

}
resp.send=function(data,code){
	code=code || 200
	//type=type || 'text/plain'
	if(typeof(data)=='object'){
		data=JSON.stringify(data)
	}
	var cookies=[]
	loop(this.cookies,function(k,v){
		cookies.push(['Set-Cookie',[k,v].join('=')])
	})
	cookies.push(['IsAuth',this.isauth])
	this.writeHead(code,cookies)	
	this.write(data,'binary')
	this.end()
}
resp.setcookie=function(name,val,days){
	//'sid=4c57f1473bf50d77bf5e48b9b2af212f743c1101; Max-Age=900; Path=/; Expires=Sat, 17 May 2014 19:55:47 GMT'
	var date=new Date()
	date.setDate(date.getDate() + days)
	
	var text = [val,/*'Max-Age=900',*/'Path=/','Expires='+date.toUTCString()].join('; ')
	//console.log('text:','sid='+text)
	//console.log('exam:','sid=123; Max-Age=900; Path=/; Expires=Sat, 17 May 2014 19:55:47 GMT')
	this.cookies[name]=text
}
http.createServer(function(req,res){
	//req handling
	if(handler){
		data=url.parse(req.url, true)
		req.query=data.query
		req.pathname=data.pathname
		req.route=[req.pathname,req.method.toLowerCase()].join(' ')
		handlecookies(req,res)
		
		if(req.method=='POST'){
			var body = ''
			req.on('data', function (data) {
				body += data				
				if (body.length > maxsize) { 
					req.connection.destroy()
				}
			})
			req.on('end', function () {
				req.data=body
				try{
					handler.handler(req,res)
				} catch(err){
					console.log(err.stack)
				}
			})
		} else {
			try{				
				handler.handler(req,res)
			} catch(err){
				console.log(err.stack)
			}		
		}		
	}	
}).listen(port)

//load handler
var fpath=path.resolve(__dirname+'/handler.js')	
try{
	handler=require(fpath)	
} catch(err){
	console.log(err.stack)
}

//watch and reload handler
fs.watch(fpath, function (e, filename) {	
	delete require.cache[fpath]
	try{
		handler=require(fpath)	
	} catch(err){
		console.log(err.stack)
	}
})

console.log('Listening on port '+port)