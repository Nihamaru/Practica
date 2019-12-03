'use strict';

const nodemailer = require("nodemailer");

module.exports = (app) => {
  const Cinephile = app.models.Cinephile;
  const crypto = require('crypto');    

  console.log(Date.now());

  Cinephile.greet = (msg, cb) => {
    cb(null, 'Greetings... ' + msg);
  };

  Cinephile.suma = (num1, num2, cb) => {
    var res = num1 + num2;
    cb(null, 'El resultado es... ' + res);
  };

  Cinephile.sendMail = (remail, name, lastname, cb) => {      
    
    var msg;

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nantonioa@correo.udistrital.edu.co',
          pass: 'Casaantonio' 
        }
      });

      Cinephile.find({"where":{"email":remail}}, (err, info) => {
        if(err){throw err};
        if(info.length > 0) {msg = 'Usted ha sido invitado a colaborar en un proyecto de '+ name + ' '+ lastname+  ' en Needplanning, si acepta participar por favor acepte este correo'}
        else{msg = 'Usted ha sido invitado a colaborar en un proyecto de '+ name +' '+ lastname +' en Needplanning, si acepta participar por favor registrate gratis en NeedPlanning'}

        let infor = {
          from: '"NeedPlanning" <needplanning@example.com>',
          to: remail,
          subject: "Invitación para participar en un proyecto en NeedPlanning",
          text: msg
        }

        transporter.sendMail(infor, (err) => {
          if(err){throw err};
          return cb(null, 'Email enviado a... ' + remail);
        })
      })
    };

  Cinephile.recoveryPass = (remail, cb) => {

    var msg;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nantonioa@correo.udistrital.edu.co',
        pass: 'Casaantonio' 
      }
    });

    Cinephile.find({"where":{"email":remail}}, (err, info) => {
      if(err){throw err};
      if(info.length > 0) {
        
        if(info[0].verificationToken == null){

          crypto.randomBytes(20,(err, buf) => {
            if (err) {throw err}
            var token = buf.toString('hex');

            Cinephile.findById(info[0].id, (err, cinephile) => {
              if(err){throw err}
              else{ 
                cinephile.verificationToken = token; 
                cinephile.timeToken = Date.now()+86400000;
                cinephile.save((err, cinephileSaved) => {
                  if(err){throw err}
                  console.log(cinephileSaved);

                  
                  msg = ('Usted ha olvidado su contraseña en Needplanning, si quiere recuperarla haga click en el siguiente enlace: ' + 'http://localhost:3000/api/Cinephiles/changeTokenPass/' + token );
            

                  let infor = {
                    from: '"NeedPlanning" <needplanning@example.com>',
                    to: remail,
                    subject: "Recuperación de contraseña en NeedPlanning",
                    text: msg
                  }

                  transporter.sendMail(infor, (err) => {
                    if(err){throw err};
                    return cb(null, 'Email enviado a... ' + remail);
                  })
                })
              }
            })
          });
        }
        else{ return cb(null, 'cuenta sin verificar'); }
      }
      else{return cb(null, 'Email no enviado');}
    })
  };

  Cinephile.changeTokenPass = (token, pass, cb) => {

    Cinephile.find({"where":{"verificationToken":token}}, (err, info) => {

      if(err){throw err}
      else if(info <= 0){cb(null, 'Token invalido o expirado');}
      else{

        console.log(info[0].timeToken);
        console.log(Date.now());

          Cinephile.findById(info[0].id, (err, cinephile) => {
            if(err){throw err}
            else{ 
              if(info[0].timeToken >= Date.now()){
                cinephile.password = pass;
                cinephile.verificationToken = null; 
                cinephile.timeToken = null;
                cinephile.save((err, cinephileSaved) => {
                  if(err){throw err}
                  return cb(null, cinephileSaved);
              })
              }else{
                cinephile.verificationToken = null; 
                cinephile.timeToken = null;
                cinephile.save((err, cinephileSaved) => {
                  if(err){throw err}
                  return cb(null, "Token Vencido");
                })
              }
            }
          })
      }

    })

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
    'recoveryPass',{
      accepts:[{
        arg: 'email',
        type: 'string'
      }],
      returns:{
        arg: 'resultado',
        type: 'string'
      }
    }    
  );

  Cinephile.remoteMethod(
    'changeTokenPass',{
      accepts:[{
        arg: 'token',
        type: 'string'
      },
      {
        arg: 'password',
        type: 'string'
      }],
      returns:{
        arg: 'resultado',
        type: 'string'
      }
    }    
  );

  Cinephile.remoteMethod(
    'sendMail',{
      accepts:[{
        arg: 'email',
        type: 'string'
      },
      {
        arg: 'name',
        type: 'string'
      },
      {
        arg: 'lastname',
        type: 'string'
      }],
      returns:{
        arg: 'resultado',
        type: 'string'
      }
    }    
  );
};