import React, { Component, Fragment } from 'react';
import Splash from './Splash';
import LoadingSplash from './LoadingSplash';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

export default function sobreporSplash (NomeKey, Componente, exigeUsuario = false, funcaoChecar = null, conferirLogin = false, paginaInteira = false, desativarNoMount = false) {
  
  class ComponenteMontado extends Component {
    componentDidMount = () => { 
      if(desativarNoMount) setTimeout(() => this.props.desativarSplash(), 1900);
    }
    render() {
      return <Componente {...this.props}/>
    }
  }
  
  const mapState = state => (
    {idUsuario: state.usuario.uid}
  )
  
  return (
    connect(mapState)(class extends Component {
      constructor(props) {
        super(props);
        this.state = { loading: true };
      }
      
      componentDidMount = () => {
        if (funcaoChecar) funcaoChecar();
      }
      
      render() {
        return (
          <Fragment key={NomeKey}>
            {/* {(this.state.loading || (this.props.idUsuario === undefined && conferirLogin))
                ? paginaInteira 
                      ? <Splash/> 
                      : <div className='fundo-splash-parcial' style={{backgroundColor: 'inherit', width: '100%', height: this.props.height}}>
                          <div className='fundo-splash-parcial' style={{backgroundColor: 'white', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '6vh'}}>
                            <LoadingSplash/>
                          </div>
                        </div>
                : null
            }
            {exigeUsuario && this.props.idUsuario === 0
              ? <Redirect to='/login'/> 
              : null
            } */}
            {!exigeUsuario || this.props.idUsuario
              ? <ComponenteMontado {...this.props} desativarSplash={() => {
                  if(this.state.loading) this.setState({loading: false})
                }}/>
              : null
            }
          </Fragment>
        )
      }  
    }
  ))
}