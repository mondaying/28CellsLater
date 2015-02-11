//** Permet de créer plusieurs listener pour plusieurs sockets **//

SocketWrapper = function(sock, config) {


    var def = {
        sendError: function(e, s) {
            console.log("Une erreur est survenue pendant l'envoit");
            return true;
        }
    };

    var _params = def.extend(config || {});

    var _sockets = [];
    
    var _listeners = [];

    if (sock) _sockets = _sockets.concat(sock);

    _sockets.map(_prepareSock);

    function _prepareSock(sock){
        sock.onmessage = function(e){
            _onMessageEvent(e,sock);
        };
    }
    
    function _onMessageEvent(e, sock) {
        var msg;
        try{
            msg = JSON.parse(e.data)
        }catch(ex){
            console.log("Bad format msg received");
            return;
        }

        var lt = _getListener(function(l){
            var res = ((l.type==="message") && 
                       ((!l.validFun)        ||
                       (l.validFun(msg,sock))));
                   
            if(res)l.lt(msg,sock);
            return res;
        });
    };
    
    function _getListener(funFiltre){
        var resp = [];
        if (typeof(funFiltre) != 'function') return
        for(var i =0;i<_listeners.length;i++) {
            if(funFiltre(_listeners[i]))
                resp.push(_listeners[i]);
        }
        return (resp.length>0) ? resp : false;
    }
    
    function _addListener(type, listener, validFunct) {
        if (typeof(listener) != 'function') throw "un écouteur doit être de une fonction";
        if(_getListener(function(l){l.lt===listener}))return;
        
        _listeners.push({lt:listener,type:type,validFun:validFunct});
    }
    
    function _addListenerOnMessage(listener, validFunct) {
        _addListener('message', listener, validFunct);
    }
    
    function _removeListener(listener){
        var toKeep = [];
        var rem=false;
        
        for(var i =0;i<_listeners.length;i++)
            if(_listeners[i].lt!==listener) toKeep.push(_listeners[i]);
            else rem=true;
            
        _listeners=toKeep;
        
        return rem;
    }


    function _removeSocket(sock){
        var toKeep = [];
        
        for(var i =0;i<_sockets.length;i++)
            if(_sockets[i]!==sock) toKeep.push(_sockets[i]);
            
        _sockets=toKeep;
    }
    
    function _addSock(sock) {
        if (_sockets.indexOf(sock) == -1) {
            _sockets.push(sock);
        }
        
        _prepareSock(sock);
    }
    
    function _getSocks(){
        return _sockets;
    }

    function _sendMsg(msg, funcVer) {
        var sended = false;
        
        var sendMsg = function(msg,s){
            if(s.inError) return;
            try{
                sock.send(JSON.stringify(msg));
                sended=true;
            }catch(err){
                if(_params.sendError(err,s)){
                    s.inError = true;
                    _removeSocket(s);
                }
                    
            }
        };

        for (var i = 0; i < _sockets.length; i++) {
            var sock = _sockets[i];

            if (typeof(funcVer) == 'function') {
                if (funcVer(sock,msg)) {
                    sendMsg(msg,sock);
                }
            }
            else {
                sendMsg(msg,sock);
            }
        }

        return sended;
    }

    function _getSubSet(filterPrm) {
        if(typeof(filterPrm)!=="function")return;
        var sockToKeep = _sockets.filter(filterPrm);
        return new SocketWrapper(sockToKeep, config);
    }

    return {
        addMsgListener: _addListenerOnMessage,
        removeListener:_removeListener,
        removeSocket: _removeSocket,
        addSock:_addSock,
        getSocks:_getSocks,
        sendMsg: _sendMsg,
        getSubset: _getSubSet
    };
}