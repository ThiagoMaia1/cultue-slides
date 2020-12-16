import React from 'react';
import { connect } from 'react-redux';
import { getApresentacoesUsuario, definirApresentacaoAtiva, definirApresentacaoPadrao, excluirApresentacao } from '../../../../principais/firestore/apresentacoesBD';
import SlideFormatado from '../../../Preview/SlideFormatado';
import { getSlidePreview } from '../../../MenuExportacao/Exportador';
import './ApresentacoesUsuario.css';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import { ativarPopupConfirmacao } from '../../../Popup/PopupConfirmacao';

class ApresentacoesUsuario extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {apresentacoes: null, idApresentacaoPadrao: props.usuario.idApresentacaoPadrao}
        this.ref = React.createRef();
    }

    componentDidMount = async () => {
        var apresentacoes = await getApresentacoesUsuario(this.props.usuario.uid);
        this.setState({apresentacoes});
        if (this.props.desativarSplash) this.props.desativarSplash();
    }

    selecionarApresentacao = apresentacao => {
        definirApresentacaoAtiva(this.props.usuario, apresentacao);
    }
    
    excluir = (apresentacao, indice) => {
        ativarPopupConfirmacao(
            'simNao',
            'Atenção',
            'Deseja excluir a apresentação de ' + apresentacao.dataCriacao + '?',
            async fazer => {
                if(fazer) {
                    await excluirApresentacao(apresentacao.id);
                    var apresentacoes = this.state.apresentacoes;
                    apresentacoes.splice(indice, 1);
                    this.setState({apresentacoes});
                }            
            }
        )
    }

    definirPadrao = idApresentacaoPadrao => {
        let callback = fazer => {
            if(fazer) this.setState({idApresentacaoPadrao});
        }
        definirApresentacaoPadrao(this.props.usuario.uid, idApresentacaoPadrao, 'selecionada', callback);
    }

    render() {
        return (
            !this.state.apresentacoes ? null
                : this.state.apresentacoes.map((a, i) => {
                    let ePadrao = a.id === this.state.idApresentacaoPadrao;
                    return (
                        <div key={a.id} className='item-lista-perfil apresentacao' style={ePadrao ? {backgroundColor: 'var(--azul-fraco)', height: '18vh'} : null}>
                            {!ePadrao ? null : <RotuloPadrao/>}
                            {ePadrao ? null : <div className='botao-quadradinho quadradinho-canto' onClick={() => this.excluir(a, i)}>✕</div>}
                            <div className='dados-verticais-item-lista-perfil'>
                                <div><span>Data de Criação: </span><span>{a.dataCriacao}</span></div>
                                <div><span>Data de Modificação: </span><span>{a.data}</span></div>
                            </div>
                            <div className='container-carrossel-previews'>
                                <Carrossel tamanhoIcone={20} tamanhoMaximo={'100%'} beiradaFinal={5} 
                                        style={{zIndex: '650', width: 'fit-content', overflow: 'hidden'}} corGradiente='var(--platinum)'
                                        wheelDesativada={true}>
                                    <div className='previews-slides-elementos' ref={this.ref}>
                                        {a.elementos.map((e, i) => (
                                            e.slides.map((s, j) => {
                                                if (s.eMestre && i !==0) return null; 
                                                return (
                                                    <div key={i+'.'+j}>
                                                        <SlideFormatado 
                                                            slidePreview={
                                                                getSlidePreview({
                                                                    elementos: a.elementos, 
                                                                    selecionado: {elemento: i, slide: j}
                                                                })
                                                            } 
                                                            editavel={false}
                                                            proporcao={0.08}
                                                            className='preview fake'
                                                        />
                                                    </div>
                                                );
                                            }))
                                        )}
                                    </div>
                                </Carrossel>
                            </div>
                            <div className='container-botoes-item-lista-perfil apresentacoes'>                            
                                <button onClick={() => this.selecionarApresentacao(a)} 
                                        className='botao-azul botao'>
                                    Selecionar
                                </button>
                                <button className='botao-azul botao' style={ePadrao ? {opacity: 0, pointerEvents: 'none'} : null}
                                        onClick={() => this.definirPadrao(a.id)}>
                                    Definir como Padrão
                                </button>
                            </div>
                        </div>    
                    )
                })
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario, idApresentacao: state.present.apresentacao.id};
}

export default connect(mapState)(ApresentacoesUsuario);
  
class RotuloPadrao extends React.Component {

    constructor (props) {
        super(props);
        this.state = {maxHeight: 0};
    }

    componentDidMount = () => {
        setTimeout(() => this.setState({maxHeight: '5vh'}), 0)
    }

    render () {    
        return <div className='rotulo-apresentacao-padrao' style={{maxHeight: this.state.maxHeight}}>
            Apresentação Padrão
        </div>
    }
}