import React from 'react';
import { connect } from 'react-redux';
import './Notificacoes.css';

class CardNotificacao extends React.Component {
    constructor (props) {
        super(props);
        this.state = {dateTime: this.props.dateTime, opacity: 1, maxHeight: 0};
    }

    componentDidMount() {
        if (this.state.opacity) 
            setTimeout(() => this.setState({opacity: 0, maxHeight: '100vh'}), 0);
    }

    render () {
        return (
            <div className='container-card-notificacao' style={{maxHeight: this.state.maxHeight, transition: 'max-height 2s linear'}}>
                <div style={{opacity: this.state.opacity, transition: 'opacity 0.2s linear 3s'}} className='card-notificacao'>{this.props.conteudo}</div>
            </div>
        )
    }
}

class Notificacoes extends React.Component {

  render() {
    return (
        <div id="painel-notificacoes">
            {this.props.notificacoes.map((n, i) => 
                <CardNotificacao key={n.dateTime} conteudo={n.conteudo} dateTime={n.dateTime}/>
            )}
        </div>
    );
  }
};
  
const mapState = state => (
    {notificacoes: state.notificacoes}
)

export default connect(mapState)(Notificacoes);
  