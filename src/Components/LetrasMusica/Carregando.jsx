import React from 'react';

class Carregando extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {...props, angulo: 0}
    }

    componentDidMount() {
        this.idTimer = setInterval(() => this.rodar(), 10)
    }

    componentWillUnmount() {
        clearInterval(this.idTimer);
    }

    rodar() {
        this.setState({angulo: this.state.angulo + 10})
    }

  render() {
        return (
            <div style={{width:'100%', padding: '1.7% 2%', position: 'absolute', display: 'flex', justifyContent: 'flex-end'}}>
                <img src={require('./Carregando.svg')} alt={''} style={{transform: 'rotate(' + this.state.angulo + 'deg)', height: '3vh', width: '3vh', ...this.props.style}}/>
            </div>
        )
    }
};
  
export default Carregando;