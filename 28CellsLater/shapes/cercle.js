Cercle = function(cer){
    cer.type = "cercle";
    
    if(cer.center.type!=='point')
        cer.center = new Point(cer.center);
    
    cer.validate({
                center:{type:'object', usrType:'point'},
                rayon:'number'
                }, errors.throwConstructError);
    cer.type = "cercle";
    
    
    cer.isInside = function(point){
        if(!point.type==="point")
           errors.throwBadArgumentError("isInside", "point" , "point");
           
        var segment = new Segment({pA:cer.center,pB:point});
        return (segment.getLength() <= cer.rayon);
    };
    
    cer.getDiametre = function(){
        return (2*cer.rayon);
    }
    
    cer.toRectangle = function(){
        var moinsRayon = function(x){return (x - cer.rayon);};
        var topLeft = new Point({x:moinsRayon(cer.center.x),y:moinsRayon(cer.center.y)});
        var dia = cer.getDiametre();
        
        return new Rectangle({basePoint:topLeft,largeur:dia,hauteur:dia}); 
    };
    
    return cer;
};