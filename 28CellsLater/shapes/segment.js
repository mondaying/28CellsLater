Segment = function(segment){
    segment.type = "segment";
    
    segment.validate({
        pA:{type:'object', usrType:'point'},
        pB:{type:'object', usrType:'point'}
    },errors.throwConstructError);
    
    
    segment.getLength = function(){
        var xDiff = Math.pow((segment.pB.x - segment.pA.x),2);
        var yDiff = Math.pow((segment.pB.y - segment.pA.y),2);
        return Math.sqrt(xDiff+yDiff);
        
    };
    
    segment.coefDircteur = function(){
        var xDiff = segment.pB.x - segment.pA.x;
        var yDiff = segment.pB.y - segment.pA.y;
        
        return  yDiff/xDiff;
    };
    
    segment.isIntersecting = function(segmentB) {
        
        if(!segmentB.type==="segment")
           errors.throwBadArgumentError("isIntersecting", "segmentB" , "segment");
        
        var s1 = this,
            s2 = segmentB;
        
        var d = (s1.pA.x - s1.pB.x) * (s2.pA.y - s2.pB.y) - (s1.pA.y - s1.pB.y) * (s2.pA.x - s2.pB.x);
        if (d === 0) return false;
        var xi = ((s2.pA.x - s2.pB.x) * (s1.pA.x * s1.pB.y - s1.pA.y * s1.pB.x) - (s1.pA.x - s1.pB.x) * (s2.pA.x * s2.pB.y - s2.pA.y * s2.pB.x)) / d;
        var yi = ((s2.pA.y - s2.pB.y) * (s1.pA.x * s1.pB.y - s1.pA.y * s1.pB.x) - (s1.pA.y - s1.pB.y) * (s2.pA.x * s2.pB.y - s2.pA.y * s2.pB.x)) / d;
        if (s2.pA.x === s2.pB.x) {
            if (yi < Math.min(s1.pA.y, s1.pB.y) || yi > Math.max(s1.pA.y, s1.pB.y)) return false;
        }
    
        if (xi < Math.min(s1.pA.x, s1.pB.x) || xi > Math.max(s1.pA.x, s1.pB.x)) return false;
        if (xi < Math.min(s2.pA.x, s2.pB.x) || xi > Math.max(s2.pA.x, s2.pB.x)) return false;
    
        return new Point({x:xi, y:yi});
    };
    
   segment.isOnLine = function(point){
       if(!point.type==="point")
           errors.throwBadArgumentError("isPointIncluded", "point" , "point");
        
        var s = this,
            p = point;
            
        return ((s.pB.y - s.pA.y) * (p.x - s.pA.x)).toFixed(0) === ((p.y - s.pA.y) * (s.pB.x - s.pA.x)).toFixed(0) &&
                ((s.pA.x > p.x && p.x > s.pB.x) || (s.pA.x < p.x && p.x < s.pB.x)) &&
                ((s.pA.y >= p.y && p.y >= s.pB.y) || (s.pA.y <= p.y && p.y <= s.pB.y));

    };
    
    segment.split = function(point){
/*      if(!segment.isOnLine(point))
            throw new RangeError("Le point fournis n'est pas compris dans le segment");*/
            
        var s = this;
        
        return [
                new Segment({pA:s.pA,pB:point}),
                new Segment({pA:point,pB:s.pB})
            ];
    };
    
    
    return segment;
};