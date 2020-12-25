import { definirApresentacaoPadrao } from '../../principais/firestore/apresentacoesBD';

const QuadroDefinirPadrao = ({usuario, callback, apresentacao}) => {
    definirApresentacaoPadrao(usuario.uid, apresentacao.id, 'atual');
    callback();
    return null;
}

export default QuadroDefinirPadrao;