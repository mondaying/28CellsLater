(function(Object) {
    Object.prototype.extend = function(obj){
        var _isObj=function(v){
          return (typeof(v)=='object');  
        };
        
        var _extend = function(a, b){
            for(var key in b)
                if(b.hasOwnProperty(key)){
                    if(_isObj(a[key])&&_isObj(b[key]))
                        a[key] = _extend(a[key],b[key]);
                    else
                        a[key] = b[key];
                }
                    
            return a;
        };
        
    return _extend(this,obj);
    };
})(Object);