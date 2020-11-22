import React from 'react';
import { connect  } from 'react-redux';
import './InformacoesPessoais.css';
import { atualizarRegistro, getDocumentoUsuario } from '../../firestore/apiFirestore';

const InputTexto = props => {
  
  const onChange = e => {
    if(props.editaveis[props.campo] !== e.target.value) {
      var obj = {};
      obj[props.campo] = e.target.value;
      props.callback({camposEditaveis: {...props.editaveis, ...obj}, editado: true});
    }
  }

  var id = 'info-pessoal' + props.campo;
  return (
    <div>
      <label to={id}>{props.label}</label>
      <input id={id} type='text' 
            value={props.editaveis[props.campo]} 
            onChange={onChange}></input>
    </div>
  )
}

class InformacoesPessoais extends React.Component {
  
  constructor (props) {
    super(props);
    var u = props.usuario;
    this.campos = {nomeCompleto: 'Nome Completo', cargo: 'Cargo', email: 'E-mail'}
    this.keysCampos = Object.keys(this.campos);
    var camposEditaveis = this.keysCampos.reduce((resultado, k) => {
      resultado[k] = u[k] || '';
      return resultado;
    }, {})
    this.state = {editado: false, camposEditaveis: camposEditaveis}
  }

  componentDidMount = () => {
    if (this.props.desativarSplash) this.props.desativarSplash();
  }

  componentDidUpdate = () => {
    if (this.state.editado === false) return;
    for (var k of this.keysCampos) {
      if (this.props.usuario[k] !== this.state.camposEditaveis[k]) {
        return;
      }
    }
    this.setState({editado: false});
  }
  
  atualizarDadosUsuario = () => {
    const uid = this.props.usuario.uid;
    atualizarRegistro(this.state.camposEditaveis, 'usuários', uid);
    this.props.dispatch({type: 'login', usuario: getDocumentoUsuario(uid)})
  }

  render() {
    return (
      <div id='info-pessoal'>
        <div className='campos-editaveis'>
          {this.keysCampos.map(k => 
            <InputTexto key={k} callback={novoState => this.setState(novoState)} editaveis={this.state.camposEditaveis} campo={k} usuario={this.props.usuario} label={this.campos[k]}/>)
          }
        </div>
        <div className='linha-flex'>
          <button className='botao botao-azul' 
                  style={this.state.editado ? null : {visibility: 'hidden'}}
                  onClick={this.atualizarDadosUsuario}>Salvar Alterações</button>
        </div>
      </div>
    );
  }
};
  
const mapState = state => (
  {usuario: state.usuario}
)

export default connect(mapState)(InformacoesPessoais);
  