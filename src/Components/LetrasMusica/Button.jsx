import React, { Component } from 'react';

class Button extends Component {
    
    render () {
        if (this.props.visibility) {
            return (<button key={"test"}>Incluir Música</button>)
        } else {
            return null;
        }
    }
}

export default Button;