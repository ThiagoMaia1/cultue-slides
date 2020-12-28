import { redividirSlides } from '../index';
import { listaPartesEstilo, getPadding } from './Element';
import { listaDirecoes } from './Constantes';
import { getStrPercentual, removerPorcentagem } from './FuncoesGerais';

const funcoes = {
    estilo: ({s, valor}) => s.estilo = {...valor},
    estiloSemReplace: complementarEstilo,
    srcImagem: ({s, valor}) => s.imagem = { ...valor },
    textoArray: editarTextoArray,
    input2: ({e, valor}) => e.input2 = valor,
    textoTitulo: ({sel, e, valor}) => {
        if (!sel.slide && e.tipo !== 'Imagem' && e.tipo !== 'Vídeo') 
            e.titulo = valor
    },
    fundo: ({est, valor}) => est.fundo = {...valor},
    insetImagem: editarInsetImagem
}

function complementarEstilo({estilo, s}) {
    var keys = Object.keys(estilo).filter(k => listaPartesEstilo.includes(k));
    for (var k of keys) {
        s.estilo[k] = { ...s.estilo[k], ...estilo[k] };
    }
}

function editarTextoArray({valor, s, numero}) {
    if (valor === '') {
        s.textoArray.splice(numero, 1);
    } else {
        var quebra = valor.split(/(?<=\n\n)/);
        if (quebra.length > 1) {
            s.textoArray.splice(numero, 1, quebra.filter(q => /\S/.test(q)));
            s.textoArray = s.textoArray.flat();
        } else {
            s.textoArray[numero] = valor;
        }
    }
}

function editarInsetImagem({est, alinhamento, ratio}) {
    let { proporcaoNatural } = est.imagem;
    let { left, right, top, bottom } = listaDirecoes.reduce((resultado, d) => {
        resultado[d] = removerPorcentagem(est.imagem[d]);
        return resultado;
    }, {});
    let novo = {};
    // let proporcaoAtual = (1 - left - right)/(1 - top - bottom)
    switch (alinhamento) {
        case 'vertical':
            novo.top = (top + bottom)/2;
            break;
        case 'horizontal':
            novo.left = (left + right)/2;
            break;
        case 'cobrir':
            let proporcaoJanela = ratio.width/ratio.height;
            let proporcaoRelativa = proporcaoNatural/proporcaoJanela;
            if (proporcaoRelativa  > 1) {
                novo.left = 0;
                novo.top = 1 - 1/proporcaoRelativa;
            }
            if (proporcaoRelativa < 1) {
                novo.top = 0; 
                novo.left = 1 - 1*proporcaoRelativa;
            }
            break;
        default:
            return;
    }

    const getNovo = direcao => {
        let direcaoNovo = direcao;
        if (direcao === 'right') direcaoNovo = 'left';
        if (direcao === 'bottom') direcaoNovo = 'top';
        if (novo[direcaoNovo] === undefined)
            return est.imagem[direcao];
        return getStrPercentual(novo[direcaoNovo]);
    }

    let objRetorno = {};
    for (let d of listaDirecoes) {
        objRetorno[d] = getNovo(d);
    }
    est.imagem = {...est.imagem, ...objRetorno};
}

export default function reducerEditarSlide ({elementos, sel, action, ratio}) {

    let e = {...elementos[sel.elemento]};
    let s = e.slides[sel.slide];
    let est = s.estilo;

    let {objeto, valor, redividir} = action;
    let funcao = funcoes[objeto];
    if (funcao) {
        funcao({e, s, est, ...action, ratio});
    } else if (Object.keys(action.valor)[0] === 'paddingRight') {
            est[objeto].paddingRight = valor.paddingRight;
            est[objeto] = getPadding(est, objeto);
    } else {
        est[objeto] = {...est[objeto], ...valor};
        if (['paragrafo', 'texto', 'titulo'].includes(objeto) && Object.keys(valor).includes('color')) 
            est.texto.eBasico = false;
        if (objeto === 'tampao') 
            est.tampao.eBasico = false; 
    }
    elementos[sel.elemento] = e;
    if (redividir) elementos = redividirSlides(elementos, sel, ratio);
    return {elementos: [...elementos], selecionado: sel};
}