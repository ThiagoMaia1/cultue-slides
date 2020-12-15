import React from 'react';
import { connect  } from 'react-redux';
import './InformacoesPessoais.css';
import { atualizarRegistro, getDocumentoUsuario } from '../../../../principais/firestore/apiFirestore';
import SelectCargo from '../../../Login/SelectCargo';

const campos = {
  nomeCompleto: {label: 'Nome Completo'},
  email: {label: 'E-mail'}, 
  cargo: {label: 'Cargo', Input: SelectCargo}
}

const keysCampos = Object.keys(campos);

const Input = props => {
  
  const onChange = e => {
    if(props.editaveis[props.campo] !== e.target.value) {
      var obj = {};
      obj[props.campo] = e.target.value;
      props.callback({...props.editaveis, ...obj});
    }
  }
  
  var id = 'info-pessoal-' + props.campo;
  const ChildBasico = (props) => <input type='text' {...props}></input>;
  const Child = props.children || ChildBasico;

  return (
    <div>
      <label to={id}>{props.label}</label>
      <Child onChange={onChange} value={props.editaveis[props.campo]} id={id}/>
    </div>
  )
}


class InformacoesPessoais extends React.Component {
  
  constructor (props) {
    super(props);
    
    var camposEditaveis = keysCampos.reduce((resultado, k) => {
      resultado[k] = props.usuario[k] || '';
      return resultado;
    }, {})
    this.state = {editado: false, ...camposEditaveis}
  }

  componentDidMount = () => {
    if (this.props.desativarSplash) this.props.desativarSplash();
  }

  componentDidUpdate = (_p, prevState) => {
    if (JSON.stringify(this.getEditaveis()) === JSON.stringify(this.getEditaveis(prevState))) return;
    var editado = false;
    for (var k of keysCampos) {
      if (this.props.usuario[k] !== this.state[k]) {
        editado = true;
        break;
      }
    }
    this.setState({editado});
  }

  getEditaveis = (state = this.state) => {
    var editaveis = {};
    for (var k of keysCampos) {
      editaveis[k] = state[k];
    }
    return(editaveis);
  }
  
  atualizarDadosUsuario = () => {
    const uid = this.props.usuario.uid;
    atualizarRegistro(this.getEditaveis(), 'usuários', uid);
    this.props.dispatch({type: 'login', usuario: getDocumentoUsuario(uid)})
  }

  render() {
    return (
      <div id='info-pessoal'>
        <div className='campos-editaveis'>
          {keysCampos.map(k => 
            <Input key={k} callback={novoState => this.setState(novoState)} editaveis={this.getEditaveis()} campo={k} label={campos[k].label}>
              {campos[k].Input || null}
            </Input>
          )}
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
  