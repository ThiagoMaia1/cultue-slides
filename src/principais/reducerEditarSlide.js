import { redividirSlides } from '../index';
import { listaPartesEstilo, getPadding } from './Element';
import { listaDirecoes } from './Constantes';
import { getStrPercentual, removerPorcentagem } from './FuncoesGerais';

const funcoes = {
    estilo: ({s, valor}) => s.estilo = {...valor},
    srcImagem: ({s, valor}) => s.imagem = { ...valor },
    fundo: ({est, valor}) => est.fundo = {...valor},
    input2: ({e, valor}) => e.input2 = valor,
    textoTitulo: ({sel, e, valor}) => {
        if (!sel.slide && e.tipo !== 'Imagem' && e.tipo !== 'Vídeo') 
        e.titulo = valor
    },
    versoTem: ({est, subObjeto}) => {
        let obj = {};
        obj[subObjeto] = !est.paragrafo.versoTem[subObjeto];
        est.paragrafo.versoTem = {...est.paragrafo.versoTem, ...obj}
    },
    estiloSemReplace: complementarEstilo,
    textoArray: editarTextoArray,
    insetImagem: editarInsetImagem,
    repeticoes: ({valor, s, numero}) => s.textoArray[numero].repeticoes = valor
}

function complementarEstilo({estilo, s}) {
    var keys = Object.keys(estilo).filter(k => listaPartesEstilo.includes(k));
    for (var k of keys) {
        s.estilo[k] = { ...s.estilo[k], ...estilo[k] };
    }
}

function editarTextoArray({valor, s, numero}) {
    if (valor.texto === '') {
        s.textoArray.splice(numero, 1);
    } else {
        var quebra = valor.texto.split(/\n\n/)
                          .map(texto =>({...valor, texto}));
        if (quebra.length > 1) {
            s.textoArray.splice(numero, 1, quebra.filter(({texto}) => /\S/.test(texto)));
            s.textoArray = s.textoArray.flat();
        } else {
            s.textoArray[numero].texto = valor.texto;
        }
    }
}

function editarInsetImagem({est, alinhamento, ratio}) {
    let el = document.querySelectorAll('#preview #quadro-redimensionar')[0];
    el.style.transition = 'left 0.5s, right 0.5s, top 0.5s, bottom 0.5s';
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
            novo.top = Math.max(0, 1 - 1/proporcaoRelativa)/2;
            novo.left = Math.max(0, 1 - 1*proporcaoRelativa)/2;
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
    setTimeout(() => el.style.transition = null, 550);
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
    let redividido = {elementos, selecionado: sel}
    if (redividir) redividido = redividirSlides(elementos, sel, ratio);
    return {...redividido};
}