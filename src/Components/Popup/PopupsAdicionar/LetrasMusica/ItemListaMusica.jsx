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

    onClick = () => {
        this.props.buscarLetra(this.props.musica.id, this.props.musica.title + ' - ' + this.props.musica.band)
    }

    render() {
        let eEssa = this.props.idBuscarLetra === this.props.musica.id;
        let carregando = this.props.buscandoLetra;
        return (
            <div className='item-lista-musica'>
                {eEssa && carregando
                    ? <Carregando tamanho={3} noCanto={true}/> 
                    : null
                }
                <div key={this.props.musica.id} className='itens' 
                        onClick={this.onClick} style={(eEssa && !carregando) ? {backgroundColor: 'var(--platinum-forte)'} : null}>
                    <b>{this.props.musica.title} - </b>{this.props.musica.band}
                    <div className='trecho-previa-musica' dangerouslySetInnerHTML={{ __html: this.props.musica.trecho}}/>
                </div>
            </div>
        )
    }
};
  
export default ItemListaMusica;