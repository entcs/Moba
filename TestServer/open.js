var fs=require('fs')		
	path=require('path'),
	dirname=process.cwd()

function open(name,callback,onclose){
	this.id='openfn'
	var fpath=path.resolve(dirname,name)
	if(fs.existsSync(fpath)){
	
		var module=require(fpath)	
		callback(module)	
		fs.unwatchFile(fpath);
		fs.watchFile(fpath,{ persistent: true, interval: 1000 }, function (curr, prev) {
			if (curr.mtime!=prev.mtime){
				if(onclose) onclose(module)
				delete require.cache[fpath];
				module=require(fpath)			
				callback(module)
			}
		})
	}
}
exports.open=open