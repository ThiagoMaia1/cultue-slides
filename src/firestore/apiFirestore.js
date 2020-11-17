import firebase, { firestore } from '../firebase';

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
          ...dadosAdicionais
        });
        gerarNovoRegistro(
          usuario.uid,
          'emails',
          {
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

export const gerarNovoRegistro = async (idUsuario, colecao, dados, gerarTimestampCriacao = false) => {
  var refRegistro = firestore.collection(colecao).doc(); 
  dados.idUsuario = idUsuario;
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
  var refRegistro = firestore.doc(colecao + '/' + idRegistro)
  dados.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  try {
    await refRegistro.update(dados);
  } catch (error) {
    console.error("Erro ao atualizar registro da coleção: '" + colecao + "'.", error);
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
