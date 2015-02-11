var CellUi = function(cellUi){
    cellUi.type = "CellUi";

    cellUi.validate({
                model:{type:'object', usrType:'cellInit'},
                ctx:'object',
                socket:'object'
                }, errors.throwConstructError);


    var _baseCercle = new Cercle({center:new Point(cellUi.model.pos),rayon:_genRayon()})
    var _cercleUi = new CercleUi({model:_baseCercle,ctx:cellUi.ctx}.extend(_getCircleParam()));
    var _curStatus = 'normal';
    
    cellUi.socket.addMsgListener(_updateInfo,function(d){ return (d.type==="cellStatus") && (d.id===cellUi.model.id);});
    
    
    function _genRayon(){
        var taille = Math.log((cellUi.model.pwr/40)+1);
        //var taille = Math.max(pwr,25); 
        return Math.max(14,(taille * 30)) ;
    }
    
    function _refreshRayon(){
        _baseCercle.rayon = _genRayon();
    }
    
    function _setCurStatut(status){
        cellUi.curStatus=status;
    }
    
    function _getCurStatut(){
        return cellUi.curStatus || 'normal';
    }

    
    function _getCircleParam(){
        var circleConf =  UiConf.players[cellUi.model.owner].cell[_getCurStatut()].circle;
        return circleConf;
    }
    
    function _getTextParam(){
        var textConf = UiConf.players[cellUi.model.owner].cell[_getCurStatut()].font;
        textConf.font = textConf.font.replace(/\d+px/,Math.floor(_genRayon())+'px');
        return textConf;
    }
    
    function _updateInfo(data){
        if(cellUi.enCours) return;
        cellUi.encCours = true;
        if(cellUi.efx)
            clearTimeout(cellUi.efx);
        
        var diff = (data.pwr - cellUi.model.pwr);
        var isNeg = function(){return ((data.pwr - cellUi.model.pwr) < 0)};
        
        var funcDraw = function(){
            if(cellUi.model.pwr === data.pwr) { 
                setTimeout(function(){cellUi.enCours = false;},200);
                cellUi.model.owner = data.owner;
                if(typeof(cellUi.pwrEvt)=="function") cellUi.pwrEvt();
            }else{
                if(isNeg())cellUi.model.pwr--;
                else cellUi.model.pwr++;
                
                cellUi.efx = setTimeout(funcDraw,20);
            }
            
            _draw();
        };
        funcDraw();
    };
    

    
    function _drawText(){
        cellUi.ctx.extend(_getTextParam());
        var text = cellUi.model.pwr;
        var centre = _cercleUi.getCenter();
        var width = cellUi.ctx.measureText(text).width;
        var height = cellUi.ctx.measureText("w").width;
        cellUi.ctx.fillText(text, centre.x - (width/2) ,centre.y + (height/2));
    }
    
  
    function _drawCircle(){
        _cercleUi.extend(_getCircleParam());
        _cercleUi.draw();
    }
    
    
    cellUi.draw = _draw;
    function _draw(){
        _cercleUi.clear(cellUi.ctx);
        _refreshRayon();
        _drawCircle(cellUi.ctx);
        _drawText(cellUi.ctx);
    }
    
    function _resetStatut(){
        _changeStatut('normal');
    }
    
    function _changeStatut(status){
        if(_getCurStatut()!=status){
            _setCurStatut(status);
            _draw();
        }
    }
    
    cellUi.getCenter =function(){
        return cellUi.model.pos;
    }

    cellUi.unSelect=function(){
        _resetStatut();
    }
    
    cellUi.trySelect =function(point , joueur){
        var selected = (_cercleUi.isClickInside(point) && (cellUi.model.owner===joueur));
        
        if(!selected)
            return false;
            
        _changeStatut('selected');
        
        return cellUi;
    }
    
    cellUi.enoughPwr = function(seg){
        return seg.getLength() <  (cellUi.model.pwr * 10);
    }
    
    cellUi.tryOver = function(point, player, drawStatus) {
        var over = _cercleUi.isClickInside(point);

        if (_getCurStatut() == 'selected') return;

        if (!over) {
            _resetStatut();
            return false;
        }

        if (
        (drawStatus === "link") || ((drawStatus === "nothing") && (cellUi.model.owner === player))) {
            _changeStatut('over');
            _draw();
            return cellUi;
        }

        _resetStatut();
        return false;
    }
    

    return cellUi;
};