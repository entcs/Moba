var d = document
var db={
    traits:{
        trample:{
            cost:1
        },
        fly:{
            cost:1
        },
        haste:{
            cost:1
        },
        lifelink:{
            cost:1
        },
        deathtouch:{
            cost:1
        },
        firststrike:{
            cost:1
        },
        hexproof:{
            cost:1
        },
        vigilance:{
            cost:1
        },
        doublestrike:{
            cost:2
        }
    }
}
var cc={
    player1:{
        id:'player1',
        deck:[],
        hand:[],
        discard:[]
    },
    player2:{
        id:'player2',
        deck:[],
        hand:[],
        discard:[]
    },
    card: d.find('.card'),
    init: function(){
        //d.find('.card').rem()
        var form=d.find('#cardcraft')
        this.addevents()
        form.find('select').trigger('change')
        this.drawtraits()
        setTimeout(cc.updateareas,0)      
        this.loaddecks()  
    },
    addevents: function(){
        window.onresize = cc.updateareas
        var form=d.find('#cardcraft')
        form.on('change','select',function(e){
            console.log(e)
            var tar = e.target,
                val = parseInt(tar.value),
                name = tar.closest('tr').id,
                pts = cc.formulas[name](val)
            
            form.find('#'+name+' input').value = pts

            var used = cc.used(),
                total = cc.formulas.manacost(parseInt(form.find('#manacost select').val())),
                pts = total - used

            form.find('#manacost input').val(pts)
            form.find('.traits').on('click', function(e){
                var tar = e.target
                tar.togglec('selected')
            })
            d.find('.player1 .deck').on('click',function(e){
                var player = cc[e.target.closest('.player').id]
                cc.drawcard(player)
                cc.showhand(player)
            })
        })
    },
    updateareas: function(e){
            var gamearea = d.find('.gamearea'),
                opponent = gamearea.find('.opponent'),
                thisplayer = gamearea.find('.thisplayer'),
                play = gamearea.find('.play')
            play.height = window.innerHeight - 440 - 4
    },
    showhand:function(player){
        var card,
            hand = d.find('#'+player.id + ' .hand'),
            m
        hand.text('')
        loop(player.hand,function(i,c){
            card=cc.card
            card.find('.title').text(c.name)
            card.find('.manacost').text(c.manacost)
            card.find('.pow').text(c.power+'/'+c.tougness)   
            card.cloneNode(true).to(hand)
        })
        var wid=hand.width/2
        loop(hand.findall('.card'),function(i,card){
            card.position='absolute'
            card.left = hand.width/4+(wid/(player.hand.length+1)-80)+wid/(player.hand.length+1)*(i)
            m = Math.pow(player.hand.length/2-(i+0.5),2)            
            card.top = -player.hand.length*5 + m*2
            m='rotateZ('+(player.hand.length/2-(i+0.5))*-2+'deg)'
            console.log(m)
            card.transform=m
        })
    },
    drawtraits: function(){
        var container = d.find('.traits')
        var div
        loop(db.traits, function(k,v){
            div = container.r('div class=trait').t(k).set('id',k)                        
        })
    },
    used: function(){
        var used = 0,
            form=d.find('#cardcraft')
        loop(form.findall('input.cost'),function(i,inp){
            used+=parseInt(inp.value || 0)
        })
        console.log(used)
        return used
    },
    formulas: {
        manacost: function(val){
            return (val * (val+1)/2) * 2 + val
        },
        draw: function(val){
            return (val * (val+1)/2) * 2
        },
        damage: function(val){
            return (val * (val+1)/2) * 2
        },
        power: function(val){
            return (val * (val+1)/2)
        },
        toughness: function(val){
            return (val * (val+1)/2)
        },
        damage: function(val){
            return (val * (val+1)/2)
        },
        discard: function(val){
            return -(val * (val+1)/2)
        },
    },
    loaddecks: function(player,deck){
        var card
        loop(60,function(i){
            card={
                type: 'creature'+i,
                power:i+1,
                tougness:1,
                manacost:i+1,
                name:'Creature',
                type:'construct'
            }
            cc.player1.deck.push(card)
            cc.player2.deck.push(card)
        })
        cc.updatenumbers()
    },
    updatenumbers: function(){        
        d.find('.player1 .deck').text(cc.player1.deck.length)
        d.find('.player1 .hand').text(cc.player1.hand.length)
        d.find('.player1 .discard').text(cc.player1.discard.length)

        d.find('.player2 .deck').text(cc.player2.deck.length)
        d.find('.player2 .hand').text(cc.player2.hand.length)
        d.find('.player2 .discard').text(cc.player2.discard.length)
        
    },
    drawcard: function(player){
        var card = player.deck.pop()
        player.hand.push(card)
        cc.updatenumbers()
    }
}
cc.init()
