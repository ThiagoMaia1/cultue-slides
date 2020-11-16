import { store } from '../../index';
import { gerarDocumentoUsuario } from '../../firestore/apiFirestore';
import { firebaseAuth } from "../../firebase";
import { definirApresentacaoAtiva, getApresentacoesUsuario } from '../../firestore/apresentacoesBD';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

export const checarLogin = (callbackLogin) => {
    firebaseAuth.onAuthStateChanged(async userAuth => {
        if (!userAuth) store.dispatch({type: 'login', usuario: {uid: 0}});
        var idUsuarioStore = store.getState().usuario.uid;
        if ((!userAuth && !idUsuarioStore) || (userAuth && userAuth.uid === idUsuarioStore)) return;
        var user = await gerarDocumentoUsuario(userAuth) || {};
        store.dispatch({type: 'login', usuario: user});
        definirApresentacaoUsuario(user);
        if (callbackLogin) callbackLogin(user);
    });
}

const definirApresentacaoUsuario = user => {
    var state = store.getState().present;
    var z = state.apresentacao.zerada;
    if (!user.uid) {
        if (!z)
            definirApresentacaoAtiva(user, {id: 0}, state.elementos)
        return
    }
    if (!z) {
        ativarPopupConfirmacao(
            'simNao', 
            'Apresentação', 
            'Deseja continuar editando a apresentação atual?', 
            fazer => {
                if(fazer) {
                    associarApresentacaoUsuario(user);
                } else {
                    selecionarUltimaApresentacaoUsuario(user);
                }
            }
        )
    } else {
        selecionarUltimaApresentacaoUsuario(user);
    }
}

const associarApresentacaoUsuario = user => {
    var state = store.getState().present;
    definirApresentacaoAtiva(
        user, 
        state.apresentacao,
        state.elementos
    )
}

const selecionarUltimaApresentacaoUsuario = async user => {
    var apresentacoes = await getApresentacoesUsuario(user.uid);
    if (apresentacoes.length !== 0) {
        var oneDay = 24 * 60 * 60 * 1000; // ms
        var tempoDecorrido = (new Date()) - apresentacoes[0].timestamp.toDate();
        if(tempoDecorrido < 7*oneDay)
            definirApresentacaoAtiva(user, apresentacoes[0]);
    }
}

