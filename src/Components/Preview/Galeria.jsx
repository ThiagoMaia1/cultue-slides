import React, { Component } from 'react';
import './Galeria.css';
import listaFundos from './Fundos/listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';
import Carrossel from '../Basicos/Carrossel/Carrossel';
import InputImagem from '../Popup/PopupsAdicionar/AdicionarImagem/InputImagem';
import Popup from '../Popup/Popup';
import { toggleAnimacao } from '../Basicos/Animacao/animacaoCoordenadas.js'

class Galeria extends Component {

    constructor (props) {
        super(props);
        this.coordenadasBotao = [ 80, 89, 12, 3];
        this.coordenadasGaleria = [ 70, 2, 6, 2];
        this.state = {popupCompleto: null, imagens: this.getImagens(), coordenadas: [...this.coordenadasBotao], galeriaVisivel: false};
    }

    mostrarGaleria = () => {
        if (this.state.coordenadas[0] === this.coordenadasBotao[0]) 
            this.props.dispatch({type: 'definir-item-tutorial', itemTutorial: 'galeriaFundos'})
        toggleAnimacao(
            this.state.coordenadas,
            this.coordenadasBotao,
            this.coordenadasGaleria,
            c => this.setState({coordenadas: c}),
            bool => {
                if (this.state.galeriaVisivel !== bool)
                    this.setState({galeriaVisivel: bool})
            },
            c => c[1] < 45
        )
    }

    getImagens() {
        var imagens = [];
        for (var i of listaFundos.imagens) {
            imagens.push({fundo: {path: i.path}, alt: i.path ? i.path.split('.')[0] : 'Cor Sólida', tampao: i.tampao, texto: {color: i.color}})
        }
        return imagens;
    }

    abrirPopup = () => {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={() => this.setState({popupCompleto: null})}>
                <h4>Enviar Fundo Personalizado</h4>
                <InputImagem callback={this.enviarImagensFundo} callbackUpload={this.callbackUpload}/>
            </Popup>
        ), painelAdicionar: false});
    }

    callbackUpload = (idUpload, urlUpload) => {
        var imgs = [...this.state.imagens];
        this.setState({
            imagens: imgs.map(i => {
                if(i.fundo.idUpload === idUpload) 
                    i.fundo.src = urlUpload;
                return i;
            })
        });
    }

    enviarImagensFundo = imagens => {
        var imgs = imagens.map(i => (
            {imagem: i, fundo: {src: i.src, idUpload: i.idUpload}, alt: i.alt, height: i.height, width: i.width, texto: {color: '#000'}, tampao: {opacity: 0}}
        ))
        this.setState({imagens: [...imgs, ...this.state.imagens]})
    }

    render () {
        if (this.props.autorizacao !== 'editar') return null;
        return (
            <>
                <div id='botao-mostrar-galeria' className='botao-azul' onClick={this.mostrarGaleria} 
                    style={{top: this.state.coordenadas[0] + 'vh', right: this.state.coordenadas[1] + 'vw', bottom: this.state.coordenadas[2] + 'vh', left: this.state.coordenadas[3] + 'vw',
                            pointerEvents: this.state.galeriaVisivel ? 'none' : 'all', background: this.state.galeriaVisivel ? 'var(--azul-forte)' : ''}}>
                    <div className='colapsar-menu galeria' 
                        onClick={this.mostrarGaleria} 
                        style={{display: this.state.galeriaVisivel ? '' : 'none'}}>◣
                    </div>
                    <div style={{display: !this.state.galeriaVisivel ? '' : 'none'}}>Galeria de Fundos</div>
                    <div className={'container-carrossel-fundos'} style={{display: this.state.galeriaVisivel ? '' : 'none'}}
                        onClick={e => e.stopPropagation()}>
                        <Carrossel tamanhoIcone={100} tamanhoMaximo='96vw' style={{zIndex: '45'}} corGradiente='var(--azul-forte)'
                                percentualBeirada={0.04}>
                            <div className='galeria-fundos'>
                                <div className='pseudo-margem-galeria'></div>
                                <div className='div-img' onClick={this.abrirPopup}>
                                    <div id='botao-enviar-fundo' className='imagem-galeria'>Enviar Fundo Personalizado</div>
                                </div>
                                {this.state.imagens.map(img => (
                                    <Img key={img.path || img.src} imagem={img} />
                                    ))
                                }
                                <div className='pseudo-margem-galeria'></div>
                            </div>
                        </Carrossel>
                    </div>
                </div>
                {this.state.popupCompleto}
            </>
        )
    }
}
 
const mapState = state => (
    {autorizacao: state.present.apresentacao.autorizacao}
)

export default connect(mapState)(Galeria);