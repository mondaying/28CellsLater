var ui = ui ||{};

//Permet de retrouver la position internet d'un clic avec un canvas
ui.getInnerPos = function(el,e){
    function findPos(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }
    var pos = findPos(el);
    return {x: e.pageX - pos.x, y: e.pageY - pos.y};
}

ui.canvas_arrow = function(context, pA,pB){
    var headlen = 13;   // length of head in pixels
    var angle = Math.atan2(pB.y-pA.y,pB.x-pA.x);
    context.beginPath();
    context.moveTo(pA.x, pA.y);
    context.lineTo(pB.x, pB.y);
    context.lineTo(pB.x-headlen*Math.cos(angle-Math.PI/6),pB.y-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(pB.x, pB.y);
    context.lineTo(pB.x-headlen*Math.cos(angle+Math.PI/6),pB.y-headlen*Math.sin(angle+Math.PI/6));
}

ui.canvas_line = function(context, pA,pB){
    context.beginPath();
    context.moveTo(pA.x, pA.y);
    context.lineTo(pB.x, pB.y);
}

ui.canvas_line_seg = function(context, segment){
    ui.canvas_line(context,segment.pA,segment.pB);
}

ui.draw_circle = function(context, p,rayon){
    context.beginPath();
    context.arc(p.x,p.y, rayon, 0, 3 * Math.PI);
}

ui.clearCanvas = function(ctx){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);   
}