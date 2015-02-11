var PartieUi = function(partieUi) {
    partieUi.type = 'partieUi';

    var def = {};
    partieUi = def.extend(partieUi);

    partieUi.validate({
        model: {
            type: 'object',
            usrType: 'partieInit'
        },
        ctx: 'object',
        socket:'object'
    }, errors.throwConstructError);

    var _obstacles = [];
    var _cells = [];
    var _links = [];
    
    _fillCells();
    
    partieUi.socket.addMsgListener(_addNewLink,function(d){return d.type==="linkInit"});
    partieUi.socket.addMsgListener(_removeLink,function(d){return d.type==="linkDel"});
    partieUi.socket.addMsgListener(_refreshScore,function(d){return d.type==="scoresInfo"});
    partieUi.socket.addMsgListener(_endGame,function(d){return d.type==="endGame"});
    
    function _endGame(data){
        console.log(data);
        if(data.idPlayer===_getCurrentPlayer())
            alert("Congratulations, you won this game !");
        else
            alert("You lose and player "+ data.idPlayer +" win !")
    }
    
    function _refreshScore(data){
        ScoreBoard.showScore(data.scores);
    }


    function _fillCells() {
        for (var i = 0; i < partieUi.model.cells.length; i++) {
            var c = partieUi.model.cells[i];
            _cells.push(new CellUi({
                model: c,
                ctx: partieUi.ctx.cells,
                socket:partieUi.socket
            }));
            _cells[i].draw();
        }
    }

    function _removeLink(data){
       _removeLinkById(data.linkId);
       _drawLinks();
    }
    
    function _removeLinkById(id){
        var linksToKeep =[];
        for(var i=0;i<_links.length;i++){
            if(_links[i].model.id!==id)
                linksToKeep.push(_links[i]);
            else _links[i].remove();
        }
        _links = linksToKeep;
    }
    function _addNewLink(data){
        _links.push(
           new LienUi({
               model:data,
               ctx:partieUi.ctx,
               socket:partieUi.socket
           }) 
        );
        _drawLinks();
    }

    function _getCurrentPlayer() {
        return partieUi.model.idPlayer;
    }
    
    function _drawLinks(){
                ui.clearCanvas(partieUi.ctx.liens);

        for (var i = 0; i < _links.length; i++) {
            _links[i].draw();
        }
    }

    function _drawCells() {
        for (var i = 0; i<_cells.length < i; i++) {
            _cells[i].draw();
        }
    }

    partieUi.selectBase = function(p) {
        for (var i = 0; i < _cells.length; i++) {
            var sel = _cells[i].trySelect(p, _getCurrentPlayer());
            if (sel) return sel;
        }
        return false;
    };

    partieUi.overBase = function(p, drawStatus) {
        for (var i = 0; i < _cells.length; i++) {
            var ov = _cells[i].tryOver(p, _getCurrentPlayer(), drawStatus);
            if (ov) return ov;
        }
        return false;
    };

    partieUi.linkCell = function(c1, c2) {
        var objNewLink = {type:"newLink",cellA:c1.model.id,cellB:c2.model.id};
        partieUi.socket.sendMsg(objNewLink);
    };

    partieUi.unSelectAllBase = function() {
        _cells.map(function(c) {
            c.unSelect();
        });
    };

    partieUi.cutLiens = function(segment) {
        for (var i = 0; i < _links.length; i++) {
            var l = _links[i];
            if (l.model.owner === _getCurrentPlayer()) {
                var intersect = segment.isIntersecting(l.getSegment());
                if (intersect) {
                    var req = {
                        type: "cutLink",
                        baseCell: l.model.fromCell,
                        linkId: l.model.id,
                        cutPoint: intersect.getData()
                    };
                    partieUi.socket.sendMsg(req);
                }
            }
        }
    };

    partieUi.draw = _drawCells();


    return partieUi;
};
