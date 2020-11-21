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
        await definirApresentacaoComLocation(history.location, user);
        store.dispatch({type: 'login', usuario: user});
        if (callbackLogin) callbackLogin(user);
    });
}