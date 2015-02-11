PartieManager = (function() {
    var _parties = [];
    var _socket = false;
    var _timer = false;
    
    var nb = 0;
    
    function _setSocket(sock){
        _socket = sock;
        
        _socket.addMsgListener(function(d,s){
            _sendState(s);   
         },function(d){return d.type==="getGames";});

        _socket.addMsgListener(_evtNewGame,function(d){return d.type==="newGame";});
        _socket.addMsgListener(_evtJoinGame,function(d){return d.type==="joinGame";});
        
        //_timer = setInterval(_sendState,1000);
    }
    
    function _evtNewGame(data,s){
        console.log("new game request");
        var p = _getNewPartie(2);
        _attachPlayerToGame(p,s);
        _sendState();
    }
    
    function _evtJoinGame(data,s){
        var p = _getExistingPartie(data.gameSelected);
        if(!p || p.isFull()) return;
        
        _attachPlayerToGame(p,s);
        _sendState();
    }
    
    function _attachPlayerToGame(p,sock){
        var idPart = _getIdPartie(p);
        
       sock.extend({
            idPlayer:p.addJoueur(),
            idPartie :idPart
        });
        
        if(!p.isFull()) return;
        
        
        p.setSocket(_socket.getSubset(function(s){
            return s.idPartie===idPart;
        }));
        p.sendBaseInfo();
        p.startGame();
        }

    

    
    function _sendState(toSock){
        var obj = _genObjParties();
        obj.type = "availableGames";
        _socket.sendMsg(obj,function(s){
            return (!s.idPartie) && ((!toSock) || (s===toSock));
        });
        console.log("State sended " + ++nb);

    }
    
    function _genObjParties(){
        var arr = [];
        var nb = 0;
        
        for(var i=0;i<_parties.length;i++){
            var p = _parties[i];
            if(!p.isFull()){
                nb++;
                arr.push({
                  idPart:i,
                  maxJoueur:p.nbJoueur,
                  nbJoueur:p.getNbJoueur()
                });
            }
        }
    return {nbGame:nb,games:arr};
    }
    
    function _getIdPartie(partie) {
        return _parties.indexOf(partie);
    }


    function _getExistingPartie(idPartie) {
        return _parties[idPartie];
    }

    function _partieEnd(part,s){
        for(var i=0;i<s.length;i++){
            s[i].idPart = false;
            s[i].idPartie = false;
        }
    }

    function _getNewPartie(nbPlayer) {
        var choice = Levels.filter(function(l) {
            return l.nbJoueur === nbPlayer
        });
        var partData = choice[Math.floor(Math.random() * choice.length)];
        var part = new Partie(partData.clone());
        _parties.endGame = _partieEnd;

        _parties.push(part);
        return part;
    }



    return {
        setSocket: _setSocket
    };
})();