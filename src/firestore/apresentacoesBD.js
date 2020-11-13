import Element, { getEstiloPadrao, textoMestre } from '../Element.js';
import { gerarNovoRegistro, atualizarRegistro, getRegistrosUsuario } from './apiFirestore';
import { firestore } from '../firebase';
import { store } from '../index';
import { ativarPopupConfirmacao } from '../Components/Popup/PopupConfirmacao';

const colecaoApresentacoes = 'apresentações';

export const getElementosPadrao = (usuario) => {
  if (usuario && usuario.apresentacaoPadrao) {
    return usuario.apresentacaoPadrao;
  }
  return [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...getEstiloPadrao()}, true)];
}

export const getApresentacaoPadrao = (usuario) => ({
  elementos: getElementosPadrao(usuario),
  selecionado: {elemento: 0, slide: 0}
});

export const gerarNovaApresentacao = async (idUsuario, elementos) => {
  if (elementos)
    elementos = getElementosConvertidos(elementos);
  return await gerarNovoRegistro(
    idUsuario,
    colecaoApresentacoes,
    {
      elementos: elementos
    },
    true
  );
};

export const definirApresentacaoAtiva = async (usuario, apresentacao = {}, elementos = null) => {
  var novaApresentacao = apresentacao;
  var zerada = false;
  if (apresentacao.elementos)
    elementos = getElementosDesconvertidos(apresentacao.elementos);
  if (!elementos) {
    zerada = true;
    elementos = getElementosPadrao(usuario);
  }
  if (!usuario.uid) {
    novaApresentacao = {id: 0}
  } else {
    limparApresentacoesVazias(usuario.uid);
    if (!apresentacao.id)
      novaApresentacao = await gerarNovaApresentacao(usuario.uid, elementos);
  }
  delete novaApresentacao.elementos;
  novaApresentacao = {...novaApresentacao, zerada: zerada}
  store.dispatch({type: 'definir-apresentacao-ativa', apresentacao: novaApresentacao, elementos: elementos})
}

const limparApresentacoesVazias = idUsuario => {
  var consulta = firestore.collection(colecaoApresentacoes).where('idUsuario','==', idUsuario);
  consulta.get().then(function(resultados) {
    resultados.forEach(function(doc) {
      if (!doc.data().elementos) 
        doc.ref.delete();
    });
  });
}

export const atualizarApresentacao = async (elementos, idApresentacao) => {
  return await atualizarRegistro(
    {elementos: getElementosConvertidos(elementos)},
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
    if(el[i].conversorFirestore)
      el[i] = el[i].conversorFirestore();
  }
  return el;
}

export const getSlideMestreApresentacao = elementos => {
  return getElementosConvertidos(elementos.filter(e => e.eMestre));
}

export const zerarApresentacao = usuario => {
  ativarPopupConfirmacao(
    'simNao',
    'Atenção', 
    'Deseja iniciar uma nova apresentação?' + 
      (!usuario.uid ? '\n\n(A apresentação atual será excluída)' : ''), 
    fazer => {
      if(fazer) definirApresentacaoAtiva(usuario);
    }
  );
}