import React from 'react';

class QuadroNavbar extends React.Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {maxHeight: 0, maxWidth: 0, tiop: '-6vh', desmontando: false}
    }

    fecharQuadro = () => {
        this.setState({maxHeight: 0, maxWidth: 0, tiop: '-6vh'})
        setTimeout(() => this.props.callback(false), 100);
    }

    componentDidMount = () => {
        if (this.ref.current) this.ref.current.focus();
        this.setState({maxHeight: '100vh', maxWidth: '100vh', tiop: '6vh'})
    }
    render() {
        var estiloLado = this.props.esquerda ? {right: '0'} : {left: '0'}
        return (
            <div id='quadro-atalhos' className='quadro-navbar' style={{position: 'absolute', top: '6vh', ...estiloLado, ...this.state}}
                tabIndex='0' ref={this.ref} onKeyUp={this.fecharQuadro} onBlur={this.fecharQuadro}>
                {this.props.children}
            </div>
        );
    }
};

export default QuadroNavbar;
  