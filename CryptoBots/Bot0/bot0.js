	var PRICE = 0,
        LASTPRICE = 0,
		SOLD = 0,
		PROFIT = 0,
		FEECOUNT = 0,
		FEEAMOUNT = 0,
		MAX = 0,
		MIN = Number.MAX_VALUE,
		MININDEX = 0,
		MAXINDEX = 0,
		MAXCOUNT = 0,
		SOCOUNT = 0,
		ENDINDEX = 0,
		MAXSO = 0
		ADA = 0,
		USD = 1000,
        LOGINDEX = 0

	var loop=function(obj,fn){
		if(obj){
			if(fn===undefined){
				var count=0
				while(obj(count)!==false) count+=1
			} else if(typeof(obj)=='number'){
				for(var nr=0;nr<obj;nr++) if(fn(nr)===false) break
			} else if(obj.length){
				for(var nr=0;nr<obj.length;nr++) if(obj.hasOwnProperty(nr)) if(fn(nr,obj[nr])===false) break
			} else {
				for(var key in obj) if(fn(key,obj[key])===false) break
			}
		}
	}
	Number.prototype.round=function(round){
	var pow = Math.pow(10,round||0)
	return Math.round(this*pow)/pow
}	
	var bot = {
		sellorders: [],
		dcasellorder: '',
		sellstep: 1,
		buystep: 1,
		averageprice: 0,
		steps: 0,
		volume: 10,
		dosnake: function(){					
			this.getprice()		
			if(PRICE){			
				var order = this.sellorders[this.sellorders.length - 1],
					sellprice = 0,
					buyprice = 0
				if(order){
					sellprice = order.price * (100+this.sellstep)/100
					buyprice = order.price * (100-this.buystep)/100
                    order.sellprice = sellprice
                    order.buyprice = buyprice
				}
				if(!this.sellorders.length || (order && PRICE <= buyprice)){
					if(USD >= this.volume && (!this.steps || this.sellorders.length < this.steps)){
						this.buy({
							price: buyprice || PRICE,
							volume: this.volume
						})
					}
				} else if(PRICE >= sellprice) {						
					//sell
					this.sell(sellprice)
				}	
			}				
		},
		getprice: function(){
			//PRICE = parseFloat(DATA[INDEX][6])            
			return PRICE
		},
		buy: function(conf){
			var order = {
				price: conf.price,
				volume: conf.volume,
				time: new Date().getTime(),
				bot: this
			}		
			order.volume = this.volume/order.price					
			USD -= this.volume
			ADA += order.volume

			this.sellorders.push(order)
			if(this.sellorders.length > MAXSO) MAXSO = this.sellorders.length
			return order			
		},
		sell: function(sellprice){					
			var order = this.sellorders.pop(),
				ordertotal = order.volume * order.price,
				total = order.volume * sellprice

			/**/
			//subtract fee 0.1% in binance			
			var fee = total * 0.001//0.001
			total -= fee
			FEEAMOUNT += fee

			USD += total
			ADA -= order.volume		
			var profit = total - ordertotal
			PROFIT += profit
			SOLD += 1
			var cv = this.currentvalue()
			if(cv<MIN){
				MIN = cv
				MININDEX = INDEX
			} else if(cv>MAX){
				MAX = cv
				MAXINDEX = INDEX
			}
		},
		dodca: function(){
			this.getprice()		
			if(PRICE){			
				var order = this.dcasellorder,
					sellprice = 0,
					buyprice = 0
				if(order){
					sellprice = order.price * (100+this.sellstep)/100
					buyprice = order.price * (100-this.buystep)/100
				}
				if(!order || (order && PRICE <= buyprice)){
					if(USD >= this.volume && (!order || !this.steps || this.dcasellorder.count < this.steps)){
						this.buydca({
							price: buyprice || PRICE,
							volume: this.volume
						})
					}
				} else if(PRICE >= sellprice) {						
					//sell
					this.selldca(sellprice)
				}	
			}	
		},		
		buydca: function(conf){
			var ordervolume = conf.volume/conf.price
			if(!this.dcasellorder){
				this.dcasellorder = {
					price: conf.price,
					volume: ordervolume,
					count: 1
				}	
			} else {
				this.dcasellorder.price = (this.dcasellorder.price * this.dcasellorder.volume + conf.volume) / (this.dcasellorder.volume + ordervolume)
				this.dcasellorder.volume += ordervolume
				this.dcasellorder.count += 1				
			}

			USD -= conf.volume
			ADA += ordervolume
			if(this.dcasellorder.count > MAXSO) 
			{
				MAXSO = this.dcasellorder.count
			}
		},
		selldca: function(sellprice){
			var order = this.dcasellorder,					
				ordertotal = order.volume * order.price,
				total = order.volume * sellprice

			/**/
			//subtract fee 0.1% in binance			
			var fee = total * 0.001//0.001
			total -= fee
			FEEAMOUNT += fee

			USD += total
			ADA -= order.volume		
			var profit = total - ordertotal
			PROFIT += profit
			SOLD += 1
			this.dcasellorder = ''
			this.dcabuycount = 0
			var cv = this.currentvalue()
			if(cv<MIN){
				MIN = cv
				MININDEX = INDEX
			} else if(cv>MAX){
				MAX = cv
				MAXINDEX = INDEX
			}			
		},
		currentvalue: function(){
			var total = USD + ADA*PRICE
			return total
		}
	}		
		
	var log = function(){
		//order value at market price
		var sovalue = 0
		if(bot.sellorders.length){
			loop(bot.sellorders, function(i,s){
				sovalue += s.volume * PRICE
			})
		} else if (bot.dcasellorder){
			sovalue = bot.dcasellorder.volume * PRICE
		}		
        var last = bot.sellorders[bot.sellorders.length-1],
        tobuy = ((last.buyprice - PRICE)*10000/PRICE).round()+'%',
        tosell = ((last.sellprice - PRICE)*10000/PRICE).round()+'%'
		console.log(PRICE,'USD:', USD.round(2) ,'('+ tobuy +' <0> '+tosell+')','profit:', PROFIT.round(2),'SOV:',sovalue.round(2),'SOCOUNT:',bot.dcasellorder.count,'TOTAL:', (USD+sovalue).round(5), 'COUNT:',SOLD, 'MAXSO:',MAXSO, 'MAX:',MAX.round(2),'MIN:',MIN.round(2))
	}

//BOT0

    const Binance = require('node-binance-api');
    const binance = new Binance().options({
      APIKEY: 'BhVJhNmepZ5x9rwcgmLwGvrKJA78GuuH5YugYHwJomF7rPWNtuBb0lMn9ygbQ10C',
      APISECRET: 'kPAVirgnSCvJM3Uhs1RHufa05jVWMY8Nq2nRgSmPfNKfneNXODBR2QMs81tcc26l'
    });
    var change = 0
    function getada(){
        binance.prices('ADABUSD', (error, ticker) => {
            LASTPRICE = PRICE
            PRICE = ticker.ADABUSD            
            bot.dosnake()

            tosell = 0    
            log()
        })
    }
    
    function doit (){
        getada()
        setTimeout(function(){
            doit()
        },10000)
    }
    doit()
