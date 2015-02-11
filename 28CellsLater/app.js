

includeFolder("./tools/");
includeFolder("./shapes/");
includeFolder("./model/");
includeFolder("./levels/");

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

var sockMgr = new SocketWrapper([],{sendError:function(){
    console.log("Un client s'est déconnecté");
    return true;
}});

PartieManager.setSocket(sockMgr);

wss.on('connection', function(ws) {
    sockMgr.addSock(ws);
    ws.send('{"type":"srvHello"}');
    
});

function includeFolder(path){
    require("fs").readdirSync(path).forEach(function(file) {
        require(path + file);
    });
}