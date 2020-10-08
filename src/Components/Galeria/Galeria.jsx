import React, { Component } from 'react';
import './style.css';
import listaFundos from './Fundos/listaFundos.json';

class Galeria extends Component {
    
    getImagens() {
        var imagens = [];
        for (var i of listaFundos.imagens) {
            imagens.push({id: i, path: './Fundos/' + i, alt: i.split('.')[0]})
        }
        return imagens;
    }

    onClick (e) {
        //Atribuir imagem
    }

    render () {
        return (
            <div id='galeria'>
                {this.getImagens().map( imagem => (
                    <Img key={imagem.id} imagem={imagem} onClick={this.onClick}/>
                ))
                    }
            </div>
        )
    }
}
 
const Img = ( { imagem } ) => (
    <div className='div-img'>
        <img src={require('' + imagem.path)} alt={imagem.alt} />
    </div>
);

export default Galeria;