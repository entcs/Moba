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
    init: function(){
        var form=d.find('#cardcraft')
        this.events()
        form.find('select').trigger('change')
        this.drawtraits()

    },
    events: function(){
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
    }
}
cc.init()
