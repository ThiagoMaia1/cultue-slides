import { fontes } from '../Configurar/ConfigurarSlides'; 

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

export default function getCssFontesBase64 (copiaDOM, previews) {
  let usadas = getFontesUsadas(previews);
  usadas.google.forEach(f => {
    let css = copiaDOM.createElement('style');
    css.type = 'text/css';
    try {
      css.innerHTML = require('./FontesBase64/' + f + '.js').string;
    }
    catch {
      return;
    }
    copiaDOM.head.appendChild(css);
  })
  return copiaDOM;
}