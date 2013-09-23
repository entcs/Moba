var fs=require('fs')		
	path=require('path'),
	dirname=process.cwd()

function open(name,fn){
	this.id='openfn'
	var fpath=path.resolve(dirname,name),
		module=require(fpath)	
	fn(module)	
	fs.unwatchFile(fpath);
	fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
		if (curr.mtime!=prev.mtime){										
			delete require.cache[fpath];
			module=require(fpath)			
			fn(module)
		}
	})
}
exports.open=open