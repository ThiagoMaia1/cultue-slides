import React from 'react';
import { connect } from 'react-redux';
import './Propaganda.css';

class Propaganda extends React.Component {

    constructor (props) {
        super(props);
        this.state = {mensagem: [], segundos: 0};
    }

    componentDidUpdate = prevProps => {
        if (!prevProps.propagandaAtiva && this.props.propagandaAtiva) {
            this.setState({mensagem: ['Você pode pular esse anúncio em ', ' segundos. \n\n Ou clique no anúncio para remove-lo imediatamente.'], segundos: 10});
            this.intervalo = setInterval(() => {
                this.setState({segundos: this.state.segundos-1});
                if(this.state.segundos <= 0) {
                    this.setState({mensagem: ['Fechar anúncio']});
                    clearInterval(this.intervalo);
                }
            }, 1000);
        }
    }

    clickBotao = () => {
        if (this.state.segundos <= 0) this.fecharAnuncio();
    }

    fecharAnuncio = () => {
        this.props.dispatch({type: 'desativar-propaganda'});
    }

    clickImagem = () => {
        window.open('https://www.youtube.com/c/AlmirMarcolinoTavares');
        this.fecharAnuncio();
    }

    render() {
        if(!this.props.propagandaAtiva) return null;    
        return (
            <div id="fundo-propaganda">
                <img alt='Anúncio' src={require('./Oração nas Crises.png').default} onClick={this.clickImagem} onAuxClick={this.clickImagem}></img>
                <button id='pular-propaganda' onClick={this.clickBotao} style={!this.state.segundos ? {cursor: 'pointer'} : null}>{this.state.mensagem.join(this.state.segundos)}</button>
            </div>
        );
    }
};

const mapState = state => (
    {propagandaAtiva: state.propagandaAtiva}
)
 
export default connect(mapState)(Propaganda);
  