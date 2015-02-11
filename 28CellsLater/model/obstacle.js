Obstacle = function(obs){
  obs.type = 'obstacle';

  obs.validate({
      segment: {type:'object', usrType:'segment'}
  },errors.throwConstructError);
  
  
  return obs;
};