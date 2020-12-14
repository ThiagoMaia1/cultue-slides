import hotkeys from 'hotkeys-js';
import { tiposElemento } from './Element.js';
import { store } from '../index';
import { zerarApresentacao } from './firestore/apresentacoesBD';

const tipos = Object.keys(tiposElemento);
const atalhosAdicionar = {ctrlm: 0, ctrlb: 1, ctrll: 2, ctrli: 3, ctrld: 4};
export const arrowsHotkeys = '';

export const atalhoOffset = offset => store.dispatch({type: 'offset-selecao', offset});

const inicializarHotkeys = () => {
    hotkeys('ctrl+d,ctrl+z,ctrl+shift+z,ctrl+y', (e, handler) => {
        e.preventDefault();
        switch(handler.key) {
            case 'ctrl+z':
                store.dispatch({type: 'UNDO'});
                break;
            case 'ctrl+y':
            case 'ctrl+shift+z':
                store.dispatch({type: 'REDO'});
                break;
            default:
                return;
        }
    })
    
    hotkeys('esc,f5,ctrl+o,ctrl+m,ctrl+i,ctrl+b,ctrl+l,ctrl+d,ctrl+f,up,left,down,right', 'app', (e, handler)=> {
        e.preventDefault();
        const state = store.getState();
        switch (handler.key) {
            case 'esc':
                store.dispatch({type: 'ativar-popup-confirmacao', popupConfirmacao: null});
                store.dispatch({type: 'ativar-popup-adicionar', popupAdicionar: null});
                break;
            case 'right':
            case 'down':
                atalhoOffset(1);
                break;
            case 'left':
            case 'up':
                atalhoOffset(-1);
                break;
            case 'f5':
                store.dispatch({type: 'definir-modo-apresentacao'});
                break;
            case 'ctrl+o':
                zerarApresentacao(state.usuario, state.apresentacao);
                break;
            case 'ctrl+f':
                store.dispatch({type: 'toggle-search'});
                break;
            default:
                var atalho = handler.key.replace('+','');
                var tipo = tipos[atalhosAdicionar[atalho]];
                store.dispatch({type: 'ativar-popup-adicionar', popupAdicionar: {tipo: tipo}});
        }
    });
}

export default inicializarHotkeys;