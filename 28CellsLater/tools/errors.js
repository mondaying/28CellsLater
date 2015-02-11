errors =  {};

errors.ConstructorError = function(msg) {
    this.name = "fail_construct_object";
    this.message = msg;
};

errors.ConstructorError.prototype = new Error();
errors.ConstructorError.prototype.constructor = errors.ConstructorError;

errors.throwConstructError = function(objFail) {
    throw new errors.ConstructorError(
        "Une erreur est survenue dans l'initialisation de " +
        objFail.obj.type +
        " : " +
        objFail.text
    )
}

errors.throwBadArgumentError = function(funcName, argName ,type) {
    throw new TypeError(
        "L'argument " + argName + " de la fonction " + funcName + " doit être de type " + type
        );
}