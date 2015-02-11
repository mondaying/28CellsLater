//Respectez ce putain de code, j'en ai chié
(function(Object) {
    Object.prototype.validate = function(objRef, errorCallback) {
        var currentField;
        var thisObj = this;
        
        //Les fonctions de vérifications
        var _funcCheck = {
            instance:function(v,t){
                return (v instanceof t);
            },
            type: function(v, t) {
                if (t==="array") 
                    return (v instanceof Array);
                else return typeof(v) == t;
            },
            usrType: function(v,t){
                return v['type']===t;
            },

        };

        //Appel du callBack en cas d'erreur
        var _notifyError = function(tVerif, fieldName) {
            if (typeof(errorCallback) == 'function') errorCallback({
                field: fieldName,
                verif: tVerif,
                text: "La vérification de " + tVerif + " a échouée sur " + currentField,
                obj: thisObj
            });
        };

        //Teste si la valeur d'un champs remplie les conditions spécifiée
        var _fieldTest = function(obj, ver) {
            var result = true;
            for (var i in ver) {
                if(ver.hasOwnProperty(i)){
                    var check = _funcCheck[i];
                    if (typeof(check) === 'function') {
                        var suc = check(obj, ver[i]);
                        if (!suc) _notifyError(i);
                        result = result && suc;
                    }
                }
            }
            return result;
        };

        //Dermine la bonne méthode de test en fonction du contexte
        var _valueCheck = function(testVal, verVal) {
            if (typeof(verVal) == 'object') {
                if (verVal.type) {
                    return _fieldTest(testVal, verVal);
                }
                else {
                    return _objectCheck(testVal, verVal);
                }
            }
            else {
                if (typeof(verVal) == 'string') return _fieldTest(testVal, {
                    type: verVal
                });
            }
        };

        //Vérifie si un object rempli les conditions spécifiées par le second
        var _objectCheck = function(testObj, verObj) {
            var result = true;
            for (var i in verObj) {
                if (verObj.hasOwnProperty(i)) {
                    currentField = i;
                    result = result && _valueCheck(testObj[i], verObj[i]);
                }
            }
            return result;
        };

        return _objectCheck(this, objRef);
    };
})(Object);
    