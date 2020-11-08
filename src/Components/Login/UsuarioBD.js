import firebase, { firestore } from '../../firebase';

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
      } catch (error) {
        console.error("Erro ao criar documento de usuário", error);
      }
    }
    return getDocumentoUsuario(usuario.uid);
  };

  const getDocumentoUsuario = async uid => {
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

export const gerarNovaApresentacao = async idUsuario => {
  if (!idUsuario) return null;
  var refApresentacao = firestore.collection('apresentações').doc(); 
  var timestamp = firebase.firestore.FieldValue.serverTimestamp();  
  try {
    await refApresentacao.set({
      timestampCriacao: timestamp,
      timestamp: timestamp,
      idUsuario: idUsuario,
      elementos: []
    });
  } catch (error) {
    console.error("Erro ao adicionar apresentação ao banco de dados", error);
  }
  return refApresentacao;
};


export const atualizarApresentacao = async (elementos, refApresentacao) => {
  var dados = [];
  for (var i = 0; i < elementos.length; i++) {
    dados.push(elementos[i].conversorFirestore());
  }
  try {
    await refApresentacao.update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      elementos: dados
    });
  } catch (error) {
    console.error("Erro ao atualizar apresentação no banco de dados", error);
  }
  return refApresentacao;
};

export const getApresentacoesUsuario = async (idUsuario) => {
  var colecao = await firestore.collection('apresentações').where('idUsuario', '==', idUsuario).orderBy('timestamp', 'desc').get();
  return colecao.docs.reduce((resultado, doc) => {
    var dados = doc.data();
    dados.dataFormatada = dataFormatada(dados.timestamp.toDate());
    resultado.push({...dados, idApresentacao: dados.id});
    return resultado;
  }, []);
}

function dataFormatada(data) {
  return String((data.getMonth()+1)).padStart(2,'0') + '/' +
         String(data.getDate()).padStart(2,'0') + '/' +
         data.getFullYear() + ' ' +
         String(data.getHours()).padStart(2,'0') + ":" +   
         String(data.getMinutes()).padStart(2,'0')
}

  // const getDocumentoUsuario = async uid => {
  //   if (!uid) return null;
  //   try {
  //     const docUsuario = await firestore.doc(`usuários/${uid}`).get();
  //     return {
  //       uid,
  //       ...docUsuario.data()
  //     };
  //   } catch (error) {
  //     console.error("Erro ao buscar usuário.", error);
  //   }
  // };