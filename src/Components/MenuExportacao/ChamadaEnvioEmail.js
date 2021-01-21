import React from 'react';
import { firebaseFunctions } from '../../principais/firebase';
import ReactDOMServer from 'react-dom/server';
import store from '../../index';

export const enviarEmail = firebaseFunctions.httpsCallable('enviarEmail');

export const enviarEmailTemplate = (assunto, destinatarios, corpo, JSXInterno, linksBotoes = null, anexos = null, callback = null) => {
    
    const azulForte = '#3757a9';    
    const urlLogo = 'https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue.png?alt=media&token=e525c9f9-b0cf-4ffa-a595-77998ceca9b3';
    const getEstiloBarraAzul = altura => (
        {backgroundColor: azulForte, height: altura + 'px', width: '100%'}
    )

    document.body.style.cursor = 'progress';
    anexos = [anexos].flat();
    var botoes = [];
    if (linksBotoes) {
        for (var l of linksBotoes) {
            botoes.push(
                <div>
                    <br></br>
                    <a style={{color: 'white', textDecoration: 'none', backgroundColor: azulForte, padding: '1.5vh', fontSize: '110%', borderRadius: '0.8vh'}} 
                       href={l.url} target='_blank' rel='noopener noreferrer'>
                        {l.rotulo}
                    </a>
                    <br></br>
                    <br></br>
                </div>
            )
        }
    }

    const corpoHTML = ReactDOMServer.renderToStaticMarkup(
        <>
            <div style={getEstiloBarraAzul(50)}></div>
                <div style={{padding: '25px', fontFamily: 'Trebuchet MS', textAlign: 'center', fontSize: '15px'}}>
            {JSXInterno}
            {botoes}
            <p><i>Equipe Cultue</i></p>
            </div>
            <a href={window.location.origin.toString()} target='_blank' rel="noopener noreferrer"> 
                <div style={getEstiloBarraAzul(20)}></div>
            <div style={{width: '100%', padding: '18px 0'}}>
            <img src={urlLogo} 
                 alt="Logotipo Cultue" style={{objectFit: 'contain', display: 'block', margin: 'auto'}}/>
            </div>
            <div style={getEstiloBarraAzul(20)}></div>
            </a>
        </>
    )

    var objEmail = {
        assunto, 
        destinatarios,
        corpo, 
        corpoHTML,
        anexos
    }
      
    enviarEmail(objEmail).then(
        () => {
            inserirNotificacao('E-mail enviado com sucesso')
            if(callback) callback(true);
        }, 
        error => {
            inserirNotificacao('Erro ao enviar e-mail');
            console.log(error, objEmail);
            if(callback) callback(false);
    }).finally(() => {
        document.body.style.cursor = 'default';;
    })
}

const inserirNotificacao = conteudo => {
    store.dispatch({type: 'inserir-notificacao', conteudo: conteudo});
    document.body.style.cursor = 'default';
}  

// Template e-mail de recuperação de senha:
/* <div style="background-color:#3757a9;height:70px;width:100%"></div><div style="padding:25px; font-family:'Trebuchet MS'; text-align: center; font-size: 15px;">
          <p><b>Olá!</b> Clique no botão a seguir para redefinir sua senha do aplicativo Cultue.</p>
<br>
<div><a style="color: white; text-decoration: none; background-color: #3757a9; padding:1.5vh; font-size: 110%; border-radius:0.8vh" href="%LINK%" target="_blank" >Redefinir Senha</a></div>
<br>
<p>Se você não solicitou uma redefinição de senha, ignore este e-mail.</p>
<p><i>Equipe Cultue</i></p>
        </div>
<a href="https://slidesigreja-ff51f.web.app/login" rel="noopener noreferrer" target="_blank">
          <div style="background-color:#3757a9; height: 20px; width:100%"></div>
<div style="width:100%;padding: 20px 0;">
<img src="https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue.png?alt=media&amp;token=e525c9f9-b0cf-4ffa-a595-77998ceca9b3" alt="Logotipo Cultue" style="object-fit: contain; display: block; margin: auto">
</div>
<div style="background-color:#3757a9;height:20px;width:100%"></div>
 </a> 
 
const logoBase64 = 'data:image/png;base64,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';
*/

