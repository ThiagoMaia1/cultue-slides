import React, { Component } from 'react';
import './style.css';
import listaFundos from './listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';

class Galeria extends Component {
    
    getImagens() {
        var imagens = [];
        for (var i of listaFundos.imagens) {
            if (i>5) break;
            imagens.push({id: i, path: './Fundos/' + i, alt: i.split('.')[0]})
        }
        return imagens;
    }

    onMouseOver(e) {
        console.log(e.target.imagem);
    }
    
    render () {
        return (
            <div id='galeria'>
                {this.getImagens().map( imagem => (
                    <Img key={imagem.id} imagem={imagem} />
                ))
                    }
            </div>
        )
    }
}
 
export default connect()(Galeria);