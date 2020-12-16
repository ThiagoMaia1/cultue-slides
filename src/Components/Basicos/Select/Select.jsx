import React, { Component } from 'react';

class Select extends Component {
  
    constructor (props) {
        super(props);
        this.state = {angulo: 0}
        this.proporcaoVelocidade = this.props.proporcaoVelocidade || 1;
        this.tamanho = this.props.tamanho + 'vh';
        this.imagem = (this.props.tamanho < 5) ? 'CarregandoPequeno.svg' : 'Carregando.svg';
    }

    componentDidMount() {
        this.idTimer = setInterval(() => this.rodar(), 10)
    }

    componentWillUnmount() {
        clearInterval(this.idTimer);
    }

    rodar() {
        var angulo = this.state.angulo + 5*this.proporcaoVelocidade;
        if (angulo > 360) angulo -= 360;
        this.setState({angulo: angulo})
    }

    render() {
        return (
            <div>
                {this.props.opcoes.map(op => {
                    let o = {};
                    if (typeof op === 'string') {
                        o.rotulo = op; 
                    } else if (typeof op === 'object') {
                        o = op;
                    }
                    return (
                        <div key={o.rotulo} className={'opcao-select ' + o.className || ''} style={o.style} onClick={o.onClick}>{o.rotulo}</div>
                    )
                })}
            </div>
        )
    }
};
  
export default Select;