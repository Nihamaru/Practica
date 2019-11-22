'use strict';

module.exports = (app) => {
  const Cinephile = app.models.Cinephile;
  const List = app.models.List;

  Cinephile.greet = (msg, cb) => {
    cb(null, 'Greetings... ' + msg);
  };

  Cinephile.suma = (num1, num2, cb) => {
    var res = num1 + num2;
    cb(null, 'El resultado es... ' + res);
  };

  Cinephile.remoteMethod(
    'greet',{
      accepts:{
        arg: 'msg',
        type: 'string'
      },
      returns:{
        arg: 'greeting',
        type: 'string'
      }
    }    
  );

  Cinephile.remoteMethod(
    'suma',{
      accepts:[{
        arg: 'num1',
        type: 'Number'
      },
      {
        arg: 'num2',
        type: 'Number'
      }],
      returns:{
        arg: 'resultado',
        type: 'string'
      }
    }    
  );
};