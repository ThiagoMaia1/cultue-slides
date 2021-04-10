import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import './Perfil.css';
import ApresentacoesUsuario from './PaginasPerfil/ApresentacoesUsuario/ApresentacoesUsuario';
import ListaEmails from './PaginasPerfil/ListaEmails/ListaEmails';
import SetaVoltar from '../Basicos/SetaVoltar/SetaVoltar';
import Carrossel from '../Basicos/Carrossel/Carrossel';
import sobreporSplash from "../Basicos/Splash/SobreporSplash";
import InformacoesPessoais from './PaginasPerfil/InformacoesPessoais/InformacoesPessoais';
import store from '../../index';

const paginasPerfil = [
    {nome: 'info-pessoal', nomeInterface: 'Informações Pessoais', componente: InformacoesPessoais},
    {nome: 'apresentacoes', nomeInterface: 'Apresentações', componente: ApresentacoesUsuario},
    {nome: 'emails', nomeInterface: 'E-mails', componente: ListaEmails}
    // {nome: 'predefinicoes', nomeInterface: 'Predefinições', componente: ApresentacoesUsuario},
    //    {nome: 'assinatura', nomeInterface: 'Assinatura', componente: ApresentacoesUsuario},
    //    {nome: 'compartilhamento', nomeInterface: 'Compartilhamento', componente: ApresentacoesUsuario}
]

class Perfil extends React.Component {

    render() {
        var u = this.props.usuario;
        return (
            <Router>
                <div id='perfil'>
                    <div id='barra-lateral-perfil'>
                        <SetaVoltar title='Voltar ao App' callback={() => this.props.history.push('/main/#/' + store.getState().present.apresentacao.id)}
                                    tamanhoIcone={window.innerWidth*0.05}/>
                        <div id='menu-perfil'>
                            {paginasPerfil.map(p => 
                                <Link key={p.nome} to={this.props.match.path + '/' + p.nome}>{p.nomeInterface}</Link>
                            )}
                        </div>
                    </div>
                    <div id='organizador-perfil'>
                        <div id='cabecalho-perfil'>
                            <img className='foto-usuario grande' src={u.photoURL || require('./Usuário Padrão.png').default} alt='Foto Usuário'></img>
                            {u.nomeCompleto}
                        </div>
                        <Switch>
                            {paginasPerfil.map(p => {
                                var Pagina = sobreporSplash(p.nome, p.componente);
                                return (
                                    <Route exact path={this.props.match.path + '/' + p.nome} key={p}>
                                        <div className='pagina-perfil'>
                                            <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'100%'} 
                                                   beiradaFinal={20} style={{zIndex: '900', width: '100%'}}>
                                                <Pagina history={this.props.history} height='75vh'/>
                                            </Carrossel>
                                        </div>
                                    </Route>
                                );    
                            })}
                            <Route path={this.props.match.path} render={() => <Redirect to={this.props.match.path + '/' + paginasPerfil[0].nome}/>} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario};
  }

export default connect(mapState)(Perfil);
  