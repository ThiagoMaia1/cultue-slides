import React from 'react';

class QuadroNavbar extends React.Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {maxHeight: 0, maxWidth: 0, top: '-6vh', desmontando: false}
    }

    fecharQuadro = () => {
        this.setState({maxHeight: 0, maxWidth: 0, top: '-6vh'})
        setTimeout(() => this.props.callback(false), 100);
    }

    componentDidMount = () => {
        if (this.ref.current) this.ref.current.focus();
        this.setState({maxHeight: '100vh', maxWidth: '100vh', top: '6vh'})
    }
    render() {
        var estiloLado = this.props.esquerda ? {right: '0'} : {left: '0'}
        return (
            <div id='quadro-atalhos' className='quadro-navbar' style={{position: 'absolute', top: '6vh', ...estiloLado, ...this.state}} 
                 onKeyUp={() => {if(this.props.onKeyUp) this.fecharQuadro()}}
                //  onBlur={() => {if(this.props.onBlur) this.fecharQuadro()}}
                 tabIndex='0' ref={this.ref}>
                 {this.props.children}
            </div>
        );
    }
};

export default QuadroNavbar;
  