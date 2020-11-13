import React from 'react';
import { connect } from 'react-redux';
import { getRegistrosUsuario } from '../../firestore/apiFirestore';
import ItemListaEmails, { colecaoEmails } from './ItemListaEmails';
  
class ListaEmails extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {emailsUsuario: null}
    }
    
    atualizarLista = async () => {
        var emails = await getRegistrosUsuario(this.props.usuario.uid, colecaoEmails);
        this.setState({emailsUsuario: emails});
    }

    componentDidMount = async () => {
        this.atualizarLista();
    }

    render() {
        return (
            <>
                {this.state.emailsUsuario 
                    ? this.state.emailsUsuario.map(e => 
                        <ItemListaEmails 
                            enderecoEmail={e.enderecoEmail}
                            nomeCompleto={e.nomeCompleto} 
                            eProprio={e.eProprio}
                            idEmail={e.id}
                            data={e.data}
                            callback={this.atualizarLista}/>)
                    : null}
                <ItemListaEmails callback={this.atualizarLista}/>
            </>
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario};
}

export default connect(mapState)(ListaEmails);
  