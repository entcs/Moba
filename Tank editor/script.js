var def = {
    //turret
    dam: {
        val: 200,
        add: 50,
        weight: 10,
        aff: {
            ammo: -1,
            rof: -1,
            acc: -1,
            pene: 1,
            tturn: -1
        }
    },
    ammo: {
        val: 20,
        add: 5,
        weight: 10,
        aff: {
            spd: -1,
            turn: -1
        }
    },
    rof: {
        val: 6,
        add: 2,
        weight: 0,
        aff: {
            acc: -1,
            tturn: -1
        }
    },
    acc: {
        val: 0.5,
        add: -0.05,
        weight: 0,
        aff: {
            tturn: -1
        }
    },
    pene: {
        val: 150,
        add: 35,
        weight: 10,
        aff: {
            dam: -1
        }
    },
    turn: {
        val: 30,
        add: 10,
        weight: 10,
        aff: {
            spd: -1
        }
    },
    spd: {
        val: 30,
        add: 10,
        weight: 200,
        aff: {

        }
    },
    armor: {
        val: 100,
        add: 50,
        weight: 2000,
        aff: {
            turn: -1,
            tturn: -1,
            camo: -1
        }
    },
    camo: {
        val: 100,
        add: 20,
        weight: 20,
        aff: {

        }
    },
    vis: {
        val: 300,
        add: 50,
        weight: 10,
        aff: {
            acc: 1
        }
    },
    radio: {
        val: 600,
        add: 100,
        weight: 10,
        aff: {

        }
    },
    repair: {
        val: 100,
        add: 20,
        weight: 50,
        aff: {

        }
    },
    hp: {
        val: 1000,
        weight: 1000,
        add: 300,
        aff: {}
    },
    pts: 12,
    weight: 10000
}
var tank = {}
for (var key in def) {
    switch (key) {
        case 'pts':
        case 'weight':
            tank[key] = def[key];
            break;
        default:
            tank[key] = 0;
            break;
    }    
}

function draw() {
    for (var key in tank) {
        var lab = '<label for="' + key + '">' + key + '</label>'
        switch (key) {
            case 'pts':
            case 'weight':
                inp = '<div class="row"><input type="number" id="' + key + '" value="' + def[key] + '" /></div>';
                break;
            default:
                inp = '<div class="row"><input type="number" id="' + key + '" value="' + calc(key) + '" /><button class="add">+</button><button class="sub">-</button></div>';
                break;

        }
        $('body').append(lab);
        $('body').append(inp);
    }
}
function calc(key) {
    var val = def[key].val + tank[key] * def[key].add;
    calcweight();
    return val;
}
function calcweight() {
    var weight=0;
    for (var key in def) {
        var obj = def[key];
        if (obj.weight) {            
            weight += obj.weight*tank[key];
        }
    }
    weight += def.weight;
    $('#weight').val(weight);
    return weight;
}
draw();
$('body').on('click', '.add', function (e) {
    var key = $(e.target).prev().attr('id');
    if (tank[key] < 4 && tank.pts>0) {
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