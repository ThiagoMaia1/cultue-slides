import { firestore } from '../../firebase';

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