import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import Fundo3D from '../Splash/Fundo3D';

class PaginaLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {splashAtivo: true, coordenadas: this.getCenter()};
    }

    onMouseMove = (e) => {
        var center = this.getCenter();
        var novasCoordenadas = [
            -(e.nativeEvent.clientX - center[0]), 
            -(e.nativeEvent.clientY - center[1])
        ];
        this.setState({coordenadas: novasCoordenadas});
    }

    getCenter = () => [window.innerWidth/2, window.innerHeight/2];

    render() {
        if (this.props.idUsuario) return <Redirect to='/app'/>
        return (
            <div onMouseMove={this.onMouseMove}>
                <div id='container-login' className='fundo-login'>
                    <div className='wraper-login' >
                        <div className='quadro-centralizado quadro-navbar'>
                            <Login history={this.props.history}/>
                        </div>
                        <div id='comece-usar' className='botao-azul' onClick={() => this.props.history.push('/app')}>
                            <div>Comece a Usar</div>
                        </div>
                    </div>
                </div>
                <Fundo3D coordenadas={this.state.coordenadas}/>
            </div>
        );
    }
};

const mapState = state => {
    return {idUsuario: state.usuario.uid}
}

export default connect(mapState)(PaginaLogin);