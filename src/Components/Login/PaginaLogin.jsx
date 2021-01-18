import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Fundo3D from '../Basicos/Splash/Fundo3D';

class PaginaLogin extends React.Component {

    constructor(props) {
        super(props);
        this.deslocamento = [0, 0];
        this.coordenadasAntesDeSair = [...this.deslocamento];
        this.state = {splashAtivo: true, coordenadas: this.getCenter()};
    }

    onMouseMove = e => {
        var center = this.getCenter();
        var novasCoordenadas = [
            -(e.nativeEvent.clientX - center[0] + this.deslocamento[0]), 
            -(e.nativeEvent.clientY - center[1] + this.deslocamento[1])
        ];
        this.setState({coordenadas: novasCoordenadas});
    }

    onMouseLeave = e => {
        this.coordenadasAntesDeSair = [e.nativeEvent.clientX, e.nativeEvent.clientY];
    }

    onMouseEnter = e => {
        this.deslocamento = [
            this.coordenadasAntesDeSair[0] - e.nativeEvent.clientX + this.deslocamento[0],
            this.coordenadasAntesDeSair[1] - e.nativeEvent.clientY + this.deslocamento[1]
        ];
    }

    getCenter = () => [window.innerWidth/2, window.innerHeight/2];

    getBase = () => [0, 0];

    render() {
        if (this.props.idUsuario) return <Redirect to='/main'/>
        return (
            <div onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} onClick={() => this.deslocamento = [0, 0]}>
                <div id='container-login' className='fundo-login'>
                    <div className='wraper-login' >
                        <div className='quadro-centralizado quadro-navbar'>
                            <Login history={this.props.history}/>
                        </div>
                        <div id='comece-usar' className='botao-azul' onClick={() => this.props.history.push('/main')}>
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