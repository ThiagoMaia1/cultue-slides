
class ImagemInput extends Component {
    
    constructor (props) {
        super(props);
        this.background = this.getBackground(props.img, props.indice + 1 === props.nFiles);
        this.state = {maxWidth: '0', xVisivel: true};
    }

    getBackground = (img, finalizar) => {
        var bG = {};
        if (img.width) {
            bG.backgroundImage = 'url(' + getImgBase64(img, 300, 200) + ')';
            bG.backgroundPosition = 'center';
            bG.backgroundRepeat = 'no-repeat';
            bG.backgroundSize = 'cover';
        } else {
            bG.backgroundColor = 'var(--vermelho-fraco)';
        }
        if (finalizar) document.body.style.cursor = 'default';
        return bG;
    }

    componentDidMount = () => {
        setTimeout(() => this.setState({maxWidth: '12vw'}), 0);
        this.props.setFinalCarrossel();
        setTimeout(() => this.props.setFinalCarrossel(), 300);
    }

    apagar = e => {
        e.stopPropagation();
        this.setState({maxWidth: 0, xVisivel: false});
        setTimeout(() => this.props.callback(this.props.indice), 300);
    }

    render() {
        let {img} = this.props;
        let alt = img.alt + (img.contador ? '-' + img.contador : '');
        return (
            <div className='container-imagem-upload' key={alt}>
                <div className='imagem-invalida previa-imagem-upload' 
                     style={{...this.background, ...this.state}}>
                    {img.width 
                        ? null
                        : <> 
                            <div style={{textAlign: 'center'}}>Arquivo Inválido:<br></br>"{img.nomeComExtensao}"<br></br></div>
                            <div style={{fontSize: '120%'}}>✕</div>
                          </>
                    }
                </div>
                <button className='x-apagar-imagem' style={{display: this.state.xVisivel ? '' : 'none'}} 
                        onClick={this.apagar}>✕</button>
            </div>
        )
    }
}
