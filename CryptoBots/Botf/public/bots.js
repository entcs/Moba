var Bots = {
    init: function () {
        this.addevents()
    },
    addevents: function () {
        var addbot = d.find('.addbot')
        addbot.on('click', function (e) {
            console.log('click')
            $.ajax({
                url:'/addbot',
                type:'POST',
                data: 'databody',
                success: function(res){
                    console.log(res)
                }
            })
        })
    }
}
Bots.init()