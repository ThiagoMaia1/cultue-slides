import React, { Component } from 'react';
import ComboLetra from './../LetrasMusica/ComboLetra';
import TextoBiblico from './../TextoBiblico/TextoBiblico';
import AdicionarTitulo from './AdicionarTitulo';
import AdicionarImagem from './../AdicionarImagem/AdicionarImagem';
// import { GrChapterAdd } from 'react-icons/gr';

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {...props};
    }

    render() {
        var Desenv = (<h4>Recurso em desenvolvimento</h4>)
        return (
            <>
                <div id="div-botoes">
                    {/* <div id='container-adicionar-slide' style={{display: this.state.adicionarVisivel ? '' : 'none' }}>
                        <div><div id='p-adicionar-slide'>Adicionar um Slide</div>
                        <GrChapterAdd size={50}/></div>
                    </div> */}
                    <button className="Título itens botao-adicionar" onClick={() => this.props.callback(AdicionarTitulo)}>Título</button>
                    <button className="Texto-Bíblico itens botao-adicionar" onClick={() => this.props.callback(TextoBiblico)}>Texto Bíblico</button>
                    <button className="Música itens botao-adicionar" onClick={() => this.props.callback(ComboLetra)}>Música</button>
                    <button className="Imagem itens botao-adicionar" onClick={() => this.props.callback(AdicionarImagem)}>Ima- gem</button>
                    <button className="Vídeo itens botao-adicionar" onClick={() => this.props.callback(Desenv)}>Vídeo</button>
                </div>
                
            </>
        )
    }
}

export default Adicionar;