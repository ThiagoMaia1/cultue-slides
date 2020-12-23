import { fontes } from '../Configurar/ConfigurarSlides'; 

const keysFontes = Object.keys(fontes);

export const listarFontes = previews => {
  let todas = previews.reduce((resultado, p) => {
    let keys = ['texto', 'paragrafo', 'titulo'];
    for (let k of keys) {
      if (p[k]) resultado.push(p[k]);
    }
    return resultado;
  }, [])
  return [...new Set(todas)];
}

const getFontesUsadas = previews => {
    let usadas = listarFontes(previews);
    return usadas.reduce((resultado, f) => {
    for (let k of keysFontes) {
      if(fontes[k].includes(f)) resultado[k].push(f);
    }  
    }, getResultadoInicial());
}

const getFonteBase64 = fonte => {
    let fonteBase64 = Buffer.from(fonte).toDataUrl();
    return fonteBase64;
}

export default getCssFontesBase64 = previews => {
    let usadas = getFontesUsadas(previews);
    return usadas.map(f => f + ': url(' + getFonteBase64(f) + ');')
}

const getResultadoInicial = () => {
  return keysFontes.reduce((resultado, k) => {
    resultado[k] = [];
    return resultado;
  }, {})
}