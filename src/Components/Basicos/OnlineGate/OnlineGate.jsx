import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../../index';
import './OnlineGate.css';

const OnlineGate = ({children}) => {

    useEffect(() => {
        const despachar = () => store.dispatch({type: 'alterar-status-online'});
        const modoOffline = () => despachar(true);
        const modoOnline = () => despachar(false);
        
        window.addEventListener('online', modoOnline);
        window.addEventListener('offline', modoOffline);
        
        return (() => {
            window.removeEventListener('online', modoOnline);
            window.removeEventListener('offline', modoOffline);
        })
    }, [])

    return (
        <div className={window.navigator.onLine ? '' : 'offline'}>
            <div id='tampao-offline'></div>
            {children}
        </div>
    )
}

const mapState = state => ({
    popupConfirmacao: state.popupConfirmacao
});

export default connect(mapState)(OnlineGate);