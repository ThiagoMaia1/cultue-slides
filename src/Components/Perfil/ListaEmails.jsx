import React from 'react';
import { connect } from 'react-redux';
// import firebase, { firestore } from '../../firebase';
  
class ListaEmails extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {apresentacoes: null}
    }
    
    // componentDidMount = async () => {
    //     var apresentacoes = await getApresentacoesUsuario(this.props.usuario.uid);
    //     this.setState({apresentacoes: apresentacoes});
    // }

    render() {
        return (
            <div>
                {this.state.apresentacoes 
                    ? this.state.apresentacoes.map(a => 
                        <div className='item-lista-apresentacoes'>
                            <div className='datas-apresentacao'>
                                <div><span>Data de Criação: </span><span>{a.dataCriacao}</span></div>
                                <div><span>Data de Modificação: </span><span>{a.data}</span></div>
                            </div>             
                            <button onClick={() => this.selecionarApresentacao(a)} className='botao-azul botao'>Selecionar</button>
                        </div>)
                    : null}
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(ListaEmails);
  