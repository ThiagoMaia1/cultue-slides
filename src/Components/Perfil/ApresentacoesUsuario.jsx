import React from 'react';
import { connect } from 'react-redux';
import { getApresentacoesUsuario, getElementosDesconvertidos } from '../Login/UsuarioBD';
import Preview from '../Preview/Preview';
import { getSlidePreview } from '../MenuExportacao/Exportador';
import './ApresentacoesUsuario.css';
import Carrossel from '../Carrossel/Carrossel';
// import MenuExportacao from '../MenuExportacao/MenuExportacao'

class ApresentacoesUsuario extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {apresentacoes: null}
        this.ref = React.createRef();
    }
    
    componentDidMount = async () => {
        var apresentacoes = await getApresentacoesUsuario(this.props.usuario.uid);
        this.setState({apresentacoes: apresentacoes});
    }

    selecionarApresentacao = apresentacao => {
        this.props.dispatch({
            type: 'definir-apresentacao', 
            elementos: getElementosDesconvertidos(apresentacao.elementos)
        });
        this.props.callback(false);
    }

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
                                <Carrossel tamanhoIcone={20} tamanhoMaximo={'20vw'} percentualBeirada={0.05} style={{height: '100%', zIndex: '650', width: 'fit-content'}} corGradiente='var(--platinum)'>
                                    <div className='previews-slides-elementos' ref={this.ref}>
                                        {a.elementos.map((e, i) => {
                                            if (e.eMestre) return null; 
                                            return (
                                                e.slides.map((s, j) => {
                                                    if (s.eMestre) return null; 
                                                    return (
                                                        <div className='preview-mini'>
                                                            <Preview 
                                                                slidePreviewFake={getSlidePreview({elementos: a.elementos, selecionado: {elemento: i, slide: j}})} 
                                                                mini={true}
                                                            />
                                                        </div>
                                                    );
                                                }));
                                        })}
                                    </div>
                                </Carrossel>                            
                            <button onClick={() => this.selecionarApresentacao(a)} className='botao-azul botao'>Selecionar</button>
                            {/* <MenuExportacao/> */}
                        </div>)
                    : null}
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(ApresentacoesUsuario);
  