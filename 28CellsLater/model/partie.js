Partie = function(partie) {
    partie.type = 'partie';

    var def = {
        cells:[],
        obstacles:[],
        nbJoueur: 2,
        largeur: 800,
        hauteur: 400
    };

    partie = def.extend(partie);

    partie.validate({
        cells:"array",
        obstacles:"array",
        nbJoueur: "number",
        largeur: "number",
        hauteur: "number"
    }, errors.throwConstructError);

    var _socket = false;
    var _joueurs = [true];
    
    _prepareCell();
    
    
    function _prepareCell() {
        for (var i = 0; i < partie.cells.length; i++){
            if(partie.cells[i].type!=='cell')
                partie.cells[i] = new Cell(partie.cells[i]);
                
            if (!_validCell(partie.cells[i])) throw "Une cellule hors champs à été fournie";
        }
    }

    function _validCell(cell) {
        
        var posMax = new Point({
            x: partie.largeur,
            y: partie.hauteur
        });

        if (cell.pos.isInferieur(posMax)) return cell;
        else return false;
    }
    
    function _getCellById(id){
        for(var i=0;i<partie.cells.length;i++){
            var c = partie.cells[i];
            if(c.getId()===id) return c;
        }
        return false;
    }
    
    function _endGame(){
        clearInterval(partie.timerRun);
        clearInterval(partie.score);
        _socket = false;
    }
    
    function _announceVictory(idPlayer){
        if(partie.ended)return;
        partie.ended = true;
        _socket.sendMsg({type:"endGame",cause:"playerWin", idPlayer: idPlayer});
        _endGame();
        if(typeof(partie.endGame)==="function") 
            partie.endGame(partie,_socket.getSocks());

        _endGame();
    }
    
    function _checkStatePartie(){
        var scores = _genPartieScore();
        var playerAlive = scores.filter(function(s,i){
           return ((s.nbCell)>0&&(i!==0)); 
        });
        
        _socket.sendMsg({type:"scoresInfo", scores:scores});
            
        if(playerAlive.length==1){
            _announceVictory(playerAlive[0].player);
        }
        
    }
    
    function _genPartieScore(){
        var scores = [];
        
        for(var i=0;i<=partie.nbJoueur;i++)
            scores.push(_genScoreForPlayer(i));
            
        return scores;
    }
    
    function _genScoreForPlayer(idPlayer){
        var res = {totalPwr:0,nbCell:0,nbLink:0};
        var totalPwr = 0;
        
        for(var i=0;i<partie.cells.length;i++){
            var c = partie.cells[i];
            var totPwr = c.getTotalPwr();
            totalPwr+=totPwr;
            if(c.getOwner()===idPlayer){
                res.nbCell++;
                res.totalPwr+=totPwr;
                res.nbLink+=c.liens.length;
                res.player=idPlayer;
            }
        }
        
        res.percentagePwr=Math.round(((res.totalPwr/totalPwr)*100));
        return res;
    }
    
    partie.sendBaseInfo = function(){
        var baseInfo = {
            type:'partieInit',
            nbJoueurs: partie.nbJoueur,
            largeur: partie.largeur,
            hauteur: partie.hauteur,
            cells: []
        };
        
        
        partie.cells.forEach(function(c){
           baseInfo.cells.push({
              id:c.getId(),
              type:'cellInit',
              pos:c.pos.getData(),
              owner:c.owner,
              pwr:c.pwr
           });
        });
        
        
        _socket.sendMsg(baseInfo, function(sock,msg){
            msg.idPlayer = sock.idPlayer;
            msg.idPartie = sock.idPartie;
            return true;
        });
    }
    
    
    function _newLinkEvt(data,sock){
        
        var cellA = _getCellById(data.cellA);
        var cellB = _getCellById(data.cellB);
        if(!(cellA && cellB) || (cellA.getOwner()!==sock.idPlayer)) return;
        
        var  link = partie.linkCell(cellA,cellB);
        
        if(link){
            var linkData = link.getBaseInfo();
            linkData.type = "linkInit";
            
            _socket.sendMsg(linkData); 

            
        }
        
    }
    
    partie.linkCell = function(c1, c2) {
        if ((c1 === c2) || (c2.isLinkedWith(c1)) || c1.isLinkedWith(c2)) return;
        return c1.contaminer(c2, partie.obstacles);
    };

    partie.getAllLinks = function() {
        var res = [];
        for (var i = 0; i < partie.cells.length; i++) {
            res = res.concat(partie.cells[i].liens);
        }
        return res;
    };
    
    partie.run = function(){
        for(var i=0;i<partie.cells.length;i++){
            if(partie.cells[i].owner!==0)
                partie.cells[i].run();
        }
    }
    
    //Attention, le joueur neutre est compté
    partie.isFull = function() {
        return _getNbJoueur()===partie.nbJoueur;
    };

    partie.addJoueur = function() {
        if(partie.isFull()) return false;
        var crtJoueur = _getNbJoueur()+1;
        _joueurs[crtJoueur] = true;
        return crtJoueur;
    };
    
    partie.getNbJoueur = _getNbJoueur;
    function _getNbJoueur(){
        return _joueurs.length-1;
    }
    
    partie.setSocket = function(sock){
        _socket = sock;
        
        _socket.addMsgListener(_newLinkEvt,function(d){return d.type=="newLink";});
        
        partie.cells.forEach(function(c){
            c.setSocket(_socket);
        });
    };

    partie.startGame = function(sock){
        partie.timerRun = setInterval(partie.run, 1000);
        partie.score = setInterval(_checkStatePartie,1500);
    };

    return partie;
};