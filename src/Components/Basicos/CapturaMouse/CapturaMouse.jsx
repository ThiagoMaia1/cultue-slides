import React from 'react';

class CapturaMouse extends React.Component {

    constructor(props) {
        super(props);
        this.deslocamento = [0, 0];
        this.coordenadasAntesDeSair = [...this.deslocamento];
        this.state = {splashAtivo: true, coordenadas: [0, 0]};
    }

    onMouseMove = e => {
        var center = this.getCenter();
        var novasCoordenadas = [
            -(e.nativeEvent.clientX - center[0] + this.deslocamento[0]), 
            -(e.nativeEvent.clientY - center[1] + this.deslocamento[1])
        ];
        this.setState({coordenadas: novasCoordenadas});
        this.props.callback(novasCoordenadas);
    }

    onMouseLeave = e => {
        this.coordenadasAntesDeSair = [e.nativeEvent.clientX, e.nativeEvent.clientY];
    }

    onMouseEnter = e => {
        this.deslocamento = [
            this.coordenadasAntesDeSair[0] - e.nativeEvent.clientX + this.deslocamento[0],
            this.coordenadasAntesDeSair[1] - e.nativeEvent.clientY + this.deslocamento[1]
        ];
    }
    
    getCenter = () => [window.innerWidth/2, window.innerHeight/2];

    getBase = () => [0, 0];

    componentDidMount = () => {
        this.setState({coordenadas: this.getCenter()});
    }

    render() {return (
            <div className='fundo-captura-mouse'
                 ref={this.ref}
                 onMouseMove={this.onMouseMove} 
                 onMouseLeave={this.onMouseLeave} 
                 onMouseEnter={this.onMouseEnter} 
                 onClick={() => this.deslocamento = [0, 0]}>
            </div>
        );
    }
};

export default CapturaMouse;