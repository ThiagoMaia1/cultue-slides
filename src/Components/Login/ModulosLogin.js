import { store } from '../../index';
import { gerarDocumentoUsuario } from '../../firestore/apiFirestore';
import { firebaseAuth } from "../../firebase";
import history from '../../history';
import { getApresentacaoComLocation, definirApresentacaoAtiva, getUltimaApresentacaoUsuario } from '../../firestore/apresentacoesBD';

var primeiraTentativa = true;

const getTipoEvento = userAuth => {
    var idAuth = (userAuth ? userAuth.uid : 0);
    var idUsuarioStore = store.getState().usuario.uid;
    if(!idUsuarioStore && idAuth) return 'login';
    if(!idAuth && (idUsuarioStore)) return 'logout';
    return 'noChange';
}
export const checarLogin = (callbackLogin) => {
    firebaseAuth.onAuthStateChanged(async userAuth => {
        var elementos = store.getState().present.elementos;
        var tipoEvento = getTipoEvento(userAuth);
        var pushar;
        if (tipoEvento === 'noChange') {
            if (!primeiraTentativa) return;
            [ tipoEvento, pushar ] = [ 'logout', false ];
        }
        var user = await gerarDocumentoUsuario(userAuth) || {};
        var apresentacao = {elementos: elementos};
        if (primeiraTentativa) {
            apresentacao = await getApresentacaoComLocation(history.location, user.uid) || 
                           await getUltimaApresentacaoUsuario(user);
            primeiraTentativa = false;
        } else {
            if (tipoEvento === 'login' && elementos.length === 1) {
                apresentacao = await getUltimaApresentacaoUsuario(user);
            }
        }
        store.dispatch({type: tipoEvento, usuario: user});
        definirApresentacaoAtiva(user, apresentacao, undefined, undefined, pushar);
        if (callbackLogin) callbackLogin(user);
    });
}