console.log("mm");
g = {
    pls: {},
    que: [],
    nrgames: 12,
    teamsize: 2,
    maxpls: 24,
    gcount: 3,
    games: {},
    addpl: function () {
        var name = 'pl-'+new Date().getTime().toString().substring(9, 13);
        while (g.pls[name]) {
            name = 'pl-' + new Date().getTime().toString().substring(9, 13);
        }
        var pl = {
            name: name,
            games:[],
            rating: 0,
            status:'idle'
        }

        for (var nr = 0; nr < this.nrgames; nr++) {
            pl.games.push(0);
        }
        g.pls[pl.name] = pl;
        return pl;
    },
    addgame: function (pls) {
        var name = 'game-' + new Date().getTime().toString().substring(9, 13);
        while (g.games[name]) {
            name = 'game-' + new Date().getTime().toString().substring(9, 13);
        }
        var game = {
            name: name,
            pls: pls
        }
        g.games[name] = game;
        return game;
    },
    Count: function(obj){
        var count=0;
        for (var key in obj) {
            count++;
        }
        return count;
    },
    loop: function () {

        //endgames
        if (g.games) {
            for (var key in g.games) {
                //compare pl skill
                var game = g.games[key];
                for (var nr in game.pls) {
                    var pl = g.pls[game.pls[nr]];
                    pl.status = 'idle';
                }
                red = game.pls.splice(0, g.teamsize),
                blu = game.pls;

                if (g.gcount == 0) {
                    delete g.games[key];
                    g.gcount = 3;
                } else {
                    g.gcount--;
                }

            }
        }


        //que up
        for (var key in g.pls) {
            var pl = g.pls[key];
            if (pl.status == 'idle' && g.que.indexOf(pl.name)==-1) {
                pl.status = 'que';
                g.que.push(pl.name);
            }
        }
        //match
        if (g.que.length >= g.teamsize * 2) {
            var gpls = g.que.splice(0, g.teamsize * 2);
            for (var nr in gpls) {
                var pl = g.pls[gpls[nr]];
                pl.status = 'ingame';
            }
            //create game
            g.addgame(gpls);
        }

        //console.log('PLS: '+g.maxpls,'QUE: '+g.que.length,'INGAME: '+g.Count(g.games)*g.teamsize*2);
        
        setTimeout(function () {
            g.loop()
        },1000)
    }
};
for (var nr = 0; nr < g.maxpls; nr++) {
    g.addpl();
}
console.log(g.pls);
g.loop();