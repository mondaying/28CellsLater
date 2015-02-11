var CercleUi = function(uiCirc) {
    uiCirc.type = "cercleUi";
    
    var _def = {lineWidth:2,strokeStyle:"red",fillStyle:"green"};
    uiCirc= _def.extend(uiCirc);
    
    uiCirc.validate({
        model: {
            type: 'object',
            usrType: 'cercle'
        },
        ctx:"object",
        lineWidth: "number",
        strokeStyle: 'string',
        fillStyle: 'string'
    }, errors.throwConstructError);

    uiCirc.getCenter=function(){
      return   uiCirc.model.center;
    };

   uiCirc.clear=function(){
        var w = uiCirc.lineWidth;
        var rec = uiCirc.model.toRectangle();
        uiCirc.ctx.clearRect(rec.basePoint.x-w, rec.basePoint.y-w,rec.largeur+(2*w), rec.hauteur+(2*w));
    }


    uiCirc.isClickInside = function(point){
        var pClick = new Point(point);
        return uiCirc.model.isInside(pClick);
    }; 
    
    uiCirc.draw = function(){

        uiCirc.ctx.fillStyle = uiCirc.fillStyle;
        uiCirc.ctx.strokeStyle = uiCirc.strokeStyle;
        uiCirc.ctx.lineWidth = uiCirc.lineWidth;
        
        ui.draw_circle(uiCirc.ctx,uiCirc.getCenter(),uiCirc.model.rayon);
        uiCirc.ctx.fill();
        uiCirc.ctx.stroke();
    };
    
    uiCirc.animate = function(seg){
    var length = seg.getLength();

    var xStep = (seg.pB.x - seg.pA.x)/length;
    var yStep = (seg.pB.y - seg.pA.y)/length;
    var stop = false;
    var counter = 0;

        function step(timestamp) {
            
            counter+=(timestamp/6400);
            uiCirc.clear();
            
            
            var xPos = seg.pA.x +(counter*xStep);
            var yPos = seg.pA.y +(counter*yStep);
        
            uiCirc.model.center.x = xPos;
            uiCirc.model.center.y = yPos;
            uiCirc.draw();
        
        
          if (counter<length && !stop) {
            requestAnimationFrame(step);
          }else uiCirc.clear();
        }
        requestAnimationFrame(step);
        
        return function(){stop=true;}
    };
    
    return uiCirc;
};