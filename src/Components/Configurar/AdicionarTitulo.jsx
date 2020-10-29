import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import Element from '../../Element'
import { connect } from 'react-redux';

const listaSlidesPadrao = [{titulo: 'Visitantes', textoSlide: 'Sejam bem-vindos à nossa Igreja!'},
                           {titulo: 'Avisos', textoSlide: ''}, 
                           {titulo: 'Mensagem', textoSlide: ''}
]

class AdicionarTitulo extends Component {
    
    constructor (props) {
        super(props);
        this.refTitulo = React.createRef();
        this.refTextoSlide = React.createRef();
        this.state = {botoesVisiveis: false}
    }

    gerarListaSlidesPadrao = () => 
        listaSlidesPadrao.map(s => (
            <button className='botao' key={s.titulo} 
                    onClick={() => {
                        this.refTitulo.current.value = s.titulo;
                        this.refTextoSlide.current.value = s.textoSlide;
                        this.onChange();
                    }}>{s.titulo}</button>
    ));

    onClick () {
        var titulo = this.refTitulo.current.value;
        var textoSlide = this.refTextoSlide.current.value;
        this.props.dispatch({type: "inserir", 
                             elemento: new Element( "Título", titulo, [...textoSlide.split('\n\n')])});
    }

    limparInputs = () => {
        this.refTitulo.current.value = '';
        this.refTextoSlide.current.value = '';
        this.refTitulo.current.focus();
    }

    onChange = () => {
        var visiveis = (this.refTitulo.current.value + this.refTextoSlide.current.value !== '') 
        this.setState({botoesVisiveis: visiveis})
    }

    componentDidMount() {
        setTimeout(() => {this.refTitulo.current.focus()}, 1)
    }

    render () {
        return (
            <div className='conteudo-popup' onChange={this.onChange}>
                <div>
                    <h4 className='titulo-popup'>Adicionar Slide de Texto</h4>
                    <input ref={this.refTitulo} id="input-titulo" className='combo-popup' type='text' placeholder='Título do slide' />
                </div>
                <textarea ref={this.refTextoSlide} id="input-texto-slide" className='combo-popup' placeholder='Texto do slide'></textarea>
                <div className='lista-slides-padrao'>
                    <div className='titulo-secao-popup'>Slides Padrão: </div>
                    {this.gerarListaSlidesPadrao()}
                </div>
                <div className='container-botoes-popup' style={{visibility: this.state.botoesVisiveis ? '' : 'hidden'}}>
                    <button className='botao' onClick={this.onClick.bind(this)}>Inserir Título</button>
                    <button className='botao limpar-input' onClick={this.limparInputs}>✕ Limpar</button>
                </div>
            </div>
        )
    }
}

export default connect()(AdicionarTitulo);