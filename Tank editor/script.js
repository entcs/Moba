var def = {
    //turret
    dam: [210,70],
    rof: [6, 2],
    acc: [6,-1],
    pene: [180, 30],
    //hull
    track: [30, 10],
    speed: [30, 10],
    armor: [100, 30],
    camo: [50, 1],
    //util
    vision: [300,50],
    radio: [600,100],
    rep: [50, 1],
    hp: [1000, 300],
    pts: 24
}

var tank = {
    //turret
    dam: 0,
    rof: 0,
    acc: 0,
    pene: 0,
    //hull    
    speed: 0,
    track: 0,
    armor: 0,
    hp: 0,
    camo: 0,
    //util
    vision: 0,
    radio: 0,
    rep: 0,    
    pts: def.pts
}
function draw() {
    for (var key in tank) {
        var lab = '<label for="' + key + '">' + key + '</label>'
        if (key == 'pts') {
            inp = '<div class="row"><input type="number" id="' + key + '" value="' + def[key] + '" /></div>';
        } else {
            
            inp = '<div class="row"><input type="number" id="' + key + '" value="' + calc(key) + '" /><button class="add">+</button><button class="sub">-</button></div>';

        }
        $('body').append(lab);
        $('body').append(inp);
    }
}
function calc(key) {
    var val = def[key][0] + tank[key] * def[key][1];
    return val;
}
draw();
$('body').on('click', '.add', function (e) {
    var key = $(e.target).prev().attr('id');
    if (tank[key] < 3 && tank.pts>0) {
        tank[key] += 1;
        tank.pts -= 1;
    }
        
        
    $('#' + key).val(calc(key));
    $('#pts').val(tank.pts);
});
$('body').on('click', '.sub', function (e) {
    var key = $(e.target).prev().prev().attr('id');
    if (tank[key] > 0) {
        tank[key] -= 1;
        tank.pts += 1;
    }
    $('#' + key).val(calc(key));
    $('#pts').val(tank.pts);
});