import firebase, { firestore } from '../firebase';
import store from '../../index';

export const slidesPadraoDefault = [{titulo: 'Visitantes', textoSlide: 'Sejam bem-vindos à nossa Igreja!'},
                           {titulo: 'Avisos', textoSlide: ''}, 
                           {titulo: 'Mensagem', textoSlide: ''}
]

export const gerarDocumentoUsuario = async (usuario, dadosAdicionais) => {
  if (!usuario) return;
  const refUsuario = firestore.doc(`usuários/${usuario.uid}`);
  const snapshot = await refUsuario.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = usuario;
    try {
      await refUsuario.set({
        displayName,
        email,
        photoURL,
        tutoriaisFeitos: store.getState().tutoriaisFeitos,
        ...dadosAdicionais,
        slidesPadrao: slidesPadraoDefault
      });
      gerarNovoRegistro(
        'emails',
        {
            idUsuario: usuario.uid,
            enderecoEmail: email,
            nomeCompleto: dadosAdicionais.nomeCompleto,
            eProprio: true
        }
      );
    } catch (error) {
      console.error("Erro ao criar documento de usuário", error);
    }
  }
  return getDocumentoUsuario(usuario.uid);
  };

export const getDocumentoUsuario = async uid => {
  if (!uid) return null;
  try {
    const docUsuario = await firestore.doc(`usuários/${uid}`).get();
    return {
      uid,
      ...docUsuario.data()
    };
  } catch (error) {
    console.error("Erro ao buscar usuário.", error);
  }
};

export const gerarNovoRegistro = async (colecao, dados, gerarTimestampCriacao = false) => {
  var refRegistro = firestore.collection(colecao).doc(); 
  var timestamp = firebase.firestore.FieldValue.serverTimestamp();
  dados.timestamp = timestamp;
  if (gerarTimestampCriacao) dados.timestampCriacao = timestamp;
  try {
    await refRegistro.set(dados);
  } catch (error) {
    console.error("Erro ao adicionar registro à coleção: '" + colecao + "'.", error);
  }
  var doc = await refRegistro.get();
  return getObjetoRegistro(doc);
};


export const atualizarRegistro = async (dados, colecao, idRegistro) => {
  // var strDados = JSON.stringify(dados);
  var refRegistro = firestore.doc(colecao + '/' + idRegistro)
  dados.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  try {
    await refRegistro.update(dados);
  } catch (error) {
    console.error("Erro ao atualizar registro da coleção: '" + colecao + "'.", error, dados);
    throw error;
  }
  var doc = await refRegistro.get();
  return getObjetoRegistro(doc);
};

export const getRegistrosUsuario = async (idUsuario, colecao) => {
  var colecaoBD = await firestore.collection(colecao).where('idUsuario', '==', idUsuario).orderBy('timestamp', 'desc').get();
  return colecaoBD.docs.reduce((resultado, doc) => {
    resultado.push(getObjetoRegistro(doc));
    return resultado;
  }, []);
}

export const getRegistro = async (colecao, id) => {
  var docRegistro = await firestore.doc(colecao + '/' + id).get();
  return getObjetoRegistro(docRegistro);
}

export const getRegistrosQuery = async (colecao, dado, valor) => {
  var colecaoBD = await firestore.collection(colecao).where(dado, '==', valor).orderBy('timestamp', 'desc').get();
  return colecaoBD.docs.reduce((resultado, doc) => {
    resultado.push(getObjetoRegistro(doc));
    return resultado;
  }, []);
}

const getObjetoRegistro = doc => {
  if (!doc.data()) return null;
  var dados = doc.data({serverTimestamps: "estimate"});
  dados.data = dataFormatada(dados.timestamp.toDate());
  if (dados.timestampCriacao)
    dados.dataCriacao = dataFormatada(dados.timestampCriacao.toDate());
  dados.id = doc.id;
  return dados;
}

export const excluirRegistro = async (idRegistro, colecao) => {
  return firestore.collection(colecao).doc(idRegistro).delete().then(function() {
    console.log("Registro excluído com sucesso.");
  }).catch(function(error) {
      console.error("Erro ao excluir registro: ", error);
  });
}

function dataFormatada(data) {
  return String(data.getDate()).padStart(2,'0') + '/' +
         String((data.getMonth()+1)).padStart(2,'0') + '/' +
         data.getFullYear() + ' ' +
         String(data.getHours()).padStart(2,'0') + ":" +   
         String(data.getMinutes()).padStart(2,'0')
}

export function gerarID(chars = 8) {
  var id = '';
  do {
    var numero = Date.now();
    id = id + numero.toString(16);
  } while(id.length < chars)
  return id.substr(id.length-chars);
}