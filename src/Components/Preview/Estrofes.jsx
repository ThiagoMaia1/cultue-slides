import React, { Fragment } from 'react';
// import ReactDOMServer from 'react-dom/server';
import { getNumeroVersiculo /*, markupParaSuperscrito */ } from './TextoPreview';
// import { limparHighlights } from '../BarraPesquisa/BarraPesquisa';


export default function Estrofes(props) {
    var s = props.slidePreview;
    var tA = s.textoArray;
    const divBreak = <div><br></br></div>;
    var spans;
    var estiloDivEstrofe;

    const getSpan = (t, i, _array, comBreaks = false, eVersiculo = false) => {
        
        var breaks = null;
        if (comBreaks) breaks = (divBreak);
        var versiculo = {};
        if (eVersiculo) {
            versiculo = getNumeroVersiculo(t);
            t = <>{versiculo.textoAntes} <sup>{versiculo.numero}</sup> {versiculo.textoDepois}</>;
        }
        var sel = props.selecionado;
        return (
            <Fragment key={sel.elemento + '.' + sel.slide + '.' + i}>
                <span id={'textoArray-' + i} 
                      contentEditable={props.editavel} suppressContentEditableWarning='true'
                      onInput={props.onInput} 
                      onFocus={e => {
                        // e.target.innerHTML = markupParaSuperscrito(limparHighlights(e.target.innerHTML));
                        props.ativarRealce('paragrafo')
                      }}
                    //   onBlur={e => e.target.innerHTML = ReactDOMServer.renderToStaticMarkup(t)}
                >
                    {t} 
                </span>
                {breaks}
            </Fragment>
        )
    };

    const getSpanRepetidor = vezes => {
        if (!s.estilo.paragrafo.multiplicadores)
            return null;
        return <span className='marcador-estrofe' contentEditable='true' suppressContentEditableWarning='true'>✕{vezes}</span>
    }
    
    const getConteudoWraper = (t, i, array) => (
        <>
            <div className='wraper-estrofe'>
                {getSpan(t.estrofe, i, null, true)}
                {t.repeticoes ? getSpanRepetidor(t.repeticoes) : null}
            </div>
            {i < array.length && t.estrofe.substr(0,4) !== '\n\n' ? divBreak : null}
        </>
    )

    const getAlinhamento = (alinhamento = 'left') => {
        switch (alinhamento) {
            case 'left':
                return 'flex-start';
            case 'right':
                return 'flex-end';
            default: 
                return 'center';
        }
    }

    if (s.tipo === 'TextoBíblico') {
        estiloDivEstrofe = {display: 'inline'};
        spans = tA.map((t, i) => getSpan(t, i, null, undefined, true))
    } else {
        estiloDivEstrofe = {display: 'flex', width: '100%', flexDirection: 'column'};
        estiloDivEstrofe.alignItems = getAlinhamento(s.estilo.paragrafo.textAlign);
        if (s.tipo === 'Música') {
            var reduced = tA.reduce((resultado, t) => {
                var vezes = nRepetidor(t);
                if (vezes) {
                    resultado[resultado.length-1].repeticoes = vezes;
                } else {
                    resultado.push({estrofe: t});
                }
                return resultado;
            }, []);
            spans = reduced.map(getConteudoWraper)
        } else {
            spans = tA.map((t, i) => getSpan(t, i, null, true))
        } 
    }
    return (
        <div className='container-estrofe' style={estiloDivEstrofe}>
            {spans} 
        </div>
    );
}


const nRepetidor = str => {
    if (/\$\d\$/.test(str))
        return Number(str.replace(/\$/g,''));
    return 0;
}