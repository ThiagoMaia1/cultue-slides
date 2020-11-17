import { store } from '../../index';
import { gerarDocumentoUsuario } from '../../firestore/apiFirestore';
import { firebaseAuth } from "../../firebase";
import history from '../../history';
import { definirApresentacaoComLocation } from '../../firestore/apresentacoesBD';

export const checarLogin = (callbackLogin) => {
    firebaseAuth.onAuthStateChanged(async userAuth => {
        if (!userAuth) store.dispatch({type: 'login', usuario: {uid: 0}});
        var idUsuarioStore = store.getState().usuario.uid;
        if ((!userAuth && !idUsuarioStore) || (userAuth && userAuth.uid === idUsuarioStore)) return;
        var user = await gerarDocumentoUsuario(userAuth) || {};
        store.dispatch({type: 'login', usuario: user});
        definirApresentacaoComLocation(history.location, user);
        if (callbackLogin) callbackLogin(user);
    });
}