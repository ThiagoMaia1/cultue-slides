import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Tutorial.css';
import Arrow from './Arrow';
import hotkeys from 'hotkeys-js';
import listaBoxes from './ListaTutorial';
import { getObjectByStringPath } from '../../principais/FuncoesGerais';
import store from '../../index';

const cssOpacidade = 'opacity: 0.2';
const cssCorFundo = 'background-color: #d0d9ec; box-shadow: 2px 2px 6px rgba(0,0,0,0.1)';

const getCSSFade = (elementos, selector) => {
  var elemento = elementos[0];
  var pai = elemento.parentElement;
  var primeiroSelector = selector.split(',')[0];
  var css = '#App * {pointer-events: none;} ' + primeiroSelector + ', ' + primeiroSelector + ' * {pointer-events: all !important;} ';
  while (!(pai.id === 'App')) {
    var excecoes = '';
    var regraCss = (pai.id === '#botoes-flutuantes-app' ? cssCorFundo : cssOpacidade);
    for (var e of elementos) {
      excecoes += cssNot(getSelectors(e));
    }
    css += getSelectors(pai) + ' > *' + cssNot(getSelectors(elemento)) + excecoes + ' {' + regraCss + ';} ';
    elemento = pai;
    pai = elemento.parentElement;
  }
  if(elemento.id === 'organizador') { 
    css += '#botoes-flutuantes-app > * {' + cssCorFundo + ';} ';
  } else {
    css += '#organizador > * {' + cssOpacidade + ';} ' 
  }
  return css;
} 

const cssNot = (selector, bool = true) => {
  if(bool) {
    return ':not(' + selector + ')';
  } else {
    return ''
  }
}

const getSelectors = elemento => {
  var selectors = '';
  if (elemento.id) {
    selectors += ('#' + elemento.id);
  } else {
    if (elemento.className) selectors += '.' + elemento.className.replace(/ (?=\w)/, '.').replace(/\s+$/, '');
  }
  return selectors;
}

class EtapaTutorial extends Component {
  
  constructor (props) {
    super(props);
    this.state = {item: {...props.itens[props.indice]}};
  }

  funcaoTimeout = tempo  => {
    clearTimeout(this.timeout);
    if(!this.timeout) setTimeout(() => {
      this.props.offset(1);
      this.timeout = null; 
    }, tempo || 0);
  }

  adicionarListener = evento => {
    this.removerListener();
    if (!evento || !evento.listener) return;
    this.tipoListener = evento.listener;
    if(evento.listener !== 'redux') {
      this.funcaoListener = e => {
        let alvo = document.getElementById(evento.alvo);
        console.log(evento.listener, !document.fullscreenElement)
        if( (
              evento.listener === 'click'
              && (!evento.alvo || e.target.id === evento.alvo || (alvo && alvo.contains(e.target)))
            ) 
            || (evento.listener = 'fullscreenchange' && !document.fullscreenElement)) {
          this.funcaoTimeout(evento.timeout);
          window.removeEventListener(this.tipoListener, this.funcaoListener);
        }
      }
      window.addEventListener(evento.listener, this.funcaoListener);
    } else {
      const getValorAtual = () => JSON.stringify(getObjectByStringPath(store.getState(), evento.alvo));
      this.valorAtual = getValorAtual();
      this.unsubscribe = store.subscribe(() => {
        if (evento.alvo) {
          var valorAntigo = this.valorAtual;
          this.valorAtual = getValorAtual();
        }
        if(!evento.alvo || valorAntigo !== this.valorAtual) 
          this.funcaoTimeout(evento.timeout);
      })
    }
  }

  removerListener = () => {
    window.removeEventListener(this.tipoListener, this.funcaoListener);
    if (this.unsubscribe) this.unsubscribe();
  }
  
  removerCss = () => {
    if (this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
  }

  funcaoResize = () => this.forceUpdate();

  componentDidMount = () => {
    if (this.state.indicehotkeys) hotkeys.setScope('tutorial');
    window.addEventListener('resize', this.funcaoResize);
    window.addEventListener('click', this.funcaoResize);
    window.addEventListener('keyup', this.funcaoResize);
    this.removerCss();
    this.adicionarListener(this.state.item.evento);
    var item = this.state.item;
    if (!item.texto) return;
    var elementos = document.querySelectorAll(item.selectorElemento);
    if (!elementos.length || this.props.display) return null;
    this.styleSheet = document.createElement("style");
    this.styleSheet.innerHTML = getCSSFade(elementos, item.selectorElemento);
    if (item.callbackAntes) item.callbackAntes();
    document.head.appendChild(this.styleSheet);
  }

  componentWillUnmount = () => {
    if (this.state.item.callbackDepois) this.state.item.callbackDepois();
    hotkeys.setScope('app');
    this.removerCss();
    window.removeEventListener('resize', this.funcaoResize);
    window.removeEventListener('click', this.funcaoResize);
    window.removeEventListener('keyup', this.funcaoResize);
    this.removerListener();
  }

  render() {
    if(!this.props.itens.length) return null;
    var item = this.state.item;
    var a = item.arrow;
    var caixa = (
      <div className='caixa-tutorial'>
        {item.texto}
      </div>
    )
    return (
      <>
        {a
          ? <Arrow posicao={a.posicao} 
                   selectorElemento={a.selectorElemento || item.selectorElemento} 
                   posicaoChildren={a.posicaoChildren}
                   distancia={a.distancia || '10'}
                   tamanhoIcone={window.innerHeight*0.23}
            >
              {caixa}
            </Arrow>
          : <div style={{position: 'absolute', top: item.coordenadas[0] + 'vh', left: item.coordenadas[1] + 'vw'}}>
              {caixa}
            </div>
        }
      </>
    )
  }
}

class Tutorial extends Component {

  constructor (props) {
    super(props);
    this.styleSheet = null;
    this.state = {indiceEtapa: -1, display: ''};

    hotkeys('backspace,enter,space,esc,left,right', 'tutorial', (e, handler) => {
      e.preventDefault();    
      var offset;
      switch (handler.key) {
        case 'left':
        case 'backspace':
          offset = -1;
          break;
        case 'right':
        case 'enter':
        case 'space':
          offset = 1;
          break;
        case 'esc':
          this.finalizar();
          return;
        default:
          return;
      }
      this.offsetEtapaTutorial(offset);
    });
  }

  getNovoIndice = (passo, indiceEtapa) => {
    var novoIndice = indiceEtapa + passo;
    return novoIndice >= this.props.itensTutorial.length 
           ? -1 
           : novoIndice;
  }

  offsetEtapaTutorial = passo => {
    var indice = this.state.indiceEtapa;
    if (indice + passo === -1) return;
    indice = this.getNovoIndice(passo, indice);
    if (indice === -1)
      this.props.dispatch({type: 'definir-item-tutorial', zerar: true});
    this.setState({indiceEtapa: indice});
  }

  static getDerivedStateFromProps = (props, state) => {
    if(props.itensTutorial.length > 0 && state.indiceEtapa === -1)
      return {indiceEtapa: 0, display: ''};
    return null;
  }

  finalizar = () => {
    this.setState({display: 'none'});
    for (var i = this.state.indiceEtapa; i < this.props.itensTutorial.length; i++) {
      setTimeout(() => this.offsetEtapaTutorial(1), 1)
    }
    setTimeout(() => this.props.dispatch({type: 'bloquear-tutoriais'}), 10);
  }

  temTutorialAtivo = (props = this.props) => !!props.itensTutorial.length; 

  render() {
    var ativo = this.temTutorialAtivo();
    return (
      <div id='fundo-tutorial' style={ativo ? {display: this.state.display} : {pointerEvents: 'none'}}>
        <EtapaTutorial key={this.props.itensTutorial.join(',') + this.state.indiceEtapa} 
                       itens={[...this.props.itensTutorial]} 
                       indice={this.state.indiceEtapa} offset={this.offsetEtapaTutorial} 
                       display={this.state.display}/>
        {ativo
          ? <>
              <button id='pular-tutorial' className='botao limpar-input' onClick={this.finalizar}>Não Exibir Tutoriais</button>
              <div id='rodape-tutorial'>
                <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(-1)}
                  style={this.state.indiceEtapa === 0 ? {visibility: 'hidden'} : null}>
                  Anterior
                </button>
                <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(1)}>
                  {(this.state.indiceEtapa === this.props.itensTutorial.length-1) ? 'Concluir' : 'Próximo'}
                </button>
              </div>
            </>
          : null  
        }
      </div>
    );
  }
}

const mapState = state => {
  var arrayTutorial = [];
  for (var i of state.itensTutorial) {
    arrayTutorial.push(listaBoxes[i].listaEtapas);
  }
  return {itensTutorial: arrayTutorial.flat()}
}

export default connect(mapState)(Tutorial);

