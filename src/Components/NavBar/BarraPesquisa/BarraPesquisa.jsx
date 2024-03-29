import React from 'react';
import { connect } from 'react-redux';
import './BarraPesquisa.css';

const htmlHighlight = ['<span class="highlight">', '</span>'];
// export const limparHighlights = (texto) => texto.replaceAll(htmlHighlight[0],'').replaceAll(htmlHighlight[1], '')

class BarraPesquisa extends React.Component {

    constructor (props) {
        super(props);
        this.topOcultar = '-6vh';
        this.topExibir = '6vh';
        this.ref = React.createRef();
        this.state = {termoPesquisa: '', top: this.topOcultar, indiceResultadoSelecionado: 0, lenArray: 0};
    }
    
    onChange = e => {
        let termo = e.target.value;
        this.setState({termoPesquisa: termo})
        this.pesquisar(termo);
    }

    pesquisar = termo => {
        this.arrayResultados = [];
        let elementos = this.props.elementos;
        for (let i = 0; i < elementos.length; i++) {
            let slides = elementos[i].slides;
            for (let j = 0; j < slides.length; j++) {
                if (slides[j].eMestre) continue;
                let estrofes = [elementos[i].titulo, ...slides[j].textoArray.map(t => t.texto)];
                for (let k = 0; k < estrofes.length; k++) {
                    let sel = this.contemTermo(estrofes[k], termo)
                              ? {elemento: i, slide: j, estrofe: k} 
                              : null;
                    if(sel) this.arrayResultados.push(sel);
                }
            }
        }
        this.setState({lenArray: this.arrayResultados.length})
        if(this.arrayResultados.length > 0) this.definirSelecao(0);
    }

    contemTermo = (texto, termo) => {
        return texto.toLowerCase().match(termo.toLowerCase())
    }

    offsetResultado = passo => {
        let len = this.arrayResultados.length - 1;
        if (len < 0) return;
        let i = this.state.indiceResultadoSelecionado;
        let novoI = i + passo;
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
        this.timeoutHighlight();
    }

    timeoutHighlight = () => setTimeout(this.highlightSlides, 0);

    highlightSlides = () => {
        let spansConteudo = document.querySelectorAll('#borda-slide-mestre #textoTitulo, #borda-slide-mestre .estrofe-editavel');
        const classeMarcada = 'estrofe-marcada';
        let marcadoAnterior = document.getElementsByClassName(classeMarcada)[0];
        if(marcadoAnterior) marcadoAnterior.classList.remove(classeMarcada);
        let sel = this.arrayResultados[this.state.indiceResultadoSelecionado] || {};
        if (sel.estrofe !== undefined) {
            let idElemento = sel.estrofe === 0 
                             ? 'textoTitulo' 
                             : 'textoArray-' + (sel.estrofe - 1);
            let elemento = document.getElementById(idElemento)
            if (elemento) elemento.classList.add(classeMarcada);
        }
        for (let s of spansConteudo) {
            let reg = new RegExp('(' + this.state.termoPesquisa + ')', 'gi');
            s.innerHTML = s.innerText;
            s.innerHTML = s.innerHTML.replace(reg, resultado => htmlHighlight.join(resultado));
        }
    }

    componentDidUpdate = prevProps => {
        const ativado = this.props.searchAtivo;
        let novoState;
        if (ativado !== prevProps.searchAtivo) {
            if (ativado) {
                novoState = {top: this.topExibir};
                this.ref.current.focus();
            } else {
                this.arrayResultados = [];
                novoState = {top: this.topOcultar, termoPesquisa: '', lenArray: 0};
                this.ref.current.nextSibling.focus();
            }
            this.setState(novoState);
            if(!ativado) this.timeoutHighlight();
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

const mapState = state => ({
    elementos: state.present.elementos, 
    searchAtivo: state.searchAtivo
})
  
export default connect(mapState)(BarraPesquisa);
  