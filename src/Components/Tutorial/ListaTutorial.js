import hotkeys from 'hotkeys-js';
import store from '../../index';

const selectorQuadradinhoCanto = '.itens.lista-slides .quadradinho-canto';

const setOpacidadeQuadradinhoCanto = opacidade => {
    store.dispatch({type: 'definir-selecao', selecionado: {elemento: opacidade ? 1 : 2, slide: 0}})
    var elem = document.querySelectorAll(selectorQuadradinhoCanto)[0];
    if (elem) {
      elem.style.opacity = opacidade || null;
      elem.style.pointerEvents = opacidade ? 'all' : null;
    }
  }
  
const selecionarSlide = (elemento, slide) => store.dispatch({type: 'definir-selecao', selecionado: {elemento, slide}});
const selecionarAba = abaAtiva => store.dispatch({ type: 'ativar-realce', abaAtiva });
  
const listaBoxes = {
    painelAdicionar: {rotulo: 'Adicionar um Slide', listaEtapas: [{
      texto: 'Clique para criar um slide', 
      arrow: {posicao: 'bottomCenter', posicaoChildren: 'right'},
      selectorElemento: '.container-adicionar',
      evento: {listener: 'redux', alvo: '.present.popupAdicionar'}
    }]},
    slides: {rotulo: 'Lista de Slides', listaEtapas: [
      {texto: 'As configurações do Slide-Mestre se aplicam aos demais slides. Cada grupo de slides também possui seu próprio slide-mestre.', 
       coordenadas: [15, 25], 
       arrow: {posicao: 'centerRight', posicaoChildren: 'bottom'},
       selectorElemento: '#slide-mestre',
       callbackAntes: () => selecionarSlide(0, 0)
      },
      {texto: 'Clique no canto superior esquerdo do slide-mestre para alterar as dimensões da tela/projetor.', 
       arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom', selectorElemento: '#selecionar-aspect-ratio'},
       selectorElemento: '#borda-slide-mestre',
       callbackAntes: () => selecionarSlide(0, 0),
       callbackDepois: () => selecionarSlide(1, 0),
       evento: {listener: 'redux', alvo: '.present.ratio', timeout: 800}
      },
      // {texto: 'Clique para alterar as configurações e a imagem de fundo do slide selecionado', 
      //  coordenadas: [40, 40], 
      //  selectorElemento: '#botao-menu-configurar, #botao-mostrar-galeria',
      //  evento: {listener: 'click', alvo: 'botao-menu-configurar', timeout: 500}
      // },
      {texto: 'Clique ou pressione F5 para ativar o modo de apresentação', 
       arrow: {posicao: 'bottomCenter', posicaoChildren: 'left', selectorElemento: '#ativar-tela-cheia'},
       selectorElemento: '#borda-slide-mestre',
       callbackAntes: () => hotkeys.setScope('main'),
       callbackDepois: () => hotkeys.setScope('tutorial'),
       evento: {listener: 'fullscreenchange'}
      }
    ]},
    arrastar: {rotulo: 'Editar Lista de Slides', listaEtapas: [
      {texto: 'Clique no slide, ou utilize as setas para navegar', 
       arrow: {posicao: 'centerRight', posicaoChildren: 'bottom'},
       selectorElemento: '#ordem-elementos',
       callbackAntes: () => hotkeys.setScope('main'),
       callbackDepois: () => hotkeys.setScope('tutorial'),
       evento: {listener: 'redux', alvo: '.present.selecionado', timeout: 500}},
      {texto: 'Arraste um slide ou grupo de slides para reordenar a apresentação', 
       arrow: {posicao: 'centerRight', posicaoChildren: 'bottom'},
       selectorElemento: '#ordem-elementos',
       evento: {listener: 'redux', alvo: '.present.elementos', timeout: 500}},
      {texto: 'Clique no canto superior direito de um grupo de slides para exclui-lo, ou clique no lápis para editar o conteúdo do slide', 
       arrow: {posicao: 'centerRight', posicaoChildren: 'bottom', selectorElemento: '.itens.lista-slides'},
       selectorElemento: selectorQuadradinhoCanto,
       callbackAntes: () => setOpacidadeQuadradinhoCanto(1),
       callbackDepois: () => setOpacidadeQuadradinhoCanto(0),
       evento: {listener: 'click'}
      },
      {texto: 'Ao concluir, clique para exportar a apresentação pronta', 
       arrow: {posicao: 'centerLeft', posicaoChildren: 'top'},
       selectorElemento: '#menu-exportacao',
       evento: {listener: 'click', alvo: 'menu-exportacao', timeout: 500}},
    ]},
    galeriaFundos: {rotulo: 'Galeria de Fundos', listaEtapas: [
     {texto: 'Passe o mouse sobre uma imagem para ver o fundo aplicado ao slide selecionado, ou clique para selecionar o fundo', 
      coordenadas: [45, 45], 
      selectorElemento: '#botao-mostrar-galeria',
      evento: {listener: 'click', alvo: 'botao-mostrar-galeria', timeout: 500}
    }
    ]},
    configuracoesSlide: {rotulo: 'Configurar Slides', listaEtapas: [
     {texto: 'Selecione a aba para aplicar as configurações', 
      arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom', selectorElemento: '#abas'},
      selectorElemento: '#botao-menu-configurar',
      evento: {listener: 'redux', alvo: '.present.abaAtiva', timeout: 500}
    },
     {texto: 'Ao editar as configurações de texto, os slides são automaticamente redivididos para caber', 
      coordenadas: [45, 45], 
      selectorElemento: '#botao-menu-configurar, #borda-slide-mestre',
      evento: {listener: 'redux', alvo: '.present.elementos', timeout: 1000},
      callbackAntes: () => selecionarAba('paragrafo')},
     {texto: 'Você pode alterar a cor de fundo, e a opacidade da camada que se sobrepõe à imagem de fundo', 
      arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom', selectorElemento: '#configuracoes'},
      selectorElemento: '#botao-menu-configurar, #borda-slide-mestre',
      callbackAntes: () => selecionarAba('tampao'),
      evento: {listener: 'redux', alvo: '.present.elementos', timeout: 1000}
     },
     {texto: 'E também pode aplicar filtros', 
      arrow: {posicao: 'bottomCenter', posicaoChildren: 'left', selectorElemento: '#selecionar-filtro-fundo'},
      selectorElemento: '#botao-menu-configurar, #borda-slide-mestre',
      callbackAntes: () => selecionarAba('tampao'),
      callbackDepois: () => selecionarAba('texto'),
      evento: {listener: 'click', alvo: 'selecionar-filtro-fundo', timeout: 1000}
     },
     {texto: 'Clique diretamente no texto do slide para editar seu conteúdo', 
      coordenadas: [45, 60], 
      selectorElemento: '#borda-slide-mestre, #botao-menu-configurar',
      callbackAntes: () => selecionarAba('paragrafo'),
      callbackDepois: () => selecionarAba('texto'),
      evento: {listener: 'click', alvo: 'texto-preview', timeout: 1000}
    },
     {texto: 'Clique para aplicar o estilo do slide selecionado ao slide-mestre do grupo ou da apresentação.',
      arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom'},
      selectorElemento: '#botao-clonar-estilo',
      evento: {listener: 'click', alvo: 'botao-clonar-estilo', timeout: 300}
     },
     {texto: 'Clique para limpar os estilos do slide, grupo ou apresentação selecionados.',
      arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom'},
      selectorElemento: '#botao-limpar-estilo',
      evento: {listener: 'click', alvo: 'botao-limpar-estilo', timeout: 300}
     }
  ]}
}

export default listaBoxes;

export const keysTutoriais = Object.keys(listaBoxes);

export const listaTutoriais = keysTutoriais.map(k => (
  {valor: k, rotulo: listaBoxes[k].rotulo}
))
