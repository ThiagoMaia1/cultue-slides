import React from 'react';
import Login from './Login';

class PaginaLogin extends React.Component {

    render() {
        return (
            <div id='container-login' className='fundo-login'>
                <div className='wraper-login' >
                    <div className='quadro-centralizado'>
                        <Login history={this.props.history}/>
                    </div>
                    <div id='comece-usar' className='botao-azul' onClick={() => this.props.history.push('/app')}>
                        <div>Comece a Usar</div>
                    </div>
                </div>
            </div>
        );
    }
};

export default PaginaLogin;
  

