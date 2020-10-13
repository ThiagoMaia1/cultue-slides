import React, { Component } from 'react';
import './style.css';
import listaFundos from './listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';

class Galeria extends Component {
    
    getImagens() {
        var imagens = [];
        var j = 0;
        for (var i of listaFundos.imagens) {
            j++; //Só pra ter menos imagens pra carregar enquanto crio o site.
            if (j>6) break;
            imagens.push({id: i.path, fundo: './Fundos/' + i.path, alt: i.path.split('.')[0], tampao: i.tampao, texto: {color: i.color}})
        }
        return imagens;
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