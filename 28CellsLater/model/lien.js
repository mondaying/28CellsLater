Lien = function(lien) {
    lien.type = 'lien';
    lien.validate({
        pDepart: {
            type: 'object',
            usrType: 'cell'
        },
        pArrive: {
            type: 'object',
            usrType: 'cell'
        },
        obstacles: 'array'
    }, errors.throwConstructError);

    var _socket = false;
    var _totalPower = 0;
    
    var _segment = new Segment({
        'pA': lien.pDepart.pos,
        'pB': lien.pArrive.pos
    });
    
    var _id = (function(){
        this.id = this.id || 0;
        return (this.id++);
    })();
    
    if (_getPwrNeeded() > lien.pDepart.pwr ) throw "tropLoin";

    for (var i=0; i<lien.obstacles.length;i++) {
        if (lien.obstacles[i].segment.isIntersecting(_segment)) throw "obstaclePresent";
    }
    
    lien.iInfo = setInterval(_updateInfo,1500);
    
    function _segmentLengthToPwr(length){
        return Math.ceil(length/10);
    }
    
    function _getPwrNeeded(){
        return _segmentLengthToPwr(_segment.getLength());
    }
    
    function _updateInfo(){
        if(!_socket) return;
        var data = {type:"linkInfo" ,linkId:lien.getId(),pwrTot:_totalPower};
        _socket.sendMsg(data);
    };
    
    lien.getCoutPwr = _getPwrNeeded;
    
    lien.getOwner = function(){
        return lien.pDepart.owner;   
    };
    
    lien.cut = function(point){
        var res = point ? _segment.split(point):[_segment];
        var pwrArr = res.map(function(s){return _segmentLengthToPwr(s.getLength());});
        
        if(pwrArr[1]){
            var sender = lien.getOwner();
            lien.pArrive.receivePwr(pwrArr[1],sender);
        }
            
        return pwrArr[0];
    };
    
    lien.remove = function(){
        if(lien.iInfo){
            clearInterval(lien.iInfo);
            lien.iInfo = false;
        }
    }
    
    lien.getId = function(){
        return _id;
    }
    
    lien.getSegment = function(){
        return _segment;
    }
    
    lien.getStatut = function() {
        return (lien.pDepart.owner === lien.pArrive.owner) ? 'friend' : 'attack';
    };

    lien.setSocket = function(sock){
        _socket = sock;
    }

    lien.getBaseInfo = function() {
        return {
            id: lien.getId(),
            fromCell: lien.pDepart.getId(),
            owner: lien.pDepart.getOwner(),
            'pA': lien.pDepart.pos.getData(),
            'pB': lien.pArrive.pos.getData(),
            statut: lien.getStatut()
        };
    }
    

    lien.sendPwr = function(pwr, joueur) {
        
      setTimeout(function () {
        lien.pArrive.receivePwr(pwr, joueur);
        _totalPower+=pwr;
      }, 100);
    };

    return lien;
};