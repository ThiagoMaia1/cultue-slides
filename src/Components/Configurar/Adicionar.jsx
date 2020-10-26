import React, { Component } from 'react';
import ComboLetra from './../LetrasMusica/ComboLetra';
import TextoBiblico from './../TextoBiblico/TextoBiblico';
import AdicionarTitulo from './AdicionarTitulo';
import AdicionarImagem from './../AdicionarImagem/AdicionarImagem';
import AdicionarVideo from './../AdicionarVideo/AdicionarVideo';
// import { GrChapterAdd } from 'react-icons/gr';

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {...props};
    }

    render() {
        return (
            <>
                <div id="div-botoes">
                    {/* <div id='container-adicionar-slide' style={{display: this.state.adicionarVisivel ? '' : 'none' }}>
                        <div><div id='p-adicionar-slide'>Adicionar um Slide</div>
                        <GrChapterAdd size={50}/></div>
                    </div> */}
                    <button className="botao-azul itens" onClick={() => this.props.callback(AdicionarTitulo)}>Título</button>
                    <button className="botao-azul itens" onClick={() => this.props.callback(TextoBiblico)}>Texto Bíblico</button>
                    <button className="botao-azul itens" onClick={() => this.props.callback(ComboLetra)}>Música</button>
                    <button className="botao-azul itens" onClick={() => this.props.callback(AdicionarImagem)}>Ima- gem</button>
                    <button className="botao-azul itens" onClick={() => this.props.callback(AdicionarVideo)}>Vídeo</button>
                </div>
                
            </>
        )
    }
}

export default Adicionar;