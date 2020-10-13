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
            <div style={{width:'94%', position: 'absolute'}}>
                <div style={{position: 'relative', padding: '10px 15px', float: 'right'}}>
                    <img src={require('./Carregando.png')} alt={''} style={{transform: 'rotate(' + this.state.angulo + 'deg)', height: '2vh', width: '2vh'}}/>
                </div>
            </div>
        )
    }
};
  
export default Carregando;