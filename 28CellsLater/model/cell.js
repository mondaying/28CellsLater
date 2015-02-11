Cell = function(cell) {
    cell.type = 'cell';
    var def = {
        pwr: 15,
        maxPwr: 100,
        pwrSpd: 1,
        owner:0
    };

    cell = def.extend(cell);
    
    if(cell.pos.type!=='point')
        cell.pos = new Point(cell.pos);
    
    
    cell.validate({
        maxPwr: 'number',
        pwrSpd: 'number',
        pwr:'number',
        pos: {
            type: 'object',
            usrType: 'point'
        },
        owner: 'number'
    }, function(){console.log(arguments);});

    var startPwr = cell.pwr;
    var _socket = false;
    cell.liens = [];
    
    
    var _id = (function(){
        this.id = this.id || 0;
        return (this.id++);
    })();

    function _notifyChange (){
      if(!_socket) throw "Erreur une cellule ne peut pas transmettre ces informations";
      
      var stateReport = {type:"cellStatus",id:_id,pwr:cell.pwr,owner:cell.owner};
      _socket.sendMsg(stateReport);
    };
    

    
    
    function _incrPwr(pwr) {
        cell.pwr += pwr;
        if (cell.pwr > cell.maxPwr) cell.pwr = cell.maxPwr;
    };

    function  _decPwr(pwr) {
        cell.pwr -= pwr;
    };

    var _sendPwr = function(pwr) {
        if (!_hasLien()) return;

        var ar = _getLienOfType('attack');

        if (ar.length === 0) ar = _getLienOfType('friend');

        ar[Math.floor(Math.random() * ar.length)].sendPwr(pwr, cell.owner);
    };

    function _evtCutLink(data){
        var pIntersect = new Point(data.cutPoint);
        var lienDel = _supprimerLienById(data.linkId,pIntersect);
        if(lienDel){
            var resp = { type:"linkDel", linkId:lienDel.getId()};
            _socket.sendMsg(resp);
        }
    }

    function _getLienOfType(statutLien) {
        var res = [];
        cell.liens.map(function(v) {
            if (v.getStatut() === statutLien) res.push(v);
        });
        return res;
    };

    function _hasLien() {
        return (cell.liens.length > 0);
    };

    var _addPwr = function(pwr) {
            if (_hasLien()) _sendPwr(pwr);
            else _incrPwr(pwr);
    };

    var _changeOwner = function(newOwner) {
        var baseOwner = cell.owner;
        cell.owner = newOwner;
        cell.liens = [];

        if(baseOwner===0){
            cell.receivePwr(Math.ceil(startPwr/2),newOwner);
        }
    };
    
    var _getBackLinks =function(){
            var pwrFromLinks = 0;
            for(var i=0; i < cell.liens.length ; i ++){
                l = cell.liens[i];
                pwrFromLinks+=l.cut();
                var resp = { type:"linkDel", linkId:l.getId()};
                _socket.sendMsg(resp);
            }
        cell.liens = [];
        cell.receivePwr( pwrFromLinks, cell.owner);
    }
    
    cell.isFull = function() {
        return cell.pwr == cell.maxPwr;
    };
    
    cell.isLinkedWith = function(c2){
        for(var i=0; i < cell.liens.length ; i ++){
            if (cell.liens[i].pArrive.isEqual(c2))
                return true;
        }
        return false;
    }
    
    cell.getTotalPwr= function(){
      var tot = cell.pwr;
      
      for(var i=0;i<cell.liens.length;i++){
          tot+=cell.liens[i].getCoutPwr();
      }
      return tot;
    };
    
    cell.getId = function(){
        return _id;
    }
    
    cell.receivePwr = function(pwr, usr) {
        if (usr === cell.owner) _addPwr(pwr);
        else {
            if(pwr <= cell.pwr)
                _decPwr(pwr);
            else{
                 var totPwr = cell.getTotalPwr();
                 if(totPwr >= pwr){
                     _getBackLinks();
                 }else{
                        var pwrSupp = pwr - totPwr;
                        _changeOwner(usr);
                        cell.pwr+=pwrSupp;
                    }
            }
        }
        _notifyChange(this);
    };
    
    cell.run = function() {
        var newPwr = cell.pwrSpd;
        _addPwr(newPwr);
        _notifyChange(this);
    };
    
    cell.getOwner = function(){
      return cell.owner;  
    };

    cell.contaminer = function(otherCell, obs) {
        var lien = false;
        try {
            lien = new Lien({
                pDepart: this,
                pArrive: otherCell,
                obstacles: obs
            });
            cell.liens.push(lien);
            _decPwr(lien.getCoutPwr());
        }
        catch (err) {
            console.log(err);
            _socket.sendMsg({type:"gameMsg",msg:err},function(s){
                return (s.idPlayer===cell.getOwner());
            });
        }
        
        if(lien)
            lien.setSocket(_socket);
        
        return lien;
    };
    
    function _supprimerLienById(id,intersect){
        var arrLiensKeep = [];
        var lienDel = false;
        var pwrKeep=0;

        for (var i = 0; i < cell.liens.length; i++) {
            var link = cell.liens[i];
            if (link.getId()===id){
                lienDel = link;
                pwrKeep=lienDel.cut(intersect);
            } 
            else arrLiensKeep.push(cell.liens[i]);
        }
        cell.liens = arrLiensKeep;
        cell.receivePwr(pwrKeep,cell.owner);
        
        if(lienDel) lienDel.remove();
        return lienDel;
    }
    
    
    cell.isEqual = function(c2){
          return (cell.pos.isEqual(c2.pos));
    };


    cell.setSocket = function(sock){
        _socket = sock;
        _socket.addMsgListener(_evtCutLink,function(d,s){
            return ((d.baseCell===cell.getId()) && cell.getOwner() === s.idPlayer);
        });
    };


    return cell;
};