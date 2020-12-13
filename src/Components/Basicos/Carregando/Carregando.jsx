import React from 'react';

const CarregandoNoCanto = (props) => (
    <div style={{width:'100%', padding: '1.8vh 0.9vw', position: 'absolute', display: 'flex', justifyContent: 'flex-end'}}>
        {props.children}
    </div>
)

const CirculoCarregando = props => {
   var p = props.propsImagem;
   return <img src={require('./' + p.imagem)} alt={''} style={{transform: 'rotate(' + p.angulo + 'deg)', height: p.tamanho, width: p.tamanho, ...p.style}}/>
}

class Carregando extends React.Component {
  
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
        var propsImagem = {
            tamanho: this.tamanho, 
            angulo:this.state.angulo, 
            style: this.props.style, 
            imagem:this.imagem
        }
        if(this.props.noCanto) {
            return (
                <CarregandoNoCanto>
                    <CirculoCarregando propsImagem={propsImagem}/>
                </CarregandoNoCanto>
            )
        } else {
            return (
                <CirculoCarregando propsImagem={propsImagem}/>
            )
        }
    }
};
  
export default Carregando;