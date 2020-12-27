import React from 'react';
import { connect } from 'react-redux';
import store from '../../../../index';
import GaleriaImagensPopup from './GaleriaImagensPopup';
import Popup from '../../Popup';

const GaleriaUsuario = ({callback, imagensUsuario = [], subconjunto = null, fecharPopup}) => {
    let imagens = (subconjunto 
                   ? imagensUsuario[subconjunto]
                   : [...new Set(Object.keys(imagensUsuario).reduce((resultado, k) => 
                        [...resultado, ...imagensUsuario[k]], []))]);
    
    const apagar = i => {
        let url = imagens[i];
        let subconjunto;
        for (var s of Object.keys(imagensUsuario)) {
            let indice = imagensUsuario[s].indexOf(url);
            if (indice > -1) {
                subconjunto = s;
                break;
            }
        }
        store.dispatch({type: 'alterar-imagem-colecao-usuario', subconjunto, urls: url, excluir: true});
    }

    return (
        <Popup style={{width: '80vw', height: '80vh'}} ocultarPopup={fecharPopup}>
            <h4 className='titulo-popup'>Galeria de Imagens do Usuário</h4>
            <GaleriaImagensPopup imagens={imagens}
                                 onClickImagem={callback}
                                 apagar={apagar}
                                 fecharPopup={fecharPopup}
                                 mensagemConfirmarExclusao={'Tem certeza que deseja excluir essa imagem do banco de dados?\n\n' +
                                                            '(Essa ação não poderá ser desfeita)'}                                
            />
        </Popup>
    )
}

const mapState = state => ({
    imagensUsuario: state.usuario.imagens
});

export default connect(mapState)(GaleriaUsuario);