import React, { Component } from 'react';
import './MenuBotaoDireito.css';
import QuadroMenu from '../QuadroMenu/QuadroMenu';

const estiloQuadro = {
    padding: 0,
    zIndex: 800
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

    capturarCoordenadasMouse = e => {
        if (e.button === 2) {
            e = e.nativeEvent;
            if(this.state.aberto) {
                this.fechar();
                setTimeout(this.abrir, 5);
            }
            this.setState({posicao: {left: e.clientX + 'px', top: e.clientY + 'px'}});
        }
    }

    render() {
        return (
            <div onContextMenu={this.ativarMenu} onMouseUp={this.capturarCoordenadasMouse} >
                {this.props.children}
                {!this.state.aberto ? null
                    : <QuadroOpcoes opcoes={this.props.opcoes} callback={this.fechar} fecharPai={this.fechar} style={{...this.state.posicao, ...this.props.style}}/>
                }
            </div>
        )
    }
};

export function QuadroOpcoes ({opcoes, callback, fecharPai, style = {}}) {

    return (
        <QuadroMenu callback={callback} style={{position: 'fixed', ...estiloQuadro, ...style}}>
            {opcoes.map(o => 
                <OpcaoMenu opcao={o} key={o.rotulo} fecharPai={fecharPai}/>  
            )}
        </QuadroMenu>
    )
}

class OpcaoMenu extends Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {submenu: null}
    }

    stopMenu = e => {
        if (e.button === 2) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    clickOpcao = () => {
        let { submenu, callback } = this.props.opcao;
        if(submenu)
            this.setState({submenu: submenu});
        if(callback) {
            callback();
           if(this.props.fecharPai) this.props.fecharPai();
        }    
    }
    
    getPosicaoSubmenu = ref => {
        let {top, right} = ref.current.getBoundingClientRect();
        return {top: top + 'px', left: right + 6 + 'px'};
    }

    render () {
        let submenu = this.state.submenu;
        if (submenu) var ComponenteQuadro = submenu.opcoes 
                                            ? QuadroOpcoes
                                            : QuadroMenu
        return (
            <div className='opcao-menu-botao-direito' 
                 onClick={this.clickOpcao}
                 ref={this.ref}
                 onMouseUp={this.stopMenu}>
                 {this.props.opcao.rotulo}
                {!submenu ? null :
                    <ComponenteQuadro opcoes={submenu.opcoes} 
                                      callback={() => this.setState({submenu: null})} 
                                      fecharPai={this.props.fecharPai}
                                      style={{position: 'fixed', ...(submenu.opcoes ? estiloQuadro : {}), ...this.getPosicaoSubmenu(this.ref),
                                              ...submenu.style}}>
                        {submenu.children}
                    </ComponenteQuadro>
                }
            </div>
        )
    }
}

export default MenuBotaoDireito;