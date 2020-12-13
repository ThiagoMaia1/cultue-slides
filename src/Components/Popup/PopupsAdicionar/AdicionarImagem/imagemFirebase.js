import firebase, { firebaseStorage } from '../../../../principais/firebase.js';

export function uploadImagem (arquivo, callback) {

    var idUpload = new Date().getTime();
    var nomeArquivo = arquivo.name + '_' + new Date().getTime(); //Nomes de arquivo no firebase storage precisam ser únicos.
    var uploadTask = firebaseStorage.child('images/' + nomeArquivo).put(arquivo);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            default:
                return;
            }
        }, 
        function(error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                default:
                    return;
            }
        }, function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => callback(idUpload, downloadURL));
        }
    );
    return idUpload;
}

// Obter url pública de imagem no storage.
// var gsReference = firebase.storage().refFromURL('gs://slidesigreja-ff51f.appspot.com/public/LogoCultue.png');
// gsReference.getDownloadURL().then(url => console.log(url));

//https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue.png?alt=media&token=e525c9f9-b0cf-4ffa-a595-77998ceca9b3
//https://firebasestorage.googleapis.com/v0/b/slidesigreja-ff51f.appspot.com/o/public%2FLogoCultue%402x.png?alt=media&token=af56d77b-9627-4608-9b1d-23ef180bc25c @2x

export function getImagemStorage (path) {

}