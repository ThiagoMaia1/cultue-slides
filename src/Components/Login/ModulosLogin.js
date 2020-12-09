import { store } from '../../index';
import { gerarDocumentoUsuario } from '../../firestore/apiFirestore';
import { firebaseAuth } from "../../firebase";
import history from '../../history';
import { getApresentacaoComLocation, definirApresentacaoAtiva, getUltimaApresentacaoUsuario } from '../../firestore/apresentacoesBD';
import { slidesPadraoDefault } from '../../firestore/apiFirestore';

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
        var state = store.getState().present;
        var elementos = state.elementos;
        var apresentacaoStore = state.apresentacao;
        var tipoEvento = getTipoEvento(userAuth);
        if (tipoEvento === 'noChange' && !primeiraTentativa) return;
        
        var user = await gerarDocumentoUsuario(userAuth) || usuarioAnonimo;
        var apresentacao;
        if (tipoEvento === 'logout') {
            apresentacao = null;
        } else if (apresentacaoStore.id) {
            apresentacao = apresentacaoStore;
        } else {
            if (primeiraTentativa) {
                apresentacao = await getApresentacaoComLocation(history.location, user.uid) || 
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
        }
        store.dispatch({type: 'login', usuario: user});
        var mudarURL = (tipoEvento === 'login'? true : false);
        definirApresentacaoAtiva(user, apresentacao, undefined, undefined, mudarURL);
        if (tipoEvento === 'logout') history.push('/logout');
        if (callbackLogin) callbackLogin(user);
    });
}