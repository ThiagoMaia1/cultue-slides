import React from 'react';
import { connect } from 'react-redux';
import { getApresentacoesUsuario, getElementosDesconvertidos } from '../Login/UsuarioBD';
import Preview from '../Preview/Preview';
import { getSlidePreview } from '../MenuExportacao/Exportador';
import './ApresentacoesUsuario.css';

class ApresentacoesUsuario extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {apresentacoes: null}
    }
    
    componentDidMount = async () => {
        var apresentacoes = await getApresentacoesUsuario(this.props.usuario.uid);
        console.log(apresentacoes);
        this.setState({apresentacoes: apresentacoes});
        console.log(apresentacoes)
    }

    selecionarApresentacao = apresentacao => {
        this.props.dispatch({
            type: 'definir-apresentacao', 
            elementos: getElementosDesconvertidos(apresentacao.elementos)
        });
    }

    render() {
        return (
            <div>
                {this.state.apresentacoes 
                    ? this.state.apresentacoes.map(a => 
                        <div className='item-lista-apresentacoes'>
                            <div className='previews-slides-elementos'>
                                {a.elementos.map((e, i) => {
                                    if (!e.eMestre) return null; 
                                    return (
                                        e.slides.map((s, j) => {
                                            if (!s.eMestre) return null; 
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
                            <div><span>Data Criação: </span><span>{a.dataCriacao}</span></div>
                            <div><span>Data Última Modificação: </span><span>{a.data}</span></div>
                            <button onClick={() => this.selecionarApresentacao(a)} className='botao-azul botao'>Selecionar</button>
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
  