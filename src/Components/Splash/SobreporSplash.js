import React, { Component } from 'react';
import Splash from './Splash';
import LoadingSplash from './LoadingSplash';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

export default function sobreporSplash (Componente, exigeUsuario = false, funcaoChecar = null, conferirLogin = false, paginaInteira = false, desativarNoMount = false) {
  const mapState = state => (
    {idUsuario: state.usuario.uid}
  )
  return (
      connect(mapState)(class extends Component {
          constructor(props) {
            super(props);
            this.state = { loading: true };
          }
      
          componenteMontado = (props, desativarSplash) => (
            class extends Component {
              componentDidMount = () => { 
                if(desativarNoMount) desativarSplash();
              }
              render() {
                return <Componente {...props} desativarSplash={desativarSplash}/>
              }
            }
          )
      
          componentDidMount = () => {
            if (funcaoChecar) funcaoChecar();
          }
      
          render() {
              var ComponenteMontado = this.componenteMontado(this.props, () => (this.state.loading ? this.setState({loading: false}) : null));
              return (
                  <>
                      {(this.state.loading || (this.props.idUsuario === undefined && conferirLogin))
                          ? paginaInteira 
                                ? <Splash/> 
                                : <div className='fundo-splash-parcial' style={{backgroundColor: 'inherit', width: '100%'}}>
                                    <div className='fundo-splash-parcial' style={{backgroundColor: 'white', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '6vh'}}>
                                      <LoadingSplash/>
                                    </div>
                                  </div>
                          : null
                      }
                      {exigeUsuario && !this.props.idUsuario
                        ? <Redirect to='/login'/> 
                        : null
                      }
                      <ComponenteMontado/>
                  </>
              )
          }  
      }
  ))
}