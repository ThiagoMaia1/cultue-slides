import React from 'react';
import { connect } from 'react-redux';
import './SelecionarRatio.css';
import { BsAspectRatio } from 'react-icons/bs';

const opcoesRatio = [{width: 1920, height: 1080}, {width: 1366, height: 768}, {width: 800, height: 600}]

class SelecionarRatio extends React.Component {

    constructor (props) {
        super(props);
        this.state = {estiloFundo: {height: 0, width: 0, minHeight: 0, minWidth: 0, color: 'black'}, opcoesVisiveis: false};
    }

    onMouseLeave = () => {
        this.setState({estiloFundo: {height: 0, width: 0, minHeight: 0, minWidth: 0, color: 'black', transform: 'none'}});
        this.setState({opcoesVisiveis: false});
    }

    onMouseOver = () => {
        if (!this.state.opcoesVisiveis)
            this.setState({estiloFundo: {height: '3.4vh', width: '2.8vw', minHeight: 0, minWidth: 0, color: 'white', transform: 'skewX(-5deg)'}});
    }

    onClick = () => {
        this.setState({estiloFundo: {minHeight: '10vh', minWidth: '9vh', color: 'white', transform: 'none'}, opcoesVisiveis: true});
    }

    selecionarRatio = ratio => {
        this.props.dispatch({type: 'selecionar-ratio-apresentacao', ratio: ratio})
        this.onMouseLeave();
    }

    render() {
        return (
            <div id='selecionar-aspect-ratio' onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                <div id='fundo-selecionar-aspect-ratio' style={{...this.state.estiloFundo}}>
                    {this.state.opcoesVisiveis 
                        ? opcoesRatio.map((o, i) => 
                                <div className='opcao-ratio' onClick={() => this.selecionarRatio(o)} key={o} 
                                     style={i === 0 ? {borderRadius: '1vh 0 0 0'} : null}>
                                    {o.width + 'x' + o.height}
                                </div>
                            )
                        : (this.state.estiloFundo.height 
                            ? <button onClick={this.onClick}>
                                <BsAspectRatio size={20}/>
                              </button> 
                            : null
                          )
                    }
                </div>
            </div>
        );
    }
};

const mapState = state => (
    {elementos: state.present.elementos, searchAtivo: state.searchAtivo}
)
  
export default connect(mapState)(SelecionarRatio);
  