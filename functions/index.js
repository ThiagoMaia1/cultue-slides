'use strict';
const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');
// const cors = require('cors')({origin: true});
const enderecoEmail = 'tthiagopmaia@gmail.com';

var transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
      user: 'apikey',
      pass: '***REMOVED***'
  }
});
exports.enviarEmail = functions.https.onCall((assunto, destinatarios, corpo, corpoHtml, anexos) => {
  let remetente = '"Thiago Pereira Maia" <' + enderecoEmail + '>';

  let email = {
      from: remetente,
      to: destinatarios,
      subject: assunto,
      text: corpo,
      html: corpoHtml,
      attachments: anexos
  };

  transporter.sendMail(email, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Mensagem %s enviada: %s', info.messageId, info.response);
  });
});