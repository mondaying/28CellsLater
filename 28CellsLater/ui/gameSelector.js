var GameSelect = (function(elem){

    var _socket = false;
    var _showed = false;
    
    var _elemSelected = -1;
    
    elem.querySelector("#select-game").onchange = function(e){
       _elemSelected = parseInt(e.target.value);
    };
    
    elem.querySelector("#createNewG").onclick = function(){
       _socket.sendMsg({type:"newGame", nbJoueur:2});
    };
    
    elem.querySelector("#chooseG").onclick = function(){
        _socket.sendMsg({type:"joinGame", gameSelected:_elemSelected});
    };
    
    function _isShowed(){
        return _showed;
    }
    
    
    function _setSocket(sock){
        _socket = sock;
        _socket.addMsgListener(_updateGames,function(d){ return (d.type==="availableGames")});
    }
    
    function _updateGames(infos){
        elem.querySelector("#nbGame").innerHTML = infos.nbGame;
        
        var selectList = elem.querySelector("#select-game");
        selectList.innerHTML = "";
        
        for(var i=0;i<infos.games.length;i++){
            var g=infos.games[i];
            var opt = document.createElement("option");
            opt.setAttribute("value", g.idPart);
            opt.innerHTML = "Game n°" + g.idPart + " (" + g.nbJoueur + "/" + g.maxJoueur + ")";
            opt.selected =(_elemSelected==g.idPart);
            selectList.appendChild(opt);
        }
    }
    
   

    function _show(){
        elem.querySelector("#showModal").click();
        _showed = true;

        var reqGames = function(){_socket.sendMsg({type:"getGames"});};

        if(_socket.getSocks()[0].readyState === 1)
            reqGames();
        else
            _socket.addMsgListener(reqGames,function(d){ return (d.type==="srvHello")});
                
    }
    
    function _hide(){
        elem.querySelector(".btn-close").click();
        _showed=false;
    }
    
    return {
      setSocket:_setSocket,
      hide:_hide,
      show:_show
    };
    
    
    
})(document.querySelector("#game-select-modal"));