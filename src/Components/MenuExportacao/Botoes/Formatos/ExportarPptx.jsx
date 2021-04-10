import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from '../BotaoExportador';
import pptxgen from "pptxgenjs";
import { getFonteBase } from '../../../../principais/Element';
import { perguntarAcaoFontesEspeciais } from '../../ModulosFontes';
import { parseCorToRgb, rgbToHex, getInsetNum } from '../../../../principais/FuncoesGerais';

const parseCor = cor => rgbToHex(parseCorToRgb(cor));

class ExportarPptx extends Component {
    
  constructor (props) {
    super(props);
    this.formato = 'pptx';
    this.logo = (
      <div className='container-logo-pptx'>
        <img id='logo-pptx' className='logo-exportacao' src={require('../../Logos/Logo PowerPoint.svg').default} alt='Logo PowerPoint'/>
        <div id='exportar-pptx' className='botao-exportar'></div>
      </div>
    )
  }

  exportarPptx = (_copiaDOM, imagensBase64, previews, nomeArquivo) => {
    
    let imagens = imagensBase64.reduce((resultado, img) => {
      resultado[img.classe] = img.data.replace('data:','');
      return resultado;
    }, {});
    let pptx = new pptxgen();
    let {ratio} = this.props;
    pptx.defineLayout({name: 'LayoutTela', ...getDimensoesInches(ratio, false)});
    pptx.layout = 'LayoutTela';
    this.taxaPadTop = ratio.height/ratio.width;

    for (let p of previews) {
      let slide = pptx.addSlide();
      substituirPorcentagensPreview(p.estilo);
      slide.background = ({data: imagens[p.classeImagemFundo], ...getDimensoesInches(ratio)});
      this.inserirTampao(slide, pptx, p);
      this.inserirImagem(p, slide, imagens);
      if (!p.estilo.titulo.display) {
        let opcoesTitulo = {...getDimensaoTitulo(p.estilo.titulo), ...getAtributos(p.estilo.titulo)};
        slide.addText(p.titulo, opcoesTitulo);
      } 
      let separador = p.tipo === 'TextoBíblico' ? ' ' : '\n\n';
      let texto = p.textoArray.map(({texto}) => texto).join(separador);
      let opcoesTexto = {
        valign: p.estilo.titulo.abaixo ? 'bottom' : 'top', 
        ...getDimensaoTexto(p.estilo, this.taxaPadTop), 
        ...getAtributos(p.estilo.paragrafo)
      };
      slide.addText(texto, opcoesTexto);
    }
    return {nomeArquivo: nomeArquivo + this.formato, arquivo: pptx, formato: this.formato}
  }

  componentDidUpdate = prevProps => {
    if(!prevProps.formatoExportacao === this.formato && this.props.formatoExportacao === this.formato)
      this.props.definirFormatoExportacao(this.exportarPptx, this.formato);
  }

  componentDidMount = () => {
    if (this.props.formatoExportacao === this.formato)
      this.props.definirFormatoExportacao(this.exportarPptx, this.formato);
  }

  onClick = () => {
    let { elementos, meio } = this.props;
    perguntarAcaoFontesEspeciais({
      elementos,
      meio,
      callbackExecutar: () => this.props.definirFormatoExportacao(this.exportarPptx, this.formato)
    })
  }

  inserirTampao(slide, pptx, p) {
    slide.addShape(pptx.ShapeType.rect,
      {
        fill: {
          color: parseCor(p.estilo.tampao.backgroundColor).replace('#', ''),
          transparency: (1 - Number(p.estilo.tampao.opacityFundo)) * 100
        }, x: 0, y: 0, w: '100%', h: '100%'
      }
    );
  }

  inserirImagem(p, slide, imagens) {
    if (p.classeImagem)
      slide.addImage({
        data: imagens[p.classeImagem],
        sizing: { type: 'contain' },
        ...getDimensaoImagem(p.estilo.imagem)
      });
  }

