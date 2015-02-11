var UiMain = function(uiMain) {
    UiMain.type = 'UiMain';

    uiMain.validate({
        gameScreen:'object',
        cvObs:'object',
        cvLiens:'object',
        cvCells:'object',
        cvDraw:'object',
        cvAnims:'object'
    }, errors.throwConstructError);
    
    var _gameSelect = false;
    
    var _socket = false;
    
    var _ctx = {
            obs : uiMain.cvObs.getContext('2d'),
            liens : uiMain.cvLiens.getContext('2d'),
            cells : uiMain.cvCells.getContext('2d'),
            draw : uiMain.cvDraw.getContext('2d'),
            anims : uiMain.cvAnims.getContext('2d'),
            clearAll: function(){
                    for (var p in this) {if(typeof(this[p])=="object"){ui.clearCanvas(this[p]);}}
            }
            };
    var _fromPoint = false;
    var _toPoint = false;
    
    var _baseCell =  false;
    var _overCell = false; 
    
    var _curSegment = false;
    
    var _partieUi = false;
    
    document.getElementById('connectBtn').onclick = function(){
            connect();
    }
    
    
    
    

    
    function mouseDown(e){
        var p = ui.getInnerPos(this,e);
        _fromPoint = p;
        _toPoint = p;
        selectCells(p);
    }
    
    
    function mouseMove(e){
        var p = ui.getInnerPos(this,e);
        _toPoint = p;
        
        overCells(p);
        
        if(!(_baseCell || _fromPoint)) return;
            
        refreshSegment();
        
        if(_baseCell){
            if(!_baseCell.pwrEvt)_baseCell.pwrEvt=refreshArrow;
            refreshArrow();
        }
        else
            refreshLine();
    }
    

    
    function mouseUp(e){
        if(_baseCell && _overCell){
            _partieUi.linkCell(_baseCell,_overCell);
        }else{
            if(getDrawStatus()=='line' && _curSegment)
                _partieUi.cutLiens(_curSegment);
        }
            
        
        resetDrawZone();
    }
    
    function getDrawStatus(){
        if(_baseCell) return 'link';
        if(_fromPoint) return 'line';
        return 'nothing';
    }
    
    function overCells(p){
        _overCell = _partieUi.overBase(p,getDrawStatus());
        if(_overCell)
            changeCursor("pointer");
        else changeCursor("default");
    }
    
    function changeCursor(cur){
        uiMain.gameScreen.style.cursor=cur;
    }
    
    function selectCells(p){
        if(_baseCell) _baseCell.pwrEvt = false;
        _baseCell = _partieUi.selectBase(p);
        if(!_baseCell) return;
        _fromPoint = _baseCell.getCenter();
        refreshArrow();
    }
    
    function refreshSegment(){
        _curSegment = new Segment({pA:_fromPoint,pB:_toPoint});
    }
    
    function refreshArrow(){
        if(!_baseCell) return;
        clearDrawZone();
        var arrowState = (_curSegment && _baseCell.enoughPwr(_curSegment)) ? 'allowed':'denied';
        _ctx.draw.extend(UiConf.arrowStyle[arrowState]);
        ui.canvas_arrow(_ctx.draw,_fromPoint,_toPoint);
        _ctx.draw.stroke();
    }
    
    
    
    function refreshLine(){
        clearDrawZone();
        ui.canvas_line(_ctx.draw,_fromPoint,_toPoint);
        _ctx.draw.stroke();
    }
    
    function resetDrawZone(){
        _fromPoint = false;
        _toPoint = false;
        _baseCell =  false;
        _overCell = false; 
        _curSegment = false;
        _partieUi.unSelectAllBase();
        clearDrawZone();
    };
    
    function clearDrawZone(){
        ui.clearCanvas(_ctx.draw);
    }
    
    function getConnectPath(){
        var webSite= window.location.href;
        if( window.location.href.indexOf("c9.io")>0)
            return 'wss://28cellslater-c9-mondaying.c9.io'
        else
            return window.location.href.replace(/^http/,"ws")
    }
    
    function connect(){
        console.log("connection...");
        var sock = new WebSocket("ws://82.145.55.193:8080/:8080");
        _socket = new SocketWrapper(sock);
        GameSelect.setSocket(_socket);
        GameSelect.show();
        _socket.addMsgListener(initParty,function(d){return (d.type==="partieInit");});
    }
    
    function initParty(data){
        console.log("Initialisation partie");
        _ctx.clearAll();
        GameSelect.hide();
        _partieUi = new PartieUi({model:data,ctx:_ctx ,socket:_socket});
        uiMain.gameScreen.addEventListener("mousedown",mouseDown);
        uiMain.gameScreen.addEventListener("mousemove",mouseMove);
        uiMain.gameScreen.addEventListener("mouseup",mouseUp);
        
    }
};