var LienUi = function(lienUi) {
    lienUi.type = 'linkUi';

    lienUi.validate({
        model: {
            type: 'object',
            usrType: 'linkInit'
        },
        ctx: 'object',
        socket: 'object'
    }, errors.throwConstructError);
    lienUi.totalPwr = 0;
    lienUi.anims = [];

    lienUi.socket.addMsgListener(_updateLinkInfo, function(d) {
        return d.type === "linkInfo" && d.linkId === lienUi.model.id
    });

    var _segment = new Segment({
        pA: new Point(lienUi.model.pA),
        pB: new Point(lienUi.model.pB)
    });

    function _updateLinkInfo(data) {
        var diff = (data.pwrTot - lienUi.totalPwr);
        var mainCol = UiConf.players[lienUi.model.owner].mainColor;
        
        lienUi.totalPwr = data.pwrTot;
        if (diff === 0) return;
        

        var cercIo = new CercleUi({
            model: new Cercle({
                center: lienUi.model.pA.clone(),
                rayon: Math.min(diff + 2,20)
            }),
            ctx: lienUi.ctx.anims,
            strokeStyle:mainCol,
            fillStyle:mainCol
        });
        lienUi.anims.push(cercIo.animate(_segment));
    };

    lienUi.draw = function() {
        var style = UiConf.players[lienUi.model.owner].link[lienUi.model.statut];
        lienUi.ctx.liens.extend(style);
        ui.canvas_line_seg(lienUi.ctx.liens, _segment);
        lienUi.ctx.liens.stroke();
    }

    lienUi.remove = function() {
        for (var i = 0; i < lienUi.anims.length; i++)
        lienUi.anims[i]();
        lienUi.socket.removeListener(_updateLinkInfo);
    };

    lienUi.getSegment = function() {
        return _segment;
    };

    return lienUi;
};