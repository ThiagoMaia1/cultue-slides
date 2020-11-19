import React from 'react';

const listaAtalhos = [{teclas: [['←'], ['↑']], acao: 'Slide anterior'},
                      {teclas: [['↑'], ['→']], acao: 'Próximo Slide'},
                      {teclas: ['Ctrl', 'Z'], acao: 'Desfazer última ação'},
                      {teclas: [['Ctrl', 'Y'], ['Ctrl', 'Shift', 'Z']], acao: 'Refazer ação desfeita'},
                      {teclas: ['Ctrl', 'L'], acao: 'Adicionar Texto Livre'},
                      {teclas: ['Ctrl', 'B'], acao: 'Adicionar Texto Bíblico'},
                      {teclas: ['Ctrl', 'M'], acao: 'Adicionar Música'},
                      {teclas: ['Ctrl', 'I'], acao: 'Adicionar Imagem'},
                      {teclas: ['Ctrl', 'D'], acao: 'Adicionar Vídeo'},
                      {teclas: ['Ctrl', 'O'], acao: 'Nova Apresentação'}
]

const getAtalhoSeparado = teclas => ( 
    teclas.map((t, i) => {
        return (
            <>
                <div className='tecla-atalho'>{t}</div> 
                {i === teclas.length-1 ? '' : <span>  +  </span>} 
            </>
        )
    })
)

class QuadroAtalhos extends React.Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
    }

    fecharQuadro = () => {
        this.props.callback(false);
    }

    componentDidMount = () => {
        if (this.ref.current) this.ref.current.focus();
    }

    render() {
        return (
            <>
                <div id='quadro-atalhos' className='quadro-navbar' style={{position: 'absolute', top: '6vh', left: '0'}}
                    tabIndex='0' ref={this.ref} onKeyUp={this.fecharQuadro} onBlur={this.fecharQuadro}>
                    {listaAtalhos.map(a => (
                        <div className='instrucao-atalho'>
                            <div>
                                {Array.isArray(a.teclas[0])
                                    ? <>{a.teclas.map((t, i) => (
                                            <>
                                                {getAtalhoSeparado(t)}
                                                {i === a.teclas.length-1 ? '' : <span>  ,  </span>}
                                            </>
                                        ))}
                                    </>
                                    : getAtalhoSeparado(a.teclas)                         
                                }
                            </div>
                            <div>{a.acao}</div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
};
  
export default QuadroAtalhos;
  