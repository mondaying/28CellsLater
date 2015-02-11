Rectangle = function(rec){
    rec.type = "rectangle";
    
    rec.validate({
                basePoint:{type:'object', usrType:'point'},
                largeur:'number',
                hauteur:'number'
                }, errors.throwConstructError);
                
    
    return rec;
    
};