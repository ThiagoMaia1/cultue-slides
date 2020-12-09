import React from 'react';

class QuadroNavbar extends React.Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {maxHeight: 0, maxWidth: 0, desmontando: false}
    }

    fecharQuadro = () => {
        this.setState({maxHeight: 0, maxWidth: 0})
        setTimeout(() => this.props.callback(false), 100);
        document.removeEventListener("click", this.clickFora, false);
    }

    componentDidMount = () => {
        if (this.ref.current) this.ref.current.focus();
        this.setState({maxHeight: '100vh', maxWidth: '100vh'})
        document.addEventListener("click", this.clickFora, false);
    }

    clickFora = e => {
        if (!this.ref.current) return;
        if (!this.ref.current.contains(e.target)) {
            this.fecharQuadro();
        }
    }

    render() {
        var estiloLado = this.props.esquerda ? {right: '0'} : {left: '0'}
        return (
            <div id='quadro-atalhos' 
                 className='quadro-navbar' 
                 style={{position: 'absolute', top: '6vh', ...estiloLado, ...this.state, ...this.props.style}} 
                 onKeyUp={() => {if(this.props.onKeyUp) this.fecharQuadro()}}
                 tabIndex='0' ref={this.ref}>
                 {this.props.children}
            </div>
        );
    }
};

export default QuadroNavbar;
  