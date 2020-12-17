import React from 'react';
import { connect } from 'react-redux';
import QuadroMenu from './QuadroMenu';

class QuadroExpress extends React.Component {

    constructor (props) {
        super(props);
        this.state = {listaTxt: ''};
    }

    enviarLista = () => {
        console.log('todo');
    }

    render() {
        return (
            <QuadroMenu callback={this.props.callback}>
                <div>Insira a lista de conteúdos da apresentação separada por ponto e vírgula e/ou quebra de linha:</div>
                <textarea className='combo-popup inserir-lista-express' 
                          placeholder={'Ex:\nLucas 2:1-5;\nJesus em tua presença;\nVisitantes: Sejam bem-vindos'}
                          value={this.state.listaTxt} 
                          onChange={e => this.setState({listaTxt: e.target.value})}/>
                <button className='botao' onClick={this.enviarLista}>Enviar</button>
            </QuadroMenu>
        );
    }
};
  
const mapState = state => (
    {autorizacao: state.present.apresentacao.autorizacao}
)

export default connect(mapState)(QuadroExpress);
  