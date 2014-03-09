//general server
var express = require('express'),
	chokidar = require('chokidar'),
	mysql=require('mysql'),	
	app = express(),
	loop=require('./loop.js').loop,
	pth=require('path'),
	connection=mysql.createConnection({
		host: 'localhost',
		port:3333,
		user:'root',
		password:'Loikam22'//,
		//database:'test'
	}),
	fs=require('fs'),
	apps={},
	appspath=pth.resolve(__dirname+'/apps'),	
	tolocalurl=function (url,appname){
		var urlquery=url.split('?'),
			urlp=urlquery[0].split('/'),
			index=urlp.indexOf(appname)
		if(index!=-1){
			urlp.splice(index,1)
		}
		url=urlp.join('/')
		if(urlquery[1]){
			url+='?'+urlquery[1]
		}		
		return url
	},
	handle=function(req,res){
		var parts=req._parsedUrl.pathname.split('/'),
			appname=parts[1],
			action=parts[2],
			query=req.query,
			hres='',
			referer=req.headers.referer		
		if(referer){
			referer=referer.split('?')[0]
			referer=referer.split('/').pop()
		}
		
		if((referer in apps || appname in apps) && req.url!='/'){		
			if(referer){
				appname=referer
			}
			req.url=tolocalurl(req._parsedUrl.pathname,appname)
			var ap=apps[appname]
			if(ap){
				if(ap.handler){
					try {				
						apps[appname].handler(req,res)			
					} catch(err){
						res.send('CORE\n'+err.stack)
					}					
				} else {
					res.send('no handler: '+appname)
				}
			} else {
				console.log('no app:',appname,apps)
				res.send('no app:'+appname)
			}
		} else {
			//file
			var path=pth.resolve([__dirname,req.url].join('/'))	
			if(fs.existsSync(path) && fs.statSync(path).isFile()){
				console.log('server send file:',path)
				res.sendfile(path)
			} else {
			//action
				var hres=['<div>apps</div>']
				loop(apps,function(k,v){
					hres.push('<button class="'+k+'" onclick="location.href=\'/'+k+'\';" >'+k+'</button>')
				})
				hres.push('<div class="controls"><button class="addapp">add app</button></div>')
				res.send(hres.join(''))
			}
		}
	
	}
	
 
var s={
	watcher:chokidar.watch(appspath, {ignored: /^\./, persistent: true}),
	getapppath:function(path){
		var apppath=path.replace(appspath,'').substring(1),
			parts=apppath.split('\\'),
			appname=parts.shift(),
			filename=parts.join('\\')
			
		return {
			app:appname,
			file:filename
		}
	},
	addapp:function(name){
		console.log('new app:',name)
		var a={
			name:name,
			handler:0,
			sethandler:function(){				
				var hpath=pth.resolve(appspath,this.name,'handler.js')
				if(fs.existsSync(hpath)){
					delete require.cache[hpath]
					try {
						var handler=require(hpath)
						if(handler && handler.handler){
							this.handler=handler.handler						
							console.log('sethandler:',this.name)
						} else {
							console.log('ERROR:',this.name,'handler.handler missing')
						}						
					} catch (err){
						console.log('\nERROR:',err.stack+'\n')
					}					
				}				
			},
			remhandler:function(){
				console.log('remhandler:',this.name)
			}
		}
		apps[name]=a
		return a
	},
	addwatcherevents:function(){
		s.watcher
			.on('add', function(path) {
				var data=s.getapppath(path)		
				if(!(data.app in apps)){
					apps[data.app]=s.addapp(data.app)
				}
				
				if(data.file=='handler.js'){
					var a=apps[data.app]
					a.sethandler()
				}
			})	
			.on('change', function(path) {
				var data=s.getapppath(path)				
				if(data.file=='handler.js'){
					var a=apps[data.app]
					a.sethandler()
					console.log(data.app,'handler change')
				}		
			})
			.on('unlink', function(path) {
				var data=s.getapppath(path)				
				if(data.file=='handler.js'){
					console.log('rem handler and rem app:',data.app)
					var a=apps[data.app]
					a.remhandler()
					delete apps[data.app]					
				}		
				
			})
			.on('error', function(error) {console.error('Error happened', error);})
			
	}
}
s.addwatcherevents()	
	
app.use(express.bodyParser())	
connection.connect()	

app.get('*',function(req,res){
	handle(req,res)
})
app.post('*',function(req,res){
	handle(req,res)
})

app.listen(2222)
console.log('Listening on port 2222')
/* empty handler
exports.handler=function(req,res){	
	if(req.url=='' || req.url=='/'){
		req.url='/index.html'
	}
	var parts=req.url.split('?')[0].split('/'),
		controller=parts[1],
		action=parts[2]
		query=req.query,
		method=req.method.toLowerCase(),
		hres='not handled',
		referer=req.headers.referer		
	
	//file
	var path=pth.resolve([__dirname,req.url].join('/'))		
	if(fs.existsSync(path) && fs.statSync(path).isFile()){
		res.sendfile(path)
	} else {
	//action
		if(controller in handle){
			if(action in handle[controller]){
				if(method in handle[controller][action]){
					handle[controller][action][method](req,res)		
				} else {
					res.send(appname+' '+controller+' '+action+' no method: '+method)
				}
				
			} else {
				res.send( appname+' '+controller+' no action: '+action)
			}
		} else {
			res.send( appname+' no controller: '+controller)
		}		
	}
}
*/
