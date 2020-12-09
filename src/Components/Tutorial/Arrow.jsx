import React from 'react';
import './Tutorial.css';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { getCoords } from '../../FuncoesGerais';

const s = Math.SQRT2;

const posicoesArrow = {
    topLeft: {indiceAngulo: 0, coordenadas: [0, 0], topLeft: [-s, -s], tamanho: [s, s]},
    topCenter: {indiceAngulo: 1, coordenadas: [0, 0.5], topLeft: [-1, 0], tamanho: [1, 0]},
    topRight: {indiceAngulo: 2, coordenadas: [0, 1], topLeft: [-s, 0], tamanho: [s, s]},
    centerLeft: {indiceAngulo: 7, coordenadas: [0.5, 0], topLeft: [0, -1], tamanho: [0, 1]},
    center: {indiceAngulo: 7, coordenadas: [0.5, 0.5], topLeft: [0, -1], tamanho: [0, 1]},
    centerRight: {indiceAngulo: 3, coordenadas: [0.5, 1], topLeft: [0, 0], tamanho: [0, 1]},
    bottomLeft: {indiceAngulo: 6, coordenadas: [1, 0], topLeft: [0, -s], tamanho: [s, s]},
    bottomCenter: {indiceAngulo: 5, coordenadas: [1, 0.5], topLeft: [0, 0], tamanho: [1, 0]},
    bottomRight: {indiceAngulo: 4, coordenadas: [1, 1], topLeft: [0, 0], tamanho: [s, s]}
}

const xChildren = '6vw';
const yChildren = '8vh';

const posicoesChildren = {
    top: {bottom: yChildren},
    right: {left: xChildren},
    bottom: {top: yChildren},
    left: {right: xChildren},
}

const getAngulo = indiceAngulo => -180 + indiceAngulo*45;

const getEstiloArrow = (selectorElemento, posicaoArrow, distancia = null) => {
    var { indiceAngulo, coordenadas } = posicoesArrow[posicaoArrow];
    if (!document.querySelectorAll(selectorElemento)[0]) return null;
    var estiloArrow = getCoords(document.querySelectorAll(selectorElemento)[0], coordenadas[1], coordenadas[0]);
    estiloArrow.transform = 'rotate(' + getAngulo(indiceAngulo) + 'deg)';
    if (distancia) {
        var d = distancia + 'px';
        estiloArrow.paddingLeft = d;
        estiloArrow.paddingTop = d; 
    }
    return estiloArrow;
}

const getTopLeftArrow = (posicaoArrow, estiloArrow, tamanho, posicaoChildren, distancia = 0) => {
    var posicao = posicoesArrow[posicaoArrow];
    var deslocamento = posicao.topLeft;
    var modificadorTamanho = posicao.tamanho;
    const dimensoes = ['top', 'left']
    return dimensoes.reduce((resultado, d, i) => {
        var tamanhoIconeOcupa = 0.95;
        resultado[d] = estiloArrow[d] + 
                       deslocamento[i]*tamanho*tamanhoIconeOcupa +
                       distancia*modificadorTamanho[i]*(deslocamento[i] < 0 ? -2 : 1);
        return resultado;
    }, {});
}

const getSizeArrow = (posicaoArrow, tamanho) => {
    var deslocamento = posicoesArrow[posicaoArrow].tamanho;
    var dimensoes = ['height', 'width'];
    return dimensoes.reduce((resultado, d, i) => {
        resultado[d] = deslocamento[i] ? deslocamento[i]*tamanho : 'auto'; 
        return resultado;
    }, {});
};

function Arrow (props) {

    var estiloArrow = getEstiloArrow(props.selectorElemento, props.posicao, props.distancia);
    if (!estiloArrow) return null;
    var tamanho = props.tamanhoIcone || 150;
    var posicaoChildren = props.posicaoChildren || 'left';
    const estiloChildren = getTopLeftArrow(props.posicao, estiloArrow, tamanho, posicaoChildren, props.distancia);
    const sizeArrow = getSizeArrow(props.posicao, tamanho);
    return (
        <div>
            <div style={{position: 'fixed', top: 0, left: 0}}>
                <div className='arrow' style={estiloArrow}>
                    <div style={{transform: 'rotate(225deg)'}}>
                        <FaLongArrowAltRight size={tamanho}/>
                    </div>
                </div>
                {props.children 
                    ? <div className='container-children-arrow' style={estiloChildren}>
                        <div className='container-children-interno' style={{...posicoesChildren[posicaoChildren], ...sizeArrow}}>
                            {props.children}
                        </div>
                      </div>
                    : null
                }
            </div>
        </div>
    )
}

export default Arrow;
