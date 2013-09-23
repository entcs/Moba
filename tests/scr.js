var doit=1,
	money=64000,	
	startingbet=1000,
	bet=startingbet

function roll(variation){
	var res=Math.floor(Math.random()*variation)
	if(res==variation) res=roll(variation)
	return res
}
var res,
	count=0,
	days=0
	
while(doit){
	res=roll(37)
	count+=1
	
	if(!res || res%2){
		money-=bet
		//console.log('loss:',bet,money)
		//loss
		bet*=2
		if(bet>money) {
			console.log('broke tries:',count,'days:',days,money)
			break			
		}
	} else {
		//win
		money+=bet		
		console.log('win:',bet,money)		
		break
		
		//console.log('day: '+days)
		bet=startingbet
		days+=1
	}
}