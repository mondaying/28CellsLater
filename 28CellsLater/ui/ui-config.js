var UiConf = UiConf || {};


(function(conf) {
    var standardBase = {
        font: {
            fillStyle: 'white',
            font: "bold  12px sans-serif"
        },
        circle: {
            lineWidth: 2,
            fillStyle: "green",
            strokeStyle: 'white'
        }
    };



    var buildCell = function(diff) {
        return standardBase.clone().extend(diff);
    };


    var pNeutre = {
        mainColor:'grey',
        cell: {
            normal: buildCell({
                circle: {
                    fillStyle: 'grey'
                }
            }),
            selected: buildCell({
                circle: {
                    fillStyle: 'grey'
                },
                font: {
                    fillStyle: 'black'
                }
            }),
            over: buildCell({
                circle: {
                    fillStyle: 'grey',
                    strokeStyle: 'yellow'
                }
            })
        }
    };

    var p1 = {
        mainColor:'#8d25c0',
        link : {friend :  {strokeStyle:'#8d25c0'}, attack: {strokeStyle:'#8d25c0'}},
        cell: {
            normal: buildCell({
                circle: {
                    fillStyle: '#8d25c0'
                }
            }),
            selected: buildCell({
                circle: {
                    fillStyle: 'yellow'
                },
                font: {
                    fillStyle: 'black'
                }
            }),
            over: buildCell({
                circle: {
                    fillStyle: '#8d25c0',
                    strokeStyle: 'yellow'
                }
            })
        }
    };


    var p2 = {
        mainColor:'#3498DB',
        link : {friend :  {strokeStyle:'#3498DB', lineWidth:3}, attack: {strokeStyle:'#3498DB', lineWidth:3}},
        cell: {
            normal: buildCell({
                circle: {
                    fillStyle: '#3498DB'
                }
            }),
            selected: buildCell({
                circle: {
                    fillStyle: 'yellow'
                },
                font: {
                    fillStyle: 'black'
                }
            }),
            over: buildCell({
                circle: {
                    fillStyle: '#3498DB',
                    strokeStyle: 'yellow'
                    
                }
            })
        }
    };
    
    conf.arrowStyle = {
        allowed: {
            strokeStyle:"green",
            fillStyle:"white",
            lineWidth:3
        },
        denied: {
            strokeStyle:"red",
            lineWidth:3
        }
    };
    
    conf.lineCut ={
        fillStyle:"black",
        lineWidth:4
    };

    conf.players = [
    pNeutre,
    p1,
    p2];

})(UiConf);
