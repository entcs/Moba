const express = require('express')
const app = express()
var router = express.Router()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: 'BhVJhNmepZ5x9rwcgmLwGvrKJA78GuuH5YugYHwJomF7rPWNtuBb0lMn9ygbQ10C',
    APISECRET: 'kPAVirgnSCvJM3Uhs1RHufa05jVWMY8Nq2nRgSmPfNKfneNXODBR2QMs81tcc26l'
});

var loop = function (obj, fn) {
    if (obj) {
        if (fn === undefined) {
            var count = 0
            while (obj(count) !== false) count += 1
        } else if (typeof (obj) == 'number') {
            for (var nr = 0; nr < obj; nr++) if (fn(nr) === false) break
        } else if (obj.length) {
            for (var nr = 0; nr < obj.length; nr++) if (obj.hasOwnProperty(nr)) if (fn(nr, obj[nr]) === false) break
        } else {
            for (var key in obj) if (fn(key, obj[key]) === false) break
        }
    }
}
Number.prototype.round = function (round) {
    var pow = Math.pow(10, round || 0)
    return Math.round(this * pow) / pow
}
var PRICES,
    LASTPRICES
var Bots = {
    interval: 1000,
    bots: [],
    init: function () {
        this.run()
    },
    run: function () {
        binance.prices((error, ticker) => {
            loop(ticker, function (k, v) {
                ticker[k] = parseFloat(v)
            })
            LASTPRICES = PRICES
            PRICES = ticker
            //console.log(ticker.ADABUSD, new Date())
            loop(Bots.bots, function (i, bot) {
                bot.run()
            })
            setTimeout(function () {
                Bots.run()
            }, Bots.interval)
        })
    },
    addsnake: function () {
        var bot = {
            type: 'snake',
            sellorders: [],
            step: 1,
            steps: 0,
            volume: 0,
            run: function () {
                this.getprice()
                if (PRICE) {
                    var order = this.sellorders[this.sellorders.length - 1],
                        sellprice = 0,
                        buyprice = 0
                    if (order) {
                        sellprice = order.price * (100 + this.step) / 100
                        buyprice = order.price * (100 - this.step) / 100
                        order.sellprice = sellprice
                        order.buyprice = buyprice
                    }
                    if (!this.sellorders.length || (order && PRICE <= buyprice)) {
                        if (USD >= this.volume && (!this.steps || this.sellorders.length < this.steps)) {
                            this.buy({
                                price: buyprice || PRICE,
                                volume: this.volume
                            })
                        }
                    } else if (PRICE >= sellprice) {
                        //sell
                        this.sell(sellprice)
                    }
                }
            },
            getprice: function () {
                return PRICE
            },
            buy: function (conf) {
                var order = {
                    price: conf.price,
                    volume: conf.volume,
                    time: new Date().getTime(),
                    bot: this
                }
                order.volume = this.volume / order.price
                USD -= this.volume
                ADA += order.volume

                this.sellorders.push(order)
                if (this.sellorders.length > MAXSO) MAXSO = this.sellorders.length
                return order
            },
            sell: function (sellprice) {
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
                if (cv < MIN) {
                    MIN = cv
                } else if (cv > MAX) {
                    MAX = cv
                }
            },
            currentvalue: function () {
                var total = USD + ADA * PRICE
                return total
            }
        }
        this.bots.push(bot)
        return bot
    },
    adddca: function () {
        var bot = {
            type: 'dca',
            dcasellorder: '',
            step: 1,
            steps: 0,
            volume: 0,
            run: function () {
                this.getprice()
                if (PRICE) {
                    var order = this.dcasellorder,
                        sellprice = 0,
                        buyprice = 0
                    if (order) {
                        sellprice = order.price * (100 + this.step) / 100
                        buyprice = order.price * (100 - this.step) / 100
                    }
                    if (!order || (order && PRICE <= buyprice)) {
                        if (USD >= this.volume && (!order || !this.steps || this.dcasellorder.count < this.steps)) {
                            this.buydca({
                                price: buyprice || PRICE,
                                volume: this.volume
                            })
                        }
                    } else if (PRICE >= sellprice) {
                        //sell
                        this.selldca(sellprice)
                    }
                }
            },
            buydca: function (conf) {
                var ordervolume = conf.volume / conf.price
                if (!this.dcasellorder) {
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
                if (this.dcasellorder.count > MAXSO) {
                    MAXSO = this.dcasellorder.count
                }
            },
            selldca: function (sellprice) {
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
                if (cv < MIN) {
                    MIN = cv
                } else if (cv > MAX) {
                    MAX = cv
                }
            },
            currentvalue: function () {
                var total = USD + ADA * PRICE
                return total
            }
        }
        this.bots.push(bot)
        return bot
    },
    log: function () {
        //order value at market price
        var sovalue = 0
        if (bot.sellorders.length) {
            loop(bot.sellorders, function (i, s) {
                sovalue += s.volume * PRICE
            })
        } else if (bot.dcasellorder) {
            sovalue = bot.dcasellorder.volume * PRICE
        }
        if (bot.sellorders.length) {
            var last = bot.sellorders[bot.sellorders.length - 1],
                tobuy = ((last.buyprice - PRICE) * 100 / (last.price * bot.step / 100)).round() + '%'
            tosell = ((last.sellprice - PRICE) * 100 / (last.price * bot.step / 100)).round() + '%'
            console.log(new Date(), PRICE, 'USD:', USD.round(2), '(' + tobuy + ' <0> ' + tosell + ')', 'profit:', PROFIT.round(2), 'SOV:', sovalue.round(2), 'SOCOUNT:', bot.sellorders.length, 'TOTAL:', (USD + sovalue).round(5), 'COUNT:', SOLD, 'MAXSO:', MAXSO, 'MAX:', MAX.round(2), 'MIN:', MIN.round(2))
        }
    }
}
Bots.init()

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));

router.get('/', (req, res) => {
    console.log(req.headers.host)
    res.sendFile('index.html', { root: __dirname })
    //res.send('index.html')
})
router.post('/', function (req, res) {
    res.send('Got a POST request')
})
router.post('/addbot', function (req, res) {
    console.log(req.body)
    res.send('Got addbot request')
})
app.use("/", router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})