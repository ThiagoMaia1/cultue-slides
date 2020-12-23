import React from 'react';
import { connect } from 'react-redux';
import store from '../../../../index';
import GaleriaImagensPopup from './GaleriaImagensPopup';
import Popup from '../../Popup';

const GaleriaUsuario = ({callback, imagensUsuario = [], soFundos = false, fecharPopup}) => {
    let imagens = imagensUsuario.fundos || [];
    if (!soFundos) imagens = [...imagens, ...imagensUsuario.gerais];

    const apagar = i => {
        let link = imagens[i];
        for (var subconjunto of Object.keys(imagensUsuario)) {
            var indice = imagensUsuario[subconjunto].indexOf(link);
            if (indice > -1) break;
        }
        store.dispatch({type: 'alterar-imagem-colecao-usuario', subconjunto, indice});
    }

    return (
        <Popup style={{width: '80vw', height: '80vh'}} ocultarPopup={fecharPopup}>
            <h4 className='titulo-popup'>Galeria de Imagens do Usuário</h4>
            <GaleriaImagensPopup imagens={imagens}
                                 onClickImagem={callback}
                                 apagar={apagar}
                                 mensagemConfirmarExclusao={'Tem certeza que deseja excluir essa imagem do banco de dados?\n\n' +
                                                            '(Essa ação não pode ser desfeita)'}                                
            />
        </Popup>
    )
}

const mapState = state => ({
    imagensUsuario: state.usuario.imagens
});

export default connect(mapState)(GaleriaUsuario);