import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import './Perfil.css';
import ApresentacoesUsuario from './ApresentacoesUsuario';
import ListaEmails from './ListaEmails';

export const urlPerfil = '/perfil';

const paginasPerfil = [{nome: 'info-pessoal', nomeInterface: 'Informações Pessoais', componente: ApresentacoesUsuario},
                       {nome: 'apresentacoes', nomeInterface: 'Apresentações', componente: ApresentacoesUsuario},
                       {nome: 'predefinicoes', nomeInterface: 'Predefinições', componente: ApresentacoesUsuario},
                       {nome: 'emails', nomeInterface: 'E-mails', componente: ListaEmails},
                       {nome: 'assinatura', nomeInterface: 'Assinatura', componente: ApresentacoesUsuario}

]

class Perfil extends React.Component {
  
    constructor (props) {
        super(props);
    }

    render() {
        var u = this.props.usuario;
        return (
            <div id='pagina-perfil'>
                <div id='cabecalho-perfil'>
                    <img className='foto-usuario grande' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                    {u.nomeCompleto}
                </div>
                <Router>
                    <div id='organizador-perfil'>
                        <div id='barra-lateral-perfil'>
                            <div id='menu-perfil'>
                                {paginasPerfil.map(p => 
                                    <Link key={p.nome} to={urlPerfil + '/' + p.nome}>{p.nomeInterface}</Link>
                                )}
                            </div>
                        </div>
                        <Switch>
                            {paginasPerfil.map(p => {
                                var Pagina = p.componente;
                                return (
                                    <Route path={urlPerfil + '/' + p.nome}>
                                        <Pagina callback={this.props.callback}/>
                                    </Route>
                                );    
                            })}
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
  }

export default connect(mapStateToProps)(Perfil);
  