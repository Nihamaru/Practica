'use strict';

module.exports = function(app){

var models = [
  'user',
  'AccessToken',
  'ACL',
  'RoleMapping',
  'Role'
  ];

var database = app.dataSources.PractBD;

database.isActual(models, (err, actual) => {
  if(err) throw err;
  if(!actual){
    database.autoupdate(models, (err, result) => {
      if(err) console.log(err);
      console.log('models created');
    })
  }
  console.log('models created TOTAL');
})

}