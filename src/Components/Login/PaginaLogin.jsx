import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Fundo3D from '../Basicos/Splash/Fundo3D';
import useMousePosition from '../../principais/Hooks/useMousePosition';

const PaginaLogin = ({history, idUsuario}) => {

    let coordenadas = useMousePosition();

    if (idUsuario) return <Redirect to='/main'/>
    return (
        <div>
            <div id='container-login' className='fundo-login'>
                <div className='wraper-login' >
                    <div className='quadro-centralizado quadro-navbar'>
                        <Login history={history}/>
                    </div>
                    <div id='comece-usar' className='botao-azul' onClick={() => history.push('/main')}>
                        <div>Comece a Usar</div>
                    </div>
                </div>
            </div>
            <Fundo3D coordenadas={coordenadas}/>
        </div>
    );
};

const mapState = state => {
    return {idUsuario: state.usuario.uid}
}

export default connect(mapState)(PaginaLogin);