(function(Object) {
    Object.prototype.clone = function() {
        return  JSON.parse(JSON.stringify(this));
    };
})(Object);

