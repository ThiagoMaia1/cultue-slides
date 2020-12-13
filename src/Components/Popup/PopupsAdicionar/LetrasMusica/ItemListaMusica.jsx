import React from 'react';
import './style.css';
import Carregando from '../../../Basicos/Carregando/Carregando.jsx';

class ItemListaMusica extends React.Component {
  
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
            <div className='item-lista-musica'>
                {this.props.idBuscarLetra === this.props.musica.id ? <Carregando tamanho={3} noCanto={true}/> : null}
                <button key={this.props.musica.id} className='itens' onClick={() => {
                    this.props.buscarLetra(this.props.musica.id)}}>
                    <b>{this.props.musica.title} - </b>{this.props.musica.band}
                </button>
            </div>
        )
    }
};
  
export default ItemListaMusica;

// const ItemListaMusica = props => {

//     // componentDidUpdate(prevProps) {
//     //     if (this.props.idBuscarLetra !== prevProps.idBuscarLetra) {
//     //         this.setState({idBuscarLetra: this.props.idBuscarLetra})
//     //     }
//     //   }

//     return (
//         <div>
//             {props.idBuscarLetra === props.musica.id ? <Carregando tamanho={3} noCanto={true}/> : null}
//             <div key={props.musica.id} className='itens sombrear-selecao' onClick={() => props.buscarLetra(props.musica.id)}>
//                 <span className='titulo-musica'>{props.musica.title} - </span>
//                 <span className='banda-musica'>{props.musica.band}</span>
//             </div>
//         </div>
//     )

// };
  