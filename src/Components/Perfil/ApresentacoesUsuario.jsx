import React from 'react';
import { connect } from 'react-redux';
import { getApresentacoesUsuario, definirApresentacaoAtiva, definirApresentacaoPadrao, excluirApresentacao } from '../../firestore/apresentacoesBD';
import SlideFormatado from '../Preview/SlideFormatado';
import { getSlidePreview } from '../MenuExportacao/Exportador';
import './ApresentacoesUsuario.css';
import Carrossel from '../Carrossel/Carrossel';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

class ApresentacoesUsuario extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {apresentacoes: null}
        this.ref = React.createRef();
    }

    atualizarLista = async () => {
        var apresentacoes = await getApresentacoesUsuario(this.props.usuario.uid);
        this.setState({apresentacoes: apresentacoes});
    }

    componentDidMount = () => {
        this.atualizarLista();
    }

    componentDidUpdate() {
        if (this.props.desativarSplash && this.state.apresentacoes) {
            this.props.desativarSplash();
        }
    }

    selecionarApresentacao = apresentacao => {
        definirApresentacaoAtiva(this.props.usuario, apresentacao);
    }
    
    excluir = apresentacao => {
        ativarPopupConfirmacao(
            'simNao',
            'Atenção',
            'Deseja excluir a apresentação de ' + apresentacao.dataCriacao + '?',
            async fazer => {
                if(fazer) {
                    await excluirApresentacao(apresentacao.id);
                    this.atualizarLista();
                }            
            }
        )
    }
    render() {
        return (
            <>
                {this.state.apresentacoes 
                    ? this.state.apresentacoes.map(a => (
                            <div key={a.id} className='item-lista-perfil apresentacao'>
                                <div className='botao-quadradinho quadradinho-canto' onClick={() => this.excluir(a)}>✕</div>
                                <div className='dados-verticais-item-lista-perfil'>
                                    <div><span>Data de Criação: </span><span>{a.dataCriacao}</span></div>
                                    <div><span>Data de Modificação: </span><span>{a.data}</span></div>
                                </div>
                                <div className='container-carrossel-previews'>
                                    <Carrossel tamanhoIcone={20} tamanhoMaximo={'100%'} percentualBeirada={0.02} 
                                            style={{zIndex: '650', width: 'fit-content', overflow: 'hidden'}} corGradiente='var(--platinum)'>
                                        <div className='previews-slides-elementos' ref={this.ref}>
                                            {a.elementos.map((e, i) => (
                                                e.slides.map((s, j) => {
                                                    if (s.eMestre && i !==0) return null; 
                                                    return (
                                                        <div className='preview-fake'>
                                                            <SlideFormatado 
                                                                slidePreview={
                                                                    getSlidePreview({
                                                                        elementos: a.elementos, 
                                                                        selecionado: {elemento: i, slide: j}
                                                                    })
                                                                } 
                                                                editavel={false}
                                                                proporcao={0.08}
                                                                className='preview-fake'
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
                                    <button className='botao-azul botao'
                                            onClick={() => definirApresentacaoPadrao(this.props.usuario.uid, a.elementos)}>
                                        Definir como Padrão
                                    </button>
                                </div>
                            </div>    
                        )
                    )
                    : null}
            </>
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario};
}

export default connect(mapState)(ApresentacoesUsuario);
  