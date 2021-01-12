import React, { Component } from 'react';
import './Galeria.css';
import listaFundos from './Fundos/listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';
import Carrossel from '../Basicos/Carrossel/Carrossel';
import InputImagem from '../Popup/PopupsAdicionar/AdicionarImagem/InputImagem';
import Popup from '../Popup/Popup';
import { getMetadata } from '../../principais/firestore/imagemFirebase';
import { mudancasArrays, objetosSaoIguais } from '../../principais/FuncoesGerais';
import { imagemEstaNoBD } from '../../principais/Element';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

const fundosFixos = listaFundos.imagens.map(i => ({
    fundo: {path: i.path, src: null}, 
    alt: i.path.split('.')[0], 
    tampao: {...i.tampao, eBasico: true}, 
    texto: {color: i.color, eBasico: true}
}));

class Galeria extends Component {

    constructor (props) {
        super(props);
        this.state = {popupCompleto: null, imagens: []};
    }

    getImagens = () => [
        {
            fundo: {path: '', src: null},
            tampao: {backgroundColor: '#ffffff', opacityFundo: '1'},
            texto: {color: '#000000'},
            alt: 'Cor Sólida',
            callback: () => {
                this.props.dispatch({type: 'ativar-realce', abaAtiva: 'tampao'})
                setTimeout(() => document.getElementById('botao-cor-fundo').click(), 50)
            }
        },
            ...this.state.imagens.concat(fundosFixos)
    ];

    abrirPopup = () => {
        this.setState({popupCompleto:
            <Popup ocultarPopup={() => this.setState({popupCompleto: null})}>
                <h4>Enviar Fundo Personalizado</h4>
                <InputImagem eFundo={true} 
                             callback={this.inserirFundoDaColecao}/>
            </Popup>
        });
    }

    inserirFundoDaColecao = imgs => {
        imgs = imgs.filter(i => i.eLinkFirebase);
        if (imgs.length) {
            if (this.props.fundos.includes(imgs[0].src)) {
                ativarPopupConfirmacao(
                    'OK',
                    'Imagem Já Selecionada',
                    'A imagem selecionada já está incluída na galeria de fundos personalizados.'
                )
            } else {
                this.props.dispatch({
                    type: 'alterar-imagem-colecao-usuario',
                    urls: imgs.map(i => i.src), 
                    subconjunto: 'fundos'
                })
                this.setState({popupCompleto: null});
            }
        }    
    }

    inserirFundos = async fundos => {
        if (!Array.isArray(fundos)) fundos = [fundos];
        let imagens = [...this.state.imagens];
        fundos = fundos.filter(f => imagemEstaNoBD(f));
        for (let url of fundos) {
            let name = (await getMetadata(url)).name || '';
            imagens.unshift({
                    fundo: {src: url, path: null},
                    alt: name.substr(0, name.length - 18),
                    tampao: {opacityFundo: '0', backgroundColor: '#000000'},
                    texto: {color: '#000000'},
                    excluivel: true
            })
        };
        this.setState({imagens});
    }

    componentDidMount = () => this.inserirFundos(this.props.fundos);

    componentDidUpdate = prevProps => {
        if(!this.state.galeriaVisivel && prevProps.tutorialAtivo !== this.props.tutorialAtivo) {
            this.mostrarGaleria();
        }
        if (!objetosSaoIguais(prevProps.fundos, this.props.fundos)) {
            let fundos = this.state.imagens.map(i => i.fundo.src);
            let { acrescentar, remover } = mudancasArrays(this.props.fundos, fundos); 
            if(remover.length) {
                this.setState({imagens: this.state.imagens.filter(i => !remover.includes(i.fundo.src))});
            }
            setTimeout(() => this.inserirFundos(acrescentar), 10);
        }
    }

    render () {
        if (this.props.autorizacao !== 'editar') return null;
        return (
            <>
                <div className='container-carrossel-fundos' onClick={e => e.stopPropagation()}>
                    <Carrossel tamanhoIcone={100} tamanhoMaximo='96vw' style={{zIndex: '45'}} corGradiente='var(--azul-forte)'
                            percentualBeirada={0.04}>
                        <div className='galeria-fundos'>
                            <div className='pseudo-margem-galeria'></div>
                            <div className='div-img' onClick={this.abrirPopup}>
                                <div id='botao-enviar-fundo' className='imagem-galeria'>Enviar Fundo Personalizado</div>
                            </div>
                            {this.getImagens().map(img => (
                                <Img key={img.fundo.path || img.fundo.src} imagem={img} callback={img.callback}/>
                            ))}
                            <div className='pseudo-margem-galeria'></div>
                        </div>
                    </Carrossel>
                </div>
                {this.state.popupCompleto}
            </>
        )
    }
}
 
const mapState = state => (
    {
        fundos: (state.usuario.imagens || {}).fundos || [],
        autorizacao: state.present.apresentacao.autorizacao, 
        tutorialAtivo: state.itensTutorial.includes('galeriaFundos')
    }
)

export default connect(mapState)(Galeria);