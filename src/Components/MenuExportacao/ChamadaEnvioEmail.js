import React from 'react';
import { firebaseFunctions } from '../../principais/firebase';
import ReactDOMServer from 'react-dom/server';
import store from '../../index';

const enderecoEmailThiago = 'tthiagopmaia@gmail.com';
export const enviarEmail = firebaseFunctions.httpsCallable('enviarEmail');

const azulForte = '#3757a9';

const getEstiloBarraAzul = altura => (
    {backgroundColor: azulForte, height: altura + 'px', width: '100%'}
)

export const enviarEmailTemplate = (assunto, destinatarios = enderecoEmailThiago, corpo, JSXInterno, linksBotoes = null, anexos = null, callback = null) => {
    
    document.body.style.cursor = 'progress';
    destinatarios = [destinatarios].flat();
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
                <div style={{padding: '25px', fontFamily: 'Roboto', textAlign: 'center', fontSize: '15px'}}>
            {JSXInterno}
            {botoes}
            <p><i>Equipe Cultue</i></p>
            </div>
            <a href={window.location.origin.toString()} target='_blank' rel="noopener noreferrer"> 
                <div style={getEstiloBarraAzul(20)}></div>
            <div style={{width: '100%', padding: '18px 0'}}>
            <img src="https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue.png?alt=media&amp;token=e525c9f9-b0cf-4ffa-a595-77998ceca9b3" 
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
            console.log(error);
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
/* <div style="background-color:#3757a9;height:70px;width:100%"></div><div style="padding:25px; font-family:'Roboto'; text-align: center; font-size: 15px;">
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
 </a> */

