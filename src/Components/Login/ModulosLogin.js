import store from '../../index';
import { gerarDocumentoUsuario } from '../../principais/firestore/apiFirestore';
import { firebaseAuth } from "../../principais/firebase";
import history from '../../principais/history';
import { getApresentacaoComLocation, definirApresentacaoAtiva, getUltimaApresentacaoUsuario } from '../../principais/firestore/apresentacoesBD';
import { slidesPadraoDefault } from '../../principais/firestore/apiFirestore';

const usuarioAnonimo = {uid: 0, slidesPadrao: slidesPadraoDefault};

var primeiraTentativa = true;

const getTipoEvento = userAuth => {
    var idAuth = (userAuth ? userAuth.uid : 0);
    var idUsuarioStore = store.getState().usuario.uid;
    if(!idUsuarioStore && idAuth) return 'login';
    if(!idAuth && (idUsuarioStore)) return 'logout';
    return 'noChange';
}
export const checarLogin = (callbackLogin) => {
    if (!primeiraTentativa) return;
    firebaseAuth.onAuthStateChanged(async userAuth => {
        let state = store.getState().present;
        let { elementos, apresentacaoStore } = state;
        let tipoEvento = getTipoEvento(userAuth);
        if (tipoEvento === 'noChange' && !primeiraTentativa) return;
        
        let user = await gerarDocumentoUsuario(userAuth) || usuarioAnonimo;
        let apresentacao;
        let apresentacaoLocation;

        if (tipoEvento === 'logout')
            apresentacao = null;
        else if (history.location.hash)
            if (primeiraTentativa) {
                apresentacaoLocation = await getApresentacaoComLocation(history.location);
                apresentacao = apresentacaoLocation || 
                               await getUltimaApresentacaoUsuario(user.uid);
                primeiraTentativa = false;
            } else {
                if (tipoEvento === 'login') {
                    if(elementos.length > 1) {
                        apresentacao = { elementos };
                    } else {
                        apresentacao = await getUltimaApresentacaoUsuario(user.uid);
                    }
                }
            }
        else if (apresentacaoStore.id)
            apresentacao = apresentacaoStore;

        store.dispatch({type: 'login', usuario: user});
        let mudarURL = (
            tipoEvento === 'login'
            ? /\/perfil/.test(history.location.pathname) 
                ? false 
                : true 
            : false
        );
        if (tipoEvento !== 'noChange' || apresentacaoLocation) definirApresentacaoAtiva(user, apresentacao, undefined, undefined, mudarURL);
        if (tipoEvento === 'logout') history.push('/logout');
        if (callbackLogin) callbackLogin(user);
    });
}