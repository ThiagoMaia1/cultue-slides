import React from 'react';
import { connect } from 'react-redux';
import { getApresentacoesUsuario } from '../Login/UsuarioBD';
import Preview from '../Preview/Preview';

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
                    ? this.state.apresentacoes.map(a => 
                        <div className='item-lista-apresentacoes'>
                            <Preview></Preview>{a.dataFormatada}
                        </div>)
                    : null}
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(ApresentacoesUsuario);
  