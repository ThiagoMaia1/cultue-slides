const nodemailer = require('nodemailer');
// const cors = require('cors')({origin: true});
const enderecoEmail = 'tthiagopmaia';

let url = "smtps://" + enderecoEmail + "%40gmail.com:" + encodeURIComponent('***REMOVED***') + "@smtp.gmail.com:465";
let transporter = nodemailer.createTransport(url);

export function enviarEmail (assunto, destinatarios, corpo, corpoHtml, anexos) {
    let remetente = '"Thiago Pereira Maia" <' + enderecoEmail + '@gmail.com>';
    let email = {
        from: remetente,
        to: destinatarios, // lista de e-mails destinatarios separados por ,
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
};