import React from 'react';
import './TelaMensagem.css';
import LogoCultue from '../Basicos/Splash/LogoCultue';

class TelaMensagem extends React.Component {

    render() {
        return (
            <div id='tela-mensagem'>
                <LogoCultue animado={true}/>
                <div className='texto-mensagem'>{this.props.mensagem}</div>
                {this.props.children}
            </div>
        );
    }
};

export default TelaMensagem;
  