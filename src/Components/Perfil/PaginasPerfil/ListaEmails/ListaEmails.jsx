import React from 'react';
import { connect } from 'react-redux';
import { getRegistrosUsuario } from '../../../../principais/firestore/apiFirestore';
import ItemListaEmails, { colecaoEmails } from './ItemListaEmails';
import './ListaEmails.css';
  
class ListaEmails extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {emailsUsuario: null}
    }
    
    atualizarLista = async () => {
        var emails = await getRegistrosUsuario(this.props.usuario.uid, colecaoEmails);
        this.setState({emailsUsuario: [...emails, {}]});
    }

    componentDidMount = async () => {
        this.atualizarLista();
    }

    componentDidUpdate() {
        if(this.state.emailsUsuario && this.props.desativarSplash) this.props.desativarSplash();
    }

    render() {
        var selecionar = this.props.selecionarEmail;
        return (
            <>
                {this.state.emailsUsuario 
                    ? this.state.emailsUsuario.map(e => (
                            <ItemListaEmails
                                objEmail={e}
                                key={e.id}
                                callback={this.atualizarLista}
                                selecionarEmail={selecionar}
                            />
                        )
                    )
                    : null}
            </>
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario};
}

export default connect(mapState)(ListaEmails);
  