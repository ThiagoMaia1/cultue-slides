import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import store from '../../index';
import { getPreviews } from './Exportador';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

export const googleComSubstitutas = {
  Montserrat: 'Trebuchet MS',
  Source_Sans_Pro: 'Helvetica',
  Noto_Sans: 'Verdana',
  Amatic_SC: 'Garamond',
  Big_Shoulders_Stencil_Display: 'Trebuchet MS',
  Bree_Serif: 'Trebuchet MS',
  Cinzel: 'Times New Roman',
  Comfortaa: 'Helvetica',
  Dosis: 'Tahoma',
  Indie_Flower: 'Brush Script MT',
  Kanit: 'Tahoma',
  Lato: 'Tahoma',
  Libre_Baskerville: 'Bookman Old Style',
  Lobster: 'Brush Script MT',
  Major_Mono_Display: 'Lucida Console',
  Nunito: 'Trebuchet MS',
  Oswald: 'Impact',
  Pacifico: 'Brush Script MT',
  Poppins: 'Tahoma',
  PT_Sans: 'Tahoma',
  Texturina: 'Garamond',
  Abel: 'Helvetica',
  Abril_Fatface: 'Impact',
  Archivo_Narrow: 'Trebuchet MS',
  Audiowide: 'Lucida Console',
  Bangers: 'Impact',
  Bebas_Neue: 'Arial',
  Carter_One: 'Arial Black',
  Dancing_Script: 'Brush Script MT',
  Hanalei_Fill: 'Arial Black',
  Inconsolata: 'Lucida Console',
  JetBrains_Mono: 'Courier',
  Josefin_Slab: 'Garamond',
  Jura: 'Lucida Console',
  Nova_Flat: 'Trebuchet MS',
  Philosopher: 'Garamond',
  Quicksand: 'Trebuchet MS',
  Righteous: 'Impact',
  Roboto_Slab: 'Trebuchet MS',
  Saira: 'Lucida Console',
  Ubuntu_Condensed: 'Trebuchet MS',
  Varela_Round: 'Comic Sans MS',
}

export const fontes = {
  basicas: ['Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Trebuchet MS', 'Verdana', 'Bookman Old Style',
            'Tahoma', 'Arial Black', 'Georgia', 'Impact', 'Comic Sans MS', 'Garamond', 'Lucida Console', 'Brush Script MT'
  ], 
  google: Object.keys(googleComSubstitutas).map(f => f.replace(/_/g, ' '))
}

// Pegar no formato da lista do google fontes (+ no lugar de espaço e | como separador)
// console.log(Object.keys(googleComSubstitutas).slice(0, 21).filter(f => !/_/.test(f)).sort().join('|').replace(/_/g, '+'))

//Conferir lista de substitutas.
for (let k of Object.keys(googleComSubstitutas)) {
  if (!fontes.basicas.includes(googleComSubstitutas[k])) console.log(k + ' está com um nome de fonte substituta que não existe na lista.');
}

const keysFontes = Object.keys(fontes);

export const listarFontes = previews => {
  let todas = previews.reduce((resultado, p) => {
    let keys = ['texto', 'paragrafo', 'titulo'];
    for (let k of keys) {
      if (p.estilo[k].fontFamily) resultado.push(p.estilo[k].fontFamily);
    }
    return resultado;
  }, [])
  return [...new Set(todas)];
}

export const getFontesUsadas = previews => {
    let usadas = listarFontes(previews);
    return usadas.reduce((resultado, f) => {
      for (let k of keysFontes) {
        if(fontes[k].includes(f)) resultado[k].push(f);
      }  
      return resultado;  
    }, getResultadoInicial());
}

const getResultadoInicial = () => {
  return keysFontes.reduce((resultado, k) => {
    resultado[k] = [];
    return resultado;
  }, {})
}

export const getCssFontesBase64 = (copiaDOM, previews) => {
  let usadas = getFontesUsadas(previews);
  usadas.google.forEach(f => {
    let css = copiaDOM.createElement('style');
    css.type = 'text/css';
    try {
      css.innerHTML = require('./Fontes/FontesBase64/' + f + '.js').string;
    }
    catch {
      return;
    }
    copiaDOM.head.appendChild(css);
  })
  return copiaDOM;
}

export function getZipFontes(fontes, callback) {
  let zip = new JSZip();
  let contador = 0;
  for (let f of fontes) {
    let nomeArquivo = f + '.ttf';
    let arquivoFonte = require('./Fontes/FontesTTF/' + nomeArquivo);
    JSZipUtils.getBinaryContent(arquivoFonte, (error, data) => {
      if (error) throw error;
      zip.file(nomeArquivo, data, {binary: true});
      contador++;
      if (contador >= fontes.length)
        zip.generateAsync({ type: 'blob' })
          .then(callback);
    });
  }
}

export const substituirFontesGoogle = elementos => {
  let keys = ['texto', 'paragrafo', 'titulo'];
  for (let i = 0; i < elementos.length; i++) {
    let { slides } = elementos[i];
    for (let j = 0; j < slides.length; j++) {
      for (let k of keys) {
        let font = slides[j].estilo[k].fontFamily;
        if (font) {
          let fontFamily = googleComSubstitutas[font.replace(' ', '_')] || font;
          store.dispatch({
            type: 'editar-slide-temporariamente', 
            objeto: k, 
            valor: { fontFamily }, 
            selecionado: {elemento: i, slide: j},
            redividir: true
          });
        }
      }
    }
  }
  store.dispatch({type: 'fixar-novas-fontes'});
}  

export const perguntarAcaoFontesEspeciais = ({elementos, meio, callbackExecutar}) => {
  let previews = getPreviews(elementos);
  if(getFontesUsadas(previews).google.length) {
    let acao = 'Enviar';
    if (meio === 'download') acao = 'Baixar';
    ativarPopupConfirmacao(
      [
        {texto: acao + ' arquivo em HTML', parametroCallback: 1, classe: 'botao-longo-popup'},
        {texto: acao + ' arquivo zip com fontes', parametroCallback: 2, classe: 'neutro botao-longo-popup'},
        {texto: 'Substituir por fontes seguras', parametroCallback: 3, classe: 'botao-longo-popup neutro'},
        {texto: 'Cancelar', parametroCallback: 0, classe: 'neutro botao-longo-popup'}
      ],
      'Atenção!',
      'Sua apresentação contém fontes incomuns, que não são encontradas em qualquer computador.\n\n' + 
      'Recomendamos o download em HTML, pois nesse formato, o próprio arquivo da apresentação conterá as fontes utilizadas.\n\n' +
      'Se você preferir utilizar o PowerPoint, baixe o arquivo zip com as fontes para instalar na máquina a ser utilizada, ou ' +
      'substitua todas as fontes especiais utilizadas por fontes comuns.',
      opcao => {
        switch (opcao) {
          case 0:
            return;
          case 1: 
            document.getElementById('exportar-html').click();
            return;
          case 3:
            substituirFontesGoogle(elementos);
            break;
          default:
            break;
        }
        setTimeout(callbackExecutar, 100);
      }     
    )
  } 
  else callbackExecutar();
}

