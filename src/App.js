import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Preview/Galeria/Galeria'
import Configurar from './Components/Configurar/Configurar.jsx';
import MenuExportacao from './Components/MenuExportacao/MenuExportacao';
import NavBar from './Components/NavBar/NavBar';
import Tutorial from './Components/Tutorial/Tutorial';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {tutorial: true}
  }

  render() {
    return (
      <div className="App">
        {this.state.tutorial ? <Tutorial concluirTutorial={() => this.setState({tutorial: false})}/> : null }
        <NavBar history={this.props.history}/> 
        <div id='organizador'>
          <Arrastar />
          <Preview />
          <Configurar />
        </div>
        <Galeria id='galeria'/>
        <MenuExportacao />
      </div>
    );
  }
}

const mapState = state => (
  {apresentacao: state.present.apresentacao}
)

export default connect(mapState)(App);