  render() {
      return (
        <BotaoExportador formato={this.formato} onClick={this.onClick} 
          logo={this.logo} rotulo='PowerPoint'/>
      )
  }

}

function getDimensaoTitulo(titulo) {
  let x = titulo.paddingRight + '%';
  let y = titulo.abaixo ? 100 - titulo.height + '%': 0;
  let w = (100 - titulo.paddingRight*2) + '%';
  let h = titulo.height + '%';
  return {x, y, w, h, valign: 'center'};
}

function getDimensaoTexto(estilo, taxaPadTop) {
  let titulo = estilo.titulo;
  let alturaTitulo = titulo.display ? 0 : titulo.height;
  let paragrafo = estilo.paragrafo;
  let padTop = paragrafo.paddingTop*taxaPadTop;
  let x = paragrafo.paddingRight + '%';
  let y = (titulo.abaixo ? 0 : alturaTitulo + padTop) + '%';
  let w = (100 - paragrafo.paddingRight*2) + '%';
  let h = (100 - alturaTitulo - padTop) + '%';
  return {x, y, w, h, valign: 'top'};
}

function getDimensaoImagem(imagem) {
  let {left, top, bottom, right} = getInsetNum(imagem);
  let x = left + '%';
  let y = top + '%';
  let w = 100 - left - right + '%';
  let h = 100 - top - bottom + '%';
  return {x, y, w, h};
}

function getAtributos(objeto) {
  let atributos = Object.keys(objeto);
  let estilo = {};
  let novoAtributo;
  for (let i = 0; i < atributos.length; i++) {
    if(atributos[i] === 'lineHeight') {
      novoAtributo = converterAtributosPptx(atributos[i], objeto);
    } else {
      novoAtributo = converterAtributosPptx(atributos[i], objeto[atributos[i]]);
    }
    estilo = {...estilo, ...novoAtributo};
  }
  return {...estilo};
}

const correcaoPixels = 0.522694;
const atributosHtmlPptx = {textAlign: v => {
                            if (v === 'justify') v = 'left';
                            return {align: v}},
                           color: v => ({color: parseCor(v.replace('#', ''))}),
                           lineHeight: o => ({lineSpacing: Math.round(o.lineHeight*o.fontSize*correcaoPixels*getFonteBase().numero)/100}),
                           fontWeight: v => {if (v > 550) return{bold: true}},
                           fontStyle: v => {if (v === 'italic') return{italic: true}},
                           textDecorationLine: v => {if (v === 'underline') return {underline: true}},
                           fontFamily: v => ({fontFace: v}),
                           fontSize: v => ({fontSize: correcaoPixels*getFonteBase().numero*v/100})
}

function converterAtributosPptx(atributoHTML, valor) {
  let f = atributosHtmlPptx[atributoHTML];
  if (!!f) return f(valor);
}

function substituirPorcentagensPreview(estilo) {
  let keysEstilo = Object.keys(estilo);
  for (let i of keysEstilo) {
    let atributos = Object.keys(estilo[i]);
    for (let j of atributos) {
      let obj = {};
      if (/%/.test(estilo[i][j])) {
        obj[j] = Number(estilo[i][j].replace('%',''));
        estilo[i] = {...estilo[i], ...obj}; 
      }
    }
  }
}

const getDimensoesInches = (ratio, keysAbrev = true) => {
  // let divDpi = document.createElement('div');
  // divDpi.setAttribute('style', "height: 1in; width: 1in; left: 100%; position: fixed; top: 100%;");
  // document.body.appendChild(divDpi);
  // let dpi_x = divDpi.offsetWidth;
  // let dpi_y = divDpi.offsetHeight;
  // let width = ratio.width/dpi_x;
  // let height = ratio.height/dpi_y;
  let {height, width} = ratio;
  height = height/96;
  width = width/96;
  if (keysAbrev) return {w: width, h: height};
  return {width, height};
}

const mapState = state => (
  {
    ratio: state.present.ratio,
    elementos: state.present.elementos
  }
)

export default connect(mapState)(ExportarPptx);