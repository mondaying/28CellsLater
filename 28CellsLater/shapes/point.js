Point = function(point){
    point.type = "point";
    point.validate({x:"number",y:"number"}, errors.throwConstructError);
    
    point.isInferieur = function(otherPoint){
      return  ((point.x < otherPoint.x) && (point.y < otherPoint.y));
    };
    
   point.isSuperieur= function(otherPoint){
      return  ((point.x > otherPoint.x) && (point.y > otherPoint.y));
    };
    
    point.isEqual = function(p2){
      return ((p2.x===point.x)&&(p2.y===point.y));   
    };
    
    point.getData = function(){
        return {x:point.x,y:point.y};
    }
    
    return point;
};