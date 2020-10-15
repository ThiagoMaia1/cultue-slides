import React, { Component } from 'react';
import './style.css';
import listaFundos from './listaFundos.json';
import { connect } from 'react-redux';
import Img from './Img';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const diferencaDireita = 350;

class Galeria extends Component {

    constructor (props) {
        super(props);
        this.state = {...props, offset: 0};
    }

    getImagens() {
        var imagens = [];
        var j = 0;
        for (var i of listaFundos.imagens) {
            j++; //Só pra ter menos imagens pra carregar enquanto crio o site.
            // if (j>8) break;
            imagens.push({id: i.path, fundo: './Fundos/' + i.path, alt: i.path.split('.')[0], tampao: i.tampao, texto: {color: i.color}})
        }
        return imagens;
    }
    
    deslizar(sentido, tamanhoPasso = 50) {
        var galeria = document.getElementById('galeria');
        clearInterval(this.animacao);
        this.animacao = setInterval(() => {
            var o = this.state.offset
            var passo = - sentido*tamanhoPasso;
            if (o + passo > 0 || o + passo <= galeria.parentNode.parentNode.offsetWidth - galeria.offsetWidth - diferencaDireita) {
                clearInterval(this.animacao);
            } else {
                this.setState({offset: o + passo});
            }
        }, 100);
    }

    saltar(sentido) {
        // this.deslizar(sentido, 300); //Com animação pra não ser um pulo muito brusco (necessário corrigir travação pra usar)
        var galeria = document.getElementById('galeria');
        var final = 0;
        if (sentido > 0) final = galeria.parentNode.parentNode.offsetWidth - galeria.offsetWidth - diferencaDireita;
        this.setState({offset: final})
    }

    pararDeslizar = () => {
        clearInterval(this.animacao);
    }

    render () {
        return (
            <div id='super-galeria'>
                <MdKeyboardArrowLeft className="seta-galeria esquerda" onMouseOver={() => this.deslizar(-1)} onMouseLeave={this.pararDeslizar}
                    onClick={() => this.saltar(-1)}/>
                <MdKeyboardArrowRight className="seta-galeria direita" onMouseOver={() => this.deslizar(1)} onMouseLeave={this.pararDeslizar}
                    onClick={() => this.saltar(1)}/>
                <div id='container-galeria'>
                    <div id='galeria' style={{left: this.state.offset + 'px'}}>
                    {this.getImagens().map( imagem => (
                        <Img key={imagem.id} imagem={imagem} />
                        ))
                    }
                    </div>
                </div>
            </div>
        )
    }
}
 
export default connect()(Galeria);