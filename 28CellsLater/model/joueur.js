Joueur = function(joueur){
  joueur.type = 'joueur';
  var def = {nom: "joueur " + joueur.num};
  
  joueur = def.extend(joueur);
  
  joueur.validate({
      num:"number",
      nom:"string"
  },errors.throwConstructError);
  
  joueur.isEqual = function(p2){
    return (joueur.num===p2.num);
  };
  
    
  
  return joueur;
};