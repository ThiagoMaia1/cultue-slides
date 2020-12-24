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
  Indie_Flower: 'Comic Sans MS',
  Kanit: 'Tahoma',
  Lato: 'Tahoma',
  Libre_Baskerville: 'Times New Roman',
  Lobster: 'Comic Sans MS',
  Major_Mono_Display: 'Lucida Console',
  Nunito: 'Trebuchet MS',
  Oswald: 'Impact',
  Pacifico: 'Comic Sans MS',
  Poppins: 'Tahoma',
  PT_Sans: 'Tahoma',
  Texturina: 'Garamond'
}

export const fontes = {
  basicas: ['Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Trebuchet MS', 'Verdana', 
            'Tahoma', 'Arial Black', 'Georgia', 'Impact', 'Comic Sans MS', 'Garamond', 'Lucida Console'
  ], 
  google: Object.keys(googleComSubstitutas).map(f => f.replace(/_/g, ' '))
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
      css.innerHTML = require('./FontesBase64/' + f + '.js').string;
    }
    catch {
      return;
    }
    copiaDOM.head.appendChild(css);
  })
  return copiaDOM;
}