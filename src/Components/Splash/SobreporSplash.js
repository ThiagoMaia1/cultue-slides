import React, { Component } from 'react';
import { store } from '../../index';
import Splash from './Splash';
import LoadingSplash from './LoadingSplash';
import { Redirect } from "react-router-dom";

export default function sobreporSplash (Componente, exigeUsuario = false, funcaoChecar = null, conferirLogin = false, paginaInteira = false, desativarNoMount = false) {
    return (
        class extends Component {
            constructor(props) {
              super(props);
              this.state = { signing: conferirLogin, loading: true };
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
              if (funcaoChecar) funcaoChecar(() => this.setState({signing: false}));
            }
        
            render() {
                var ComponenteMontado = this.componenteMontado(this.props, () => (this.state.loading ? this.setState({loading: false}) : null));
                return (
                    <>
                        {(this.state.loading || this.state.signing) 
                            ? paginaInteira 
                                  ? <Splash/> 
                                  : <div style={{backgroundColor: 'inherit', width: '100%', height: '80vh'}}>
                                      <div style={{backgroundColor: 'white', width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '12vh'}}>
                                        <LoadingSplash/>
                                      </div>
                                    </div>
                            : null
                        }
                        {exigeUsuario && this.state.signing === false && !store.getState().usuario.uid 
                          ? <Redirect to='/login'/> 
                          : null
                        }
                        <ComponenteMontado/>
                    </>
                )
            }  
        }
    )
}