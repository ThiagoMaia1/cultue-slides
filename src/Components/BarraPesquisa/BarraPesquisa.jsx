import React from 'react';
import { connect } from 'react-redux';
import './BarraPesquisa.css';

class BarraPesquisa extends React.Component {

    constructor (props) {
        super(props);
        this.topOcultar = '-6vh';
        this.topExibir = '6vh';
        this.ref = React.createRef();
        this.state = {termoPesquisa: '', top: this.topOcultar, indiceResultadoSelecionado: 0, lenArray: 0};
    }
    
    onChange = e => {
        var termo = e.target.value;
        this.setState({termoPesquisa: termo})
        this.pesquisar(termo);
    }

    pesquisar = termo => {
        this.arrayResultados = [];
        var elementos = this.props.elementos;
        for (var i = 0; i < elementos.length; i++) {
            var slides = elementos[i].slides;
            for (var j = 0; j < slides.length; j++) {
                if (slides[j].eMestre) continue;
                var sel = (
                        this.contemTermo(elementos[i].titulo, termo) ||
                        this.contemTermo(slides[j].textoArray.join(' '), termo)
                    ) ? {elemento: i, slide: j} 
                      : null;
                if(sel) this.arrayResultados.push(sel);
            }
        }
        this.setState({lenArray: this.arrayResultados.length})
        if(this.arrayResultados.length > 0) this.definirSelecao(0);
    }

    contemTermo = (texto, termo) => {
        return texto.toLowerCase().match(termo.toLowerCase())
    }

    offsetResultado = passo => {
        var len = this.arrayResultados.length - 1;
        if (len < 0) return;
        var i = this.state.indiceResultadoSelecionado;
        var novoI = i + passo;
        if (novoI > len) {
            novoI = 0;
        } else if(novoI < 0) {
            novoI = len;
        }
        this.definirSelecao(novoI);
    }

    definirSelecao = indice => {
        this.setState({indiceResultadoSelecionado: indice});
        this.props.dispatch({type: 'definir-selecao', selecionado: this.arrayResultados[indice]})
    }

    componentDidUpdate = prevProps => {
        const ativado = this.props.searchAtivo;
        var novoState;
        if (ativado !== prevProps.searchAtivo) {
            if (ativado) {
                novoState = {top: this.topExibir};
                this.ref.current.focus();
            } else {
                this.arrayResultados = [];
                novoState = {top: this.topOcultar, termoPesquisa: '', lenArray: 0};
            }
            this.setState(novoState);
        }
        if (this.props.elementos.length !== prevProps.elementos.length && this.state.termoPesquisa)
            this.pesquisar(this.state.termoPesquisa);
    }

    render() {
        return (
            <div id='barra-pesquisa' style={{top: this.state.top}}>
                <div className='colapsar-menu pesquisa configurar' onClick={() => this.props.dispatch({type:'toggle-search'})}>◥</div>
                <div>
                    <input className='campo-pesquisa' value={this.state.termoPesquisa} onChange={this.onChange} type='text' ref={this.ref}/>
                    <button className='botao-azul botao' onClick={() => this.offsetResultado(-1)}>Anterior</button>
                    <button className='botao-azul botao' onClick={() => this.offsetResultado(1)}>Próximo</button> 
                </div>
                {this.state.termoPesquisa
                    ? this.state.lenArray > 0
                        ? <span>Resultado {this.state.indiceResultadoSelecionado + 1} de {this.state.lenArray}</span> 
                        : <span>Nenhum resultado encontrado</span>
                    : null
                }
            </div>
        );
    }
};

const mapState = state => (
    {elementos: state.present.elementos, searchAtivo: state.searchAtivo}
)
  
export default connect(mapState)(BarraPesquisa);
  