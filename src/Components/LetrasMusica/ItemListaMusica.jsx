import React from 'react';
import './style.css';
import Carregando from './Carregando.jsx';

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

    // toggleCarregador (estado) {
    //     this.setState({carregando: estado ? <Carregando /> : null});
    // }

    render() {
        return (
            <div>
                {this.props.idBuscarLetra === this.props.musica.id ? <Carregando /> : null}
                <div key={this.props.musica.id} className='itens sombrear-selecao' onClick={() => {
                    this.props.buscarLetra(this.props.musica.id)}}>
                    <span className='titulo-musica'>{this.props.musica.title} - </span>
                    <span className='banda-musica'>{this.props.musica.band}</span>
                </div>
            </div>
        )
    }
};

// const ItemListaMusica = props => {

//     // componentDidUpdate(prevProps) {
//     //     if (this.props.idBuscarLetra !== prevProps.idBuscarLetra) {
//     //         this.setState({idBuscarLetra: this.props.idBuscarLetra})
//     //     }
//     //   }

//     return (
//         <div>
//             {props.idBuscarLetra === props.musica.id ? <Carregando /> : null}
//             <div key={props.musica.id} className='itens sombrear-selecao' onClick={() => props.buscarLetra(props.musica.id)}>
//                 <span className='titulo-musica'>{props.musica.title} - </span>
//                 <span className='banda-musica'>{props.musica.band}</span>
//             </div>
//         </div>
//     )

// };
  
  
export default ItemListaMusica;