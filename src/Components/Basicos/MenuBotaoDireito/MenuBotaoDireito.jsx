import React, { Component } from 'react';
import './MenuBotaoDireito.css';
import QuadroMenu from '../QuadroMenu/QuadroMenu';
// import { objetosSaoIguais } from '../../../principais/FuncoesGerais';

const getPosicaoSubmenu = ref => {
    if (ref.current) {
        let {top, right} = ref.current.getBoundingClientRect();
        return {top: top + 'px', left: right + 'px'};
    }
    return {};
}

const estiloQuadro = {
    position: 'fixed',
    padding: 0,
    zIndex: 800,
}

class MenuBotaoDireito extends Component {
  
    constructor (props) {
        super(props);
        this.state = {aberto: false, submenu: null, posicao: {}};
    }

    abrir = () => this.setState({aberto: true});
    fechar = () => this.setState({aberto: false});

    ativarMenu = e => {
        e.preventDefault();
        this.abrir();
    }

    capturarPosicaoMouse = e => {
        switch (e.button) {
            case 0:
                if (this.state.aberto) setTimeout(this.fechar, 10);
                break;
            case 2: 
                e = e.nativeEvent;
                if(this.state.aberto) {
                    this.fechar();
                    setTimeout(this.abrir, 5);
                }
                this.setState({posicao: {left: e.clientX + 'px', top: e.clientY + 'px'}})
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <div onContextMenu={this.ativarMenu} onMouseUp={this.capturarPosicaoMouse} >
                {this.props.children}
                {!this.state.aberto ? null
                    : <QuadroOpcoes opcoes={this.props.opcoes} callback={this.fechar} style={{...estiloQuadro, ...this.state.posicao, ...this.props.style}}/>
                }
            </div>
        )
    }
};

export class QuadroOpcoes extends Component {

    constructor (props) {
        super(props);
        this.state = {submenu: null};
    }

    clickOpcao = o => {
        if(o.submenu)
            this.setState({submenu: o.submenu});
        if(o.callback) 
            o.callback();
    }

    stopMenu = e => {
        if (e.button === 2) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    render () {
        let submenu = this.state.submenu;
        if (submenu) var ComponenteQuadro = submenu.opcoes 
                                        ? QuadroOpcoes
                                        : QuadroMenu
        return (
            <QuadroMenu style={this.props.style} callback={this.props.callback}>
                {this.props.opcoes.map(o => {
                    let ref = React.createRef();
                    return (
                    <div className='opcao-menu-botao-direito' 
                         onClick={() => this.clickOpcao(o)}
                         ref={ref}
                         key={o.rotulo}
                         onMouseUp={this.stopMenu}>
                        {o.rotulo}
                        {!submenu ? null :
                            <ComponenteQuadro opcoes={submenu.opcoes} 
                                               callback={() => this.setState({opcoesSubmenu: null})} 
                                               style={{...estiloQuadro, ...getPosicaoSubmenu(ref)}}>
                                {o.submenu}
                            </ComponenteQuadro>
                        }
                    </div>
                )})}
            </QuadroMenu>
        )
    }
}

export default MenuBotaoDireito;