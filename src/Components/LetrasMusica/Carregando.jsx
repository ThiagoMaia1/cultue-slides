import React from 'react';
import './style.css';

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
            <div style={{width:'96%', position: 'absolute', boxSizing: 'border-box'}}>
                <div style={{transform: 'rotate(' + this.state.angulo + 'deg)', position: 'relative', padding: '6px 15px', float: 'right'}}>
                    <span role='img' style={{fontSize: '22px', fontWeight: '600', color: '#999999'}}>↻</span>
                </div>
            </div>
        )
    }
};
  
export default Carregando;