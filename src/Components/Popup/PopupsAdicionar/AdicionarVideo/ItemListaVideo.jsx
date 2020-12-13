import React from 'react';
// import './style.css';
import Carregando from '../../../Carregando/Carregando.jsx';

class ItemListaVideo extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {...props}
    }

    componentDidUpdate(prevProps) {
        if (this.props.idBuscarLetra !== prevProps.idBuscarLetra) {
            this.setState({idBuscarLetra: this.props.idBuscarLetra})
        }
      }

    render() {
        return (
            <div>
                {this.props.idBuscarLetra === this.props.musica.id ? <Carregando tamanho={3} noCanto={true}/> : null}
                <button key={this.props.musica.id} className='itens sombrear-selecao' onClick={() => {
                    this.props.buscarLetra(this.props.musica.id)}}>
                    <b>{this.props.musica.title} - </b>{this.props.musica.band}
                </button>
            </div>
        )
    }
};

export default ItemListaVideo;