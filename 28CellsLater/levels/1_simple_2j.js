Levels = [];


(function(levels) {

    var part = {
        nbJoueur: 2,
        cells: [{
            pos: {
                x: 100,
                y: 100
            },
            pwrSpd: 2,
            owner: 1
        },
        {
            pos: {
                x: 700,
                y: 100
            },
            pwrSpd: 2,
            owner: 2
        },
        {
            pos: {
                x: 400,
                y: 200
            },
            pwr: 60,
            maxPwr: 150,
            owner: 0
        }]
    };

   // levels.push(part);

})(Levels);

module.exports = Levels;