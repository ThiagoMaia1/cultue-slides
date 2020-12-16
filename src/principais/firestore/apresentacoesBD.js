import Element, { getEstiloPadrao, textoMestre } from '../../principais/Element.js';
import { gerarNovoRegistro, atualizarRegistro, getRegistrosUsuario, excluirRegistro, getRegistro, getRegistrosQuery } from './apiFirestore';
import { firestore } from '../firebase';
import store from '../../index';
import { ativarPopupConfirmacao } from '../../Components/Popup/PopupConfirmacao';
import history, { getIdHash } from '../../principais/history';

export const apresentacaoAnonima = {id: 0, zerada: true, autorizacao: 'editar'};
const colecaoApresentacoes = 'apresentações';
const colecaoPermissoes = 'permissões';

const autorizacoesApresentacao = ['ver', 'baixar', 'exportar', 'editar'];
export const autorizacaoPadrao = autorizacoesApresentacao[0];

const wWidth = window.screen.width;
const wHeight = window.screen.height;
export const ratioTela = {width: Math.max(wWidth, wHeight), height: Math.min(wWidth, wHeight)};
const selecionadoPadrao = {elemento: 0, slide: 0};

const getAprensentacaoPadraoUsuario = async  ({idApresentacaoPadrao, tipoApresentacaoPadrao}) => {
  let { elementos, ratio } = await getApresentacaoComId(idApresentacaoPadrao);
  if (tipoApresentacaoPadrao === 'estilo') elementos = elementos.slice(0, 1);
  elementos = getElementosDesconvertidos(elementos);
  return {elementos, ratio, selecionado: selecionadoPadrao};
}

export const getApresentacaoPadraoBasica = (usuario = {}) => {
  if (!usuario.uid || !usuario.idApresentacaoPadrao) {
    return {
      elementos: [
        new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...getEstiloPadrao()}, true)
      ],
      ratio: ratioTela,
      selecionado: selecionadoPadrao
    }
  }
};

export const gerarNovaApresentacao = async (idUsuario, elementos, zerada, ratio) => {
  if (elementos)
    elementos = getElementosConvertidos(elementos);
  return await gerarNovoRegistro(
    colecaoApresentacoes,
    {
      idUsuario,
      elementos,
      ratio,
      zerada
    },
    true
  );
};

export const definirApresentacaoAtiva = async (usuario, apresentacao = {}, elementos = null, ratio = null, mudarURL = true) => {
  if (!apresentacao) apresentacao = {};
  var novaApresentacao = apresentacao;
  var zerada = false;
  if (apresentacao.elementos)
    elementos = getElementosDesconvertidos(apresentacao.elementos);
  if (apresentacao.ratio) {
    ratio = apresentacao.ratio 
  } else if (!ratio) {
    ratio = {...ratioTela};
  }
  if (!elementos) {
    zerada = true;
    let apresentacaoPadrao = await getAprensentacaoPadraoUsuario(usuario);
    elementos = apresentacaoPadrao.elementos;
  }
  if (!usuario.uid && !apresentacao.id) {
    novaApresentacao = apresentacaoAnonima;
  } else if(usuario.uid) {
    limparApresentacoesVazias(usuario.uid);
    if (!apresentacao.id)
      novaApresentacao = await gerarNovaApresentacao(usuario.uid, elementos, zerada, ratio);
  }
  delete novaApresentacao.elementos;
  novaApresentacao = {...novaApresentacao, zerada };
  if (mudarURL) history.replace('/app' + (novaApresentacao.id ? '/#/' + novaApresentacao.id : ''));
  store.dispatch({type: 'definir-apresentacao-ativa', apresentacao: novaApresentacao, elementos, ratio})
}

export const excluirApresentacao = async idApresentacao => {
  var state = store.getState();
  await excluirRegistro(idApresentacao, colecaoApresentacoes);
  if (state.present.apresentacao.id === idApresentacao) {
    const ultima = await getUltimaApresentacaoUsuario(state.usuario.uid, false);
    await definirApresentacaoAtiva(state.usuario, ultima, undefined, undefined, false);
  }    
  var permissoes = await getRegistrosQuery(colecaoPermissoes, 'idApresentacao', idApresentacao);
  for (var p of permissoes) {
    excluirRegistro(p.id, colecaoPermissoes);
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

export const atualizarApresentacao = async (elementos, ratio, idApresentacao) => {
  return await atualizarRegistro(
    {elementos: getElementosConvertidos(elementos), ratio: ratio, ePadrao: false},
     colecaoApresentacoes,
     idApresentacao
  );
}

export const definirApresentacaoPadrao = async (idUsuario, idApresentacao, atualSelecionada = 'atual', callback = null) => {
  var conteudoNotificacao;
  if (!idUsuario) {
    ativarPopupConfirmacao(
      'OK',
      'Atenção', 
      'Para definir uma apresentação como padrão, você deve primeiro fazer login.'
    )
    if (callback) callback(false);
  } else {
    ativarPopupConfirmacao(
      'simNao',
      'Atenção', 
      'Deseja definir a apresentação ' + atualSelecionada + ' como padrão?', 
      async fazer => {
        if (callback) callback(fazer);
        if(!fazer) return;
        store.dispatch({type: 'definir-apresentacao-padrao', idApresentacao});
        conteudoNotificacao = 'Apresentação Definida como Padrão';
        store.dispatch({type: 'inserir-notificacao', conteudo: conteudoNotificacao});
      }
    );
  }
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

export const zerarApresentacao = (usuario, apresentacao) => {
  ativarPopupConfirmacao(
    'simNao',
    'Atenção', 
    'Deseja iniciar uma nova apresentação?' + 
      (!apresentacao.id ? '\n\n(A apresentação atual será excluída)' : ''), 
    fazer => {
      if(fazer) definirApresentacaoAtiva(usuario);
    }
  );
}

export const getApresentacaoComLocation = async (location, idUsuario) => {
  var apresentacao;
  if (location.hash) {
    var idHash = getIdHash(location);
    var temApp = location.pathname === '/app/';
    var getApresentacao = temApp ? getApresentacaoComId : getApresentacaoComPermissao; 
    apresentacao = await getApresentacao(idHash);
  }
  if (apresentacao === null) {
    store.dispatch({type: 'inserir-notificacao', conteudo: 'URL Inválida: ' + window.location.origin.toString() + location.pathname + location.hash})
  }
  return apresentacao;
}

const getApresentacaoComId = async idApresentacao => {
  return await getRegistro('apresentações', idApresentacao);
}

const getApresentacaoComPermissao = async idPermissao => {
  var permissao = await getRegistro('permissões', idPermissao);
  if (permissao) { 
    var apresentacao = await getRegistro('apresentações', permissao.idApresentacao);
    return {...apresentacao, autorizacao: permissao.autorizacao, formatoExportacao: permissao.formatoExportacao}
  } else {
    return null;
  }
}

export const getUltimaApresentacaoUsuario = async (idUsuario, exigeRecente = true) => {
  var apresentacoes = await getApresentacoesUsuario(idUsuario || 0);
  return (
    (!exigeRecente || apresentacaoERecente(apresentacoes[0]))
      ? apresentacoes[0] 
      : null
  );
}

const apresentacaoERecente = (apresentacao, dias = 7) => {
  if (!apresentacao) return false;
  var oneDay = 24 * 60 * 60 * 1000; // ms
  var tempoDecorrido = (new Date()) - apresentacao.timestamp.toDate();
  return tempoDecorrido < dias*oneDay
}

export const gerarNovaPermissao = async (idApresentacao, autorizacao = 'ver', usuarios = [], formatoExportacao = null) => {
  if (!autorizacoesApresentacao.includes(autorizacao)) autorizacao = 'ver';
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

export const getLinkPermissao = idPermissao => window.location.origin.toString() + '/#/' + idPermissao;

export const autorizacaoEditar = autorizacao => autorizacao === 'editar';