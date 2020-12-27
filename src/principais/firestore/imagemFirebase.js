import firebase, { firebaseStorage } from '../firebase.js';
import store from '../../index';
// import { atualizarRegistro } from '../../../../principais/firestore/apiFirestore';

export function uploadImagem (arquivo, metadata, callback, tentativa = 0) {

    var idUpload = new Date().getTime();
    var nomeArquivo = arquivo.name + '_' + new Date().getTime(); //Nomes de arquivo no firebase storage precisam ser únicos.
    var uploadTask = firebaseStorage.child('images/' + nomeArquivo).put(arquivo, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => void 0, 
        () => {
            if (tentativa < 3) uploadImagem(arquivo, metadata, callback, tentativa + 1);
            else store.dispatch({type: 'inserir-notificacao', conteudo: 'Erro ao realizar upload da imagem, tente novamente mais tarde.'});
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => {
                    callback(idUpload, downloadURL);
                });
        }
    );
    return idUpload;
}

export const getMetadata = async url => {
    var httpsReference = firebase.storage().refFromURL(url);
    return await httpsReference.getMetadata();
}

// export const getHashImagem = async imgBase64 => {
//     const msgUint8 = new TextEncoder().encode(imgBase64);                         // encode as (utf-8) Uint8Array
//     const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
//     const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
//     return hashHex;
// }

// export const criarImagemBD = async url => {
//     return await gerarNovoRegistro('imagens', {url});
// }

// Obter url pública de imagem no storage.
// var gsReference = firebase.storage().refFromURL('gs://slidesigreja-ff51f.appspot.com/public/LogoCultue.png');
// gsReference.getDownloadURL().then(url => console.log(url));

//https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue.png?alt=media&token=e525c9f9-b0cf-4ffa-a595-77998ceca9b3
//https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue%402x.png?alt=media&token=af56d77b-9627-4608-9b1d-23ef180bc25c @2x