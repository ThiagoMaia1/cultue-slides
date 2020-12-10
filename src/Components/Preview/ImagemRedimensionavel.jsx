import React, { Component } from 'react';
import { store } from '../../index';

const editarEstilo = valor => {
    store.dispatch({type: 'editar-slide', objeto: 'imagem', valor})
}

class ImagemRedimensionavel extends Component {

    // onMouseOver = e => {
    //     elem = e.target;
    //     var [left, top, width, height] = [ 
    //         elem.target.offsetLeft, elem.offsetTop, elem.target.offsetWidth, elem.offsetHeight 
    //     ];
    //     var [x, y] = [
    //         e.nativeEvent.clientX - left, 
    //         e.nativeEvent.clientY - top
    //     ];
        
    //     var [bordaEsquerda, bordaDireita, bordaInferior, bordaSuperior];
    //     const tolerancia = 5;
        
    //     if(x < tolerancia) {bordaEsquerda = true}
    //     else if (x > width - tolerancia) {bordaDireita = true}
    //     if (y < tolerancia) {bordaSuperior = true}
    //     else if (y > height - tolerancia) {bordaInferior = true}
        
    //     if ((bordaDireita && bordaSuperior) || borda ) setCursor('ew-resize');
    //     if ()

    // }
    
    // setCursor = cursor => {
    //     this.setState({cursor: cursor});
    // }

    render () {
        return (
            <div id='quadro-redimensionar' className='div-imagem-slide'
                //  onMouseOver={this.onMouseOver}
                 style={{opacity: 0, resizable: 'both'}}>
                <img className='imagem-slide' src={this.props.imagem.src} alt={this.props.imagem.alt}
                     style={{opacity: 1, ...this.props.style, padding: 0, isolation: 'isolate'}}/>
            </div>
        )
    }
};

export default ImagemRedimensionavel;
