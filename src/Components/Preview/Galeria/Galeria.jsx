import React, { Component } from 'react';
import './style.css';
import listaFundos from './listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';
import Carrossel from '../../Carrossel/Carrossel';
import InputImagem from '../../AdicionarImagem/InputImagem';
import Popup from '../../Configurar/Popup/Popup';
import animacaoCoordenadas from '../../Animacao/animacaoCoordenadas.js'

class Galeria extends Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.coordenadasBotao = [ 76, 90, 16, 2];
        this.coordenadasGaleria = [ 66, 2, 10, 2];
        this.state = {popupCompleto: null, imagens: this.getImagens(), coordenadas: [...this.coordenadasBotao], galeriaVisivel: false};
    }

    mostrarGaleria = () => {
        var limite = JSON.stringify(this.state.coordenadas) === JSON.stringify(this.coordenadasGaleria) ? 
                     this.coordenadasBotao : 
                     this.coordenadasGaleria;
        this.animacao = setInterval(() => {
            var coordenadas = animacaoCoordenadas(this.state.coordenadas, limite, 3);
            if (coordenadas[1] < 50) {
                this.setState({galeriaVisivel: true});
            } else {
                this.setState({galeriaVisivel: false});
            }
            if (JSON.stringify(coordenadas) === JSON.stringify(limite)) clearInterval(this.animacao)
            this.setState({coordenadas: coordenadas})
        }, 10);
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
            <div id='botao-mostrar-galeria' className='botao-azul' onClick={this.mostrarGaleria} 
                style={{top: this.state.coordenadas[0] + 'vh', right: this.state.coordenadas[1] + 'vw', bottom: this.state.coordenadas[2] + 'vh', left: this.state.coordenadas[3] + 'vw',
                        pointerEvents: this.state.galeriaVisivel ? 'none' : 'all', background: this.state.galeriaVisivel ? 'var(--azul-forte)' : ''}}>
                <div style={{display: !this.state.galeriaVisivel ? '' : 'none'}}>Galeria de Fundos</div>
                <div className={'container-carrossel-fundos'} style={{display: this.state.galeriaVisivel ? '' : 'none'}}
                     onClick={e => e.stopPropagation()}>
                    <Carrossel tamanhoIcone={100} refGaleria={this.ref} tamanhoMaximo='96vw' style={{zIndex: '45'}} corGradiente='var(--azul-forte)'
                               percentualBeirada={0.1}>
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
                </div>
            </div>
            {this.state.popupCompleto}
        </>
        )
    }
}
 
export default connect()(Galeria);