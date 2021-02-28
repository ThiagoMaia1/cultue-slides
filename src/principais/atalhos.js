import hotkeys from 'hotkeys-js';
import { useEffect } from 'react';
import { tiposElemento } from './Element.js';
import store from '../index';
import { zerarApresentacao } from './firestore/apresentacoesBD';

const tipos = Object.keys(tiposElemento);
const atalhosAdicionar = {ctrlm: 0, ctrlb: 1, ctrll: 2, ctrli: 3, ctrle: 4};
export const arrowsHotkeys = '';

export const atalhoOffset = offset => store.dispatch({type: 'definir-selecao', offset});

const filtroInicial = hotkeys.filter;

// hotkeys.filter = function (event) {
//     console.log(event);
//     var target = event.target || event.srcElement;
//     var tagName = target.tagName;
//     var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>
    
//     if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
//       flag = false;
//     }
  
//     return flag;
//   }
  
export const useHotkeysFilter = filtroPersonalizado => useEffect(() => {
        hotkeys.filter = e => (
            filtroPersonalizado(e, filtroInicial(e))
        )
        return () => hotkeys.filter = filtroInicial
    }
)

const inicializarHotkeys = () => {
    hotkeys('ctrl+d,ctrl+z,ctrl+shift+z,ctrl+y,f5', (e, handler) => {
        e.preventDefault();
        switch(handler.key) {
            case 'ctrl+z':
                store.dispatch({type: 'UNDO'});
                break;
            case 'ctrl+y':
            case 'ctrl+shift+z':
                store.dispatch({type: 'REDO'});
                break;
            case 'f5':
                store.dispatch({type: 'definir-modo-apresentacao'});
                break;
            default:
                return;
        }
    })
    
    hotkeys('esc,ctrl+o,ctrl+d,ctrl+m,ctrl+i,ctrl+b,ctrl+l,ctrl+e,ctrl+f,up,left,down,right', 'main', (e, handler)=> {
        e.preventDefault();
        const state = store.getState();
        switch (handler.key) {
            case 'esc':
                console.log('esc')
                desativarPopup('confirmacao');
                desativarPopup('adicionar');
                break;
            case 'right':
            case 'down':
                atalhoOffset(1);
                break;
            case 'left':
            case 'up':
                atalhoOffset(-1);
                break;
            case 'ctrl+o':
                zerarApresentacao(state.usuario, state.apresentacao);
                break;
            case 'ctrl+f':
                store.dispatch({type: 'toggle-search'});
                break;
            case 'ctrl+d':
                store.dispatch({type: 'duplicar-slide'});
                break;
            default:
                var atalho = handler.key.replace('+','');
                var tipo = tipos[atalhosAdicionar[atalho]];
                store.dispatch({type: 'ativar-popup-adicionar', popupAdicionar: {tipo: tipo}});
        }
    });
}

const desativarPopup = tipo => 
    store.dispatch({type: 'ativar-popup-' + tipo, popupAdicionar: null});

export default inicializarHotkeys;