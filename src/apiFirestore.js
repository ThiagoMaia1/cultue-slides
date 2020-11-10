import firebase, { firestore } from '../../firebase';

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
  }
  var doc = await refRegistro.get();
  return getObjetoRegistro(doc);
};

export const getRegistrosUsuario = async (idUsuario, colecao) => {
  var colecaoBD = await firestore.collection(colecao).where('idUsuario', '==', idUsuario).orderBy('timestamp', 'desc').get();
  return colecaoBD.docs.reduce((resultado, doc) => {
    resultado.push(getObjetoApresentacao(doc));
    return resultado;
  }, []);
}

const getObjetoRegistro = doc => {
  var dados = doc.data();
  dados.data = dataFormatada(dados.timestamp.toDate());
  if (dados.timestampCriacao)
    dados.dataCriacao = dataFormatada(dados.timestampCriacao.toDate());
  dados.id = doc.id;
  return dados;
}

function dataFormatada(data) {
  return String((data.getMonth()+1)).padStart(2,'0') + '/' +
         String(data.getDate()).padStart(2,'0') + '/' +
         data.getFullYear() + ' ' +
         String(data.getHours()).padStart(2,'0') + ":" +   
         String(data.getMinutes()).padStart(2,'0')
}
