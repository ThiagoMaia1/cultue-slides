import React, { Component } from 'react';
import './ColorPicker.css';
import { hslToRgb, rgbToHsl, parseCorToRgb, arredonarParaMultiplo } from '../../../principais/FuncoesGerais';

class ColorPicker extends Component {

  constructor (props) {
    super(props);

    const eCinza = ({r, g, b}) => r === g && r === b;

    this.corAtual = this.props.corAtual ? parseCorToRgb(this.props.corAtual) : null;
    let h = !this.corAtual || eCinza(this.corAtual) ? undefined : arredonarParaMultiplo(rgbToHsl(this.corAtual).h, 25);
    this.state = {h};

    const getListaHue = () => {
      let cores = [];
      const pushar = h => cores.push({l: 50, s: 100, h});
      pushar(300);
      pushar(325);
      for (let h = 0; h <= 275; h += 25) {
        if  (h !== 125 && h!== 250) pushar(h);
      }
      return cores.map(this.criarObjetoCor);
    }

    this.listaHue = getListaHue();

    const getListaLightnessSaturation = () => {
      let cores = [];
      for (let l = 0; l <= 100; l += 20) {
        cores.push({s: 0, l})
      }
      for (let s = 20; s <= 100; s += 20) {
        for (let l = 20; l <= 85; l += 13) {
          cores.push({s, l})
        }
      }
      return cores;
    }

    this.listaLightnessSaturation = getListaLightnessSaturation();
  }

  criarObjetoCor = corHsl => {
    let cor = {};
    cor.hsl = corHsl;
    cor.rgb = hslToRgb(corHsl);
    return cor;
  }

  getListaLightnessSaturation = h => {
    return this.listaLightnessSaturation.reduce((resultado, c) => {
      let objCor = this.criarObjetoCor({...c, h});
      if(h === undefined) {
        if(resultado.map(cor => cor.rgb.r).includes(objCor.rgb.r)) {
          let s = objCor.rgb.r - 2;
          objCor.rgb = {r: s, g: s, b: s};
        }
      }
      resultado.push(objCor);
      return resultado;
    }, []);
  }
  
  getQuadradinhos = (arrayCores, onClick = null, onDoubleClick = null, hAtual = null) => {
    let jsxCores = [];
    let QuadradinhoCor = this.QuadradinhoCor;
    for (var c of arrayCores) {
      jsxCores.push(<QuadradinhoCor cor={c} onClick={onClick} onDoubleClick={onDoubleClick} hAtual={hAtual}/>);
    }
    return jsxCores;
  }

  QuadradinhoCor = ({cor, onClick = null, onDoubleClick = null, hAtual = null}) => {
    let { rgb, hsl: { l, h } } = cor;
    let {r, g, b} = rgb;
    let keys = ['r', 'g', 'b'];
    let eAtual = false;
    let eHue = hAtual !== null;
    if(eHue) {
      if(h === hAtual) eAtual = true;
    } else {
      eAtual = true;
      for (let k of keys) {
        eAtual = eAtual && rgb[k] === this.corAtual[k];
      }
    }
    let strRgb = `${r},${g},${b}`;
    return (
      <div key={strRgb}
           className={'quadradinho-cor ' + (eHue ? 'hue' : 'cor') + (eAtual ? ' cor-selecionada' : '')} 
           style={{
             backgroundColor: `rgb(${strRgb})`, 
             border: (l > 95 ? '1px solid lightgray' : '')}}
           onClick={() => {
             if(onClick) onClick(cor)
            }}
           onDoubleClick={() => {
             if(onDoubleClick) onDoubleClick(cor);
           }}
      />
    )
  }

  render() {
    return (
      <div className='color-picker'>
        <div className='bloco-cores hue'>
          {this.getQuadradinhos(this.listaHue, ({hsl: {h}}) => {
            this.setState({h: (h === this.state.h) ? undefined : h});
          },
            c => this.props.callback(c),
            this.state.h)}
        </div>
        <div className='bloco-cores lightness-saturation'>
          {this.getQuadradinhos(this.getListaLightnessSaturation(this.state.h), c => this.props.callback(c))}
        </div>
      </div>
    )
  }
}

export default ColorPicker;