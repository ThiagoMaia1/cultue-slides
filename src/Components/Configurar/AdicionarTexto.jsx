import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import Element from '../../Element'
import { connect } from 'react-redux';
import Carrossel from '../Carrossel/Carrossel';

class AdicionarTexto extends Component {
    
    constructor (props) {
        super(props);
        this.refTitulo = React.createRef();
        this.state = {botoesVisiveis: false, titulo: '', textoSlide: '', mensagemErro: ''};
    }

    gerarListaSlidesPadrao = () => 
        this.props.usuario.slidesPadrao.map(s => (
            <button className='botao' key={s.titulo} tabIndex='-1' 
                    onClick={() => this.setState({titulo: s.titulo, textoSlide: s.textoSlide})}>
                        {s.titulo}
            </button>
    ));

    onClick () {
        var popupAdicionar = {input1: this.state.titulo, input2: this.state.textoSlide};
        this.props.dispatch({type: "inserir", 
                             elemento: new Element( "TextoLivre", this.state.titulo, [...this.state.textoSlide.split('\n\n')]),
                             popupAdicionar: popupAdicionar,
                             elementoASubstituir: this.props.elementoASubstituir
                            });
    }

    focarTitulo = () => this.refTitulo.current.focus();

    limparInputs = () => {
        this.setState({titulo: '', textoSlide: ''});
        this.focarTitulo();
    }

    componentDidMount() {
        setTimeout(() => {this.focarTitulo()}, 1)
    }

    criarSlidePadrao = () => {
        if(!this.state.titulo) return this.definirMensagemErro('O slide padrão deve ter um título.');
        var titulosExistentes = this.props.usuario.slidesPadrao.reduce((resultado, slide) => [...resultado, slide.titulo], []);
        if(titulosExistentes.includes(this.state.titulo)) return this.definirMensagemErro('O título definido já existe.');
        this.props.dispatch({type: 'adicionar-slide-padrao', slide: {titulo: this.state.titulo, textoSlide: this.state.textoSlide}});
    }

    definirMensagemErro = mensagem => {
        this.setState({mensagemErro: mensagem})
        this.focarTitulo();
    }

    changeTitulo = e => this.setState({titulo: e.target.value, mensagemErro: ''});

    render () {
        return (
            <div className='conteudo-popup'>
                <div>
                    <h4 className='titulo-popup'>Adicionar Slide de Texto</h4>
                    <input ref={this.refTitulo} id="input-titulo" className='combo-popup' type='text' placeholder='Título do slide' value={this.state.titulo}
                        defaultValue={this.props.input1} 
                        onChange={this.changeTitulo}/>
                </div>
                <textarea id="input-texto-slide" className='combo-popup' placeholder='Texto do slide' value={this.state.textoSlide}
                    defaultValue={this.props.input2} 
                    onChange={e => this.setState({textoSlide: e.target.value})}></textarea>
                <div className='lista-slides-padrao'>
                    <Carrossel tamanhoIcone={45} tamanhoMaximo='20vh' direcao='vertical' style={{zIndex: '400', width: '100%'}} percentualBeirada={0.12}>
                        <div className='itens-lista-slides-padrao'>
                            <div className='titulo-secao-popup'>Slides Padrão: </div>
                            {this.gerarListaSlidesPadrao()}
                            <button id='botao-adicionar-slide-padrao' onClick={this.criarSlidePadrao}>+</button>
                        </div>
                    </Carrossel>
                </div>
                <div className='mensagem-erro'>
                    <div>{this.state.mensagemErro}</div>
                </div>
                <div className='container-botoes-popup' style={(this.state.titulo || this.state.textoSlide) ? null : {visibility: 'hidden'}}>
                    <button className='botao' onClick={this.onClick.bind(this)}>Inserir Título</button>
                    <button className='botao limpar-input' onClick={this.limparInputs}>✕ Limpar</button>
                </div>
            </div>
        )
    }
}

const mapState = state => {
    var usuario = state.usuario;
    if (!usuario.slidesPadrao) usuario.slidesPadrao = [];
    return {usuario: usuario}
}

export default connect(mapState)(AdicionarTexto);