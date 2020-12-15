import React from 'react';
import { connect  } from 'react-redux';
import './InformacoesPessoais.css';
import { atualizarRegistro, getDocumentoUsuario } from '../../../../principais/firestore/apiFirestore';
import { objetosSaoIguais } from '../../../../principais/FuncoesGerais';
import SelectCargo from '../../../Login/SelectCargo';
import RadioTipoPadrao from './RadioTipoPadrao';
import SelectNumero from './SelectNumero';

const campos = {
  nomeCompleto: {label: 'Nome Completo'},
  email: {label: 'E-mail'}, 
  cargo: {label: 'Cargo', Input: SelectCargo},
  tipoApresentacaoPadrao: {label: 'Apresentação padrão deve utilizar: ', Input: RadioTipoPadrao},
  frequentadores: {label: 'Qual o número médio aproximado de frequentadores dos cultos em que você utiliza as apresentações?', Input: SelectNumero}
}

const keysCampos = Object.keys(campos);

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.id = 'info-pessoal-' + props.campo;
    this.ChildBasico = (props) => <input type='text' {...props}></input>;
  }

  onChange = e => {
    if(this.props.editaveis[this.props.campo] !== e.target.value) {
      var obj = {};
      obj[this.props.campo] = e.target.value;
      this.props.callback({...this.props.editaveis, ...obj});
    }
  }

  render () {
    let Child = this.props.children || this.ChildBasico;
    return (
      <div>
        <label to={this.id}>{this.props.label}</label>
        <Child onChange={this.onChange} value={this.props.editaveis[this.props.campo]} id={this.id}/>
      </div>
    )
  }
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
    if (objetosSaoIguais(this.getEditaveis(), this.getEditaveis(prevState))) return;
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
  
  atualizarDadosUsuario = async () => {
    const uid = this.props.usuario.uid;
    atualizarRegistro(this.getEditaveis(), 'usuários', uid);
    var usuario = await getDocumentoUsuario(uid);
    this.props.dispatch({type: 'login', usuario})
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
  