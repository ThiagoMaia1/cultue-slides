import React from 'react';
import { connect } from 'react-redux';
import { getApresentacoesUsuario } from '../Login/UsuarioBD'

class ApresentacoesUsuario extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {apresentacoes: null}
    }
    
    componentDidMount = async () => {
        var apresentacoes = await getApresentacoesUsuario(this.props.usuario.uid);
        console.log(apresentacoes);
        this.setState({apresentacoes: apresentacoes});
        console.log(apresentacoes)
    }

    render() {
        return (
            <div>
                {this.state.apresentacoes 
                    ? this.state.apresentacoes.map(a => <div>{a.dataFormatada || 'Apresentação vazia'}</div>)
                    : null}
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(ApresentacoesUsuario);
  