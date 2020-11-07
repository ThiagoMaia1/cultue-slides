import React from 'react';
import { connect } from 'react-redux';
import './Perfil.css';
import ApresentacoesUsuario from './ApresentacoesUsuario';

const paginasPerfil = [{nome: 'info-pessoal', nomeInterface: 'Informações Pessoais', componente: ApresentacoesUsuario},
                       {nome: 'apresentacoes', nomeInterface: 'Apresentações', componente: ApresentacoesUsuario},
                       {nome: 'predefinicoes', nomeInterface: 'Predefinições', componente: ApresentacoesUsuario},
                       {nome: 'emails', nomeInterface: 'E-mails', componente: ApresentacoesUsuario},
                       {nome: 'assinatura', nomeInterface: 'Assinatura', componente: ApresentacoesUsuario}

]

class Perfil extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {paginaAtiva: null}
    }

    render() {
        var PaginaAtiva = this.state.paginaAtiva;
        return (
            <div id='pagina-perfil'>
                <div id='barra-lateral-perfil'> 
                    <div id='menu-perfil'>
                        {paginasPerfil.map(p => 
                            <button key={p.nome} className={p.nome} onClick={() => this.setState({paginaAtiva: p.componente})}>
                                <span>{p.nomeInterface}</span>
                            </button>
                        )}
                    </div>
                </div>
                {this.state.paginaAtiva ? <PaginaAtiva/> : null}
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
  }

export default connect(mapStateToProps)(Perfil);
  