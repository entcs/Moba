var Bots = {
    init: function(){
        this.addevents()
    },
    addevents: function(){
        var addbot = d.find('.addbot')
        addbot.on('click',function(e){
            console.log('click')
        })
    }
}
Bots.init()