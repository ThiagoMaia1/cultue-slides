import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

class PaginaLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {splashAtivo: true};
    }

    render() {
        if (this.props.idUsuario) return <Redirect to='/app'/>
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

const mapState = state => {
    return {idUsuario: state.usuario.uid}
}

export default connect(mapState)(PaginaLogin);
  

