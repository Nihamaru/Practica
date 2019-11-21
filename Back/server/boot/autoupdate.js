'use strict';

module.exports = function(app){

var models = [
  'Cinephile',
  'AccessToken',
  'ACL',
  'RoleMapping',
  'Role',
  'List',
  'Director',
  'Movie',
  'ListOfMovies'
  ];

var database = app.dataSources.PractBD;
var Cinephile = app.models.Cinephile;
var Role = app.models.Role;
var RoleMapping = app.models.RoleMapping;

database.isActual(models, (err, actual) => {
  if(err) throw err;
  if(!actual){
    database.autoupdate(models, (err) => {
      if(err) console.log(err);
      console.log('models created');

      Role.create([{
        name: 'admin'
      }],(err, role) => {
        if(err) throw err;
        console.log('role created: ', role);

        Cinephile.create([{
          name: 'Nicolás',
          lastname: 'Antonio',
          username: 'nihamaru',
          password: 'nicolas123',
          email: 'nico_19991@hotmail.com'
        },
        { 
          name: 'Herminio',
          lastname: 'Orequi',
          username: 'herore',
          password: 'herminio123',
          email: 'herminio@hotmail.com'
        }],(err, cinephile) => {
          if(err) throw err;
          console.log('cinephiles created: ', cinephile);
            
          RoleMapping.create([{
            principalType: RoleMapping.USER,
            principalId: cinephile[0].id,
            roleId: role[0].id,
          }],(err, rolemapping) => {
            if(err) throw err;
            console.log('rolemaping created', rolemapping);
          });
        });
      });
      
    });
  }
  console.log('models created TOTAL');
})

}