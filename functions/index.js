'use strict';
const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');
// const cors = require('cors')({origin: true});
const enderecoEmail = functions.config().sendgrid.emailaddress;

var transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
      user: 'apikey',
      pass: functions.config().sendgrid.key,
  }
});

exports.enviarEmail = functions.https.onCall(data => {
  var { assunto, destinatarios, corpo, corpoHTML, anexos } = data;
  let remetente = '"Cultue Slides" <' + enderecoEmail + '>';

  let email = {
      from: remetente,
      to: destinatarios || [enderecoEmail],
      subject: assunto,
      text: corpo,
      html: corpoHTML,
      attachments: anexos
  };

  return transporter.sendMail(email);
  
});
