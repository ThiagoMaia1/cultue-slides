import Element, { getEstiloPadrao, textoMestre } from '../Element.js';
import { gerarNovoRegistro, atualizarRegistro, getRegistrosUsuario } from './apiFirestore';

const criarNovaApresentacao = () => {
  return [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...getEstiloPadrao()}, true)];
}

export const apresentacaoDefault = {
  elementos: criarNovaApresentacao(),
  selecionado: {elemento: 0, slide: 0}
};

const colecaoApresentacoes = 'apresentações';

export const gerarNovaApresentacao = async idUsuario => {
  return await gerarNovoRegistro(
    idUsuario,
    colecaoApresentacoes,
    {
      elementos: getElementosConvertidos(apresentacaoDefault.elementos)
    },
    true
  );
};


export const atualizarApresentacao = async (elementos, idApresentacao) => {
  return await atualizarRegistro(
    {elementos: elementos},
    colecaoApresentacoes,
    idApresentacao
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