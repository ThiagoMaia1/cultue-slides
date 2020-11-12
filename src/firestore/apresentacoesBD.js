import Element, { getEstiloPadrao, textoMestre } from '../Element.js';
import { gerarNovoRegistro, atualizarRegistro, getRegistrosUsuario } from './apiFirestore';

const colecaoApresentacoes = 'apresentações';

const getElementosPadrao = (usuario) => {
  if (usuario && usuario.apresentacaoPadrao) {
    return usuario.apresentacaoPadrao;
  }
  return [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...getEstiloPadrao()}, true)];
}

export const getApresentacaoPadrao = (usuario) => ({
  elementos: getElementosPadrao(usuario),
  selecionado: {elemento: 0, slide: 0}
});

export const gerarNovaApresentacao = async usuario => {
  return await gerarNovoRegistro(
    usuario.uid,
    colecaoApresentacoes,
    {
      elementos: getElementosConvertidos(getElementosPadrao(usuario))
    },
    true
  );
};

export const definirApresentacao = async (usuario, dispatcher, apresentacao) => {
  var novaApresentacao = apresentacao || await gerarNovaApresentacao(usuario);
  novaApresentacao.elementos = getElementosDesconvertidos(novaApresentacao.elementos);
  dispatcher.dispatch({type: 'definir-apresentacao', apresentacao: novaApresentacao})
}

export const atualizarApresentacao = async (elementos, idApresentacao) => {
  return await atualizarRegistro(
    {elementos: elementos},
    colecaoApresentacoes,
    idApresentacao
  );
}

export const definirApresentacaoPadrao = async (idUsuario, elementosPadrao) => {
  atualizarRegistro(
    {
      apresentacaoPadrao: getSlideMestreApresentacao(elementosPadrao)
    },
    'usuários',
    idUsuario
  );
}

export const getApresentacoesUsuario = async (idUsuario) => {
  return await getRegistrosUsuario(
    idUsuario,
    colecaoApresentacoes
  );
}

export const getElementosDesconvertidos = elementos => {
  var el = [...elementos];
  for (var i = 0; i < el.length; i++) {
      el[i] = new Element(null, null, null, null, null, null, el[i]);
  }
  return el;
}

export const getElementosConvertidos = elementos => {
  var el = [...elementos];
  for (var i = 0; i < el.length; i++) {
      el[i] = el[i].conversorFirestore();
  }
  return el;
}

export const getSlideMestreApresentacao = elementos => {
  return getElementosConvertidos(elementos.filter(e => e.eMestre));
}