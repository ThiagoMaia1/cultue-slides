import React from 'react';
import Login from './Login';
import Splash from '../Splash/Splash';

class PaginaLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {splashAtivo: true};
    }

    render() {
        return (
            <>
                <div id='container-login' className='fundo-login'>
                    <div className='wraper-login' >
                        <div className='quadro-centralizado'>
                            <Login history={this.props.history} 
                                   desativarSplash={() => {
                                        this.setState({splashAtivo: false})
                                    }
                                }/>
                        </div>
                        <div id='comece-usar' className='botao-azul' onClick={() => this.props.history.push('/app')}>
                            <div>Comece a Usar</div>
                        </div>
                    </div>
                </div>
                {this.state.splashAtivo ? <Splash/> : null}
            </>
        );
    }
};

export default PaginaLogin;
  

