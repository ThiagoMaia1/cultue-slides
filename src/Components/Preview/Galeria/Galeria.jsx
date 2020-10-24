import React, { Component } from 'react';
import './style.css';
import listaFundos from './listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';
import Carrossel from '../../Carrossel/Carrossel';
import InputImagem from '../../AdicionarImagem/InputImagem';
import Popup from '../../Configurar/Popup/Popup';

class Galeria extends Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {popupCompleto: null, imagens: this.getImagens()};
    }

    getImagens() {
        var imagens = [];
        for (var i of listaFundos.imagens) {
            imagens.push({id: i.path, fundo: './Fundos/' + i.path, alt: i.path.split('.')[0], tampao: i.tampao, texto: {color: i.color}})
        }
        return imagens;
    }

    abrirPopup = () => {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={() => this.setState({popupCompleto: null})}>
                <h4>Enviar Fundo Personalizado</h4>
                <InputImagem callback={this.enviarImagensFundo}/>
            </Popup>
        ), painelAdicionar: false});
    }

    enviarImagensFundo = imagens => {
        var imgs = imagens.map(i => ({...i, texto: {color: '#000'}, tampao: {opacity: 0}}))
        this.setState({imagens: [...imgs, ...this.state.imagens]})
    }

    render () {
        return (
        <>
            {this.state.popupCompleto}
            <Carrossel tamanhoIcone={2} refGaleria={this.ref} tamanhoMaximo='100vw' zIndex='45'>
                <div ref={this.ref} className='galeria-fundos'>
                    <div className='div-img' onClick={this.abrirPopup}>
                        <div id='botao-enviar-fundo' className='imagem-galeria'>Enviar Fundo Personalizado</div>
                    </div>
                    {this.state.imagens.map(imagem => (
                        <Img key={imagem.id} imagem={imagem} />
                        ))
                    }
                </div>
            </Carrossel>
        </>
        )
    }
}
 
export default connect()(Galeria);