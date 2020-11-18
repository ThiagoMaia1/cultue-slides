import Element, { getEstiloPadrao, textoMestre } from '../Element.js';
import { gerarNovoRegistro, atualizarRegistro, getRegistrosUsuario, excluirRegistro, getRegistro } from './apiFirestore';
import { firestore } from '../firebase';
import { store, urlSite } from '../index';
import { ativarPopupConfirmacao } from '../Components/Popup/PopupConfirmacao';
import history, { getIdHash } from '../history';

const colecaoApresentacoes = 'apresentações';
const colecaoPermissoes = 'permissões';

const autorizacoesApresentacao = {baixar: 'componente', ver: 'componente', exportar: 'componente', editar: 'componente'}


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

export const gerarNovaApresentacao = async (idUsuario, elementos, ePadrao) => {
  if (elementos)
    elementos = getElementosConvertidos(elementos);
  return await gerarNovoRegistro(
    colecaoApresentacoes,
    {
      idUsuario: idUsuario,
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
      novaApresentacao = await gerarNovaApresentacao(usuario.uid, elementos, zerada);
  }
  delete novaApresentacao.elementos;
  novaApresentacao = {...novaApresentacao, zerada: zerada};
  history.push('/app/#/' + novaApresentacao.id)
  store.dispatch({type: 'definir-apresentacao-ativa', apresentacao: novaApresentacao, elementos: elementos})
}

export const excluirApresentacao = async idApresentacao => {
  await excluirRegistro(idApresentacao, colecaoApresentacoes);
  var state = store.getState();
  if (state.apresentacao.id === idApresentacao) {
    definirApresentacaoAtiva(state.usuario);
  }
}

const limparApresentacoesVazias = idUsuario => {
  var consulta = firestore.collection(colecaoApresentacoes)
                  .where('idUsuario','==', idUsuario)
                  .where('ePadrao', '==', true);
  consulta.get().then(function(resultados) {
    resultados.forEach(function(doc) {
      doc.ref.delete();
    });
  });
}

export const atualizarApresentacao = async (elementos, idApresentacao) => {
  return await atualizarRegistro(
    {elementos: getElementosConvertidos(elementos), ePadrao: false},
    colecaoApresentacoes,
    idApresentacao
  );
}

export const definirApresentacaoPadrao = async (idUsuario, elementosPadrao) => {
  var conteudo;
  try { 
    await atualizarRegistro(
      {
        apresentacaoPadrao: getSlideMestreApresentacao(elementosPadrao)
      },
      'usuários',
      idUsuario
    );
  } catch (error) {
    conteudo = 'Erro ao Definir Apresentação Padrão';
  }
  conteudo = 'Apresentação Definida como Padrão';
  store.dispatch({type: 'inserir-notificacao', conteudo: conteudo})
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
      el[i] = el[i].conversorFirestore(el[i]);
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

export const definirApresentacaoComLocation = async (location, user) => {
  if (location.hash) {
      var idApresentacao = getIdHash(location);
      if (idApresentacao) { 
          var apresentacao = await getRegistro('apresentações', idApresentacao);
          if (apresentacao) {
              definirApresentacaoAtiva(user, apresentacao);
              return;
          }
          store.dispatch({type: 'inserir-notificacao', conteudo: 'URL Inválida: ' + urlSite + location.pathname + location.hash})
      }
  }
  definirApresentacaoUsuario(user);
}

const definirApresentacaoUsuario = user => {
  var state = store.getState();
  var z = state.present.apresentacao.zerada;
  var eNovoLogin = !state.usuario.uid && user.uid; 
  if (!user.uid) {
      if (!z)
          definirApresentacaoAtiva(user, {id: 0}, state.present.elementos)
      return
  }
  if (!z && eNovoLogin) {
      ativarPopupConfirmacao(
          'simNao', 
          'Apresentação', 
          'Deseja continuar editando a apresentação atual?', 
          fazer => {
              if(fazer) {
                  associarApresentacaoUsuario(user);
              } else {
                  selecionarUltimaApresentacaoUsuario(user);
              }
          }
      )
  } else {
      selecionarUltimaApresentacaoUsuario(user);
  }
}

const associarApresentacaoUsuario = user => {
  var state = store.getState().present;
  definirApresentacaoAtiva(
      user, 
      state.apresentacao,
      state.elementos
  )
}

const selecionarUltimaApresentacaoUsuario = async user => {
  var apresentacoes = await getApresentacoesUsuario(user.uid);
  if (apresentacoes.length !== 0) {
      var oneDay = 24 * 60 * 60 * 1000; // ms
      var tempoDecorrido = (new Date()) - apresentacoes[0].timestamp.toDate();
      if(tempoDecorrido < 7*oneDay)
          definirApresentacaoAtiva(user, apresentacoes[0]);
  }
}

export const gerarNovaPermissao = async (idApresentacao, autorizacao = 'ver', usuarios = [], formatoExportacao = null) => {
  if (!autorizacoesApresentacao[autorizacao]) autorizacao = 'ver';
  
  return await gerarNovoRegistro(
    colecaoPermissoes,
    {
      idApresentacao: idApresentacao,
      autorizacao: autorizacao,
      usuarios: usuarios,
      formatoExportacao: formatoExportacao,
      permanente: false
    }
  )
}
