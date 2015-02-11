(function(levels) {

    var part = {
        nbJoueur: 2,
        cells: [{
            pos: {
                x: 100,
                y: 200
            },
            pwrSpd: 2,
            owner: 1
        }, {
            pos: {
                x: 700,
                y: 100
            },
            pwrSpd: 2,
            owner: 2
        }, {
            pos: {
                x: 250,
                y: 100
            },
            pwr: 30,
            maxPwr: 150,
            owner: 0,
            pwrSpd: 3
        }, {
            pos: {
                x: 700,
                y: 200
            },
            pwr: 40,
            maxPwr: 150,
            owner: 0,
            pwrSpd: 3
        }, {
            pos: {
                x: 500,
                y: 300
            },
            pwr: 30,
            maxPwr: 150,
            owner: 0,
            pwrSpd: 2
        }, {
            pos: {
                x: 260,
                y: 170
            },
            pwr: 50,
            maxPwr: 150,
            owner: 0,
            pwrSpd: 2
        }, {
            pos: {
                x: 450,
                y: 100
            },
            pwr: 30,
            maxPwr: 150,
            owner: 0,
            pwrSpd: 2
        }, {
            pos: {
                x: 200,
                y: 60
            },
            pwr: 70,
            maxPwr: 200,
            owner: 0,
            pwrSpd: 3
        }, {
            pos: {
                x: 760,
                y: 350
            },
            pwr: 30,
            maxPwr: 150,
            owner: 0,
            pwrSpd: 4
        }]
    };

    levels.push(part);

})(Levels);