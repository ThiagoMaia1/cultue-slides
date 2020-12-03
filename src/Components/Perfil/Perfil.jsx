import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import './Perfil.css';
import ApresentacoesUsuario from './ApresentacoesUsuario';
import ListaEmails from './ListaEmails';
import { BsArrowLeft } from 'react-icons/bs'
import Carrossel from '../Carrossel/Carrossel';
import sobreporSplash from "../Splash/SobreporSplash";
import InformacoesPessoais from './InformacoesPessoais';

export const urlPerfil = '/perfil';

const paginasPerfil = [
    {nome: 'info-pessoal', nomeInterface: 'Informações Pessoais', componente: InformacoesPessoais},
    {nome: 'apresentacoes', nomeInterface: 'Apresentações', componente: ApresentacoesUsuario},
    {nome: 'predefinicoes', nomeInterface: 'Predefinições', componente: ApresentacoesUsuario},
    {nome: 'emails', nomeInterface: 'E-mails', componente: ListaEmails}
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
                        <div className='container-seta-voltar' title='Voltar ao App'>
                            <div id='seta-voltar' onClick={() => this.props.history.push('/app/#/' + this.props.apresentacao.id)}>
                                <BsArrowLeft size={window.innerWidth*0.06}/>
                            </div>
                        </div>
                        <div id='menu-perfil'>
                            {paginasPerfil.map(p => 
                                <Link key={p.nome} to={urlPerfil + '/' + p.nome}>{p.nomeInterface}</Link>
                            )}
                        </div>
                    </div>
                    <div id='organizador-perfil'>
                        <div id='cabecalho-perfil'>
                            <img className='foto-usuario grande' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                            {u.nomeCompleto}
                        </div>
                        <Switch>
                            {paginasPerfil.map(p => {
                                var Pagina = sobreporSplash(p.componente);
                                return (
                                    <Route exact path={urlPerfil + '/' + p.nome} key={p}>
                                        <div className='pagina-perfil'>
                                            <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'100%'} 
                                                   percentualBeirada={0.05} style={{zIndex: '900', width: '100%'}}>
                                                <Pagina history={this.props.history} height='75vh'/>
                                            </Carrossel>
                                        </div>
                                    </Route>
                                );    
                            })}
                            <Route path={urlPerfil} render={() => <Redirect to={urlPerfil + '/' + paginasPerfil[0].nome}/>} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario, apresentacao: state.present.apresentacao};
  }

export default connect(mapState)(Perfil);
  