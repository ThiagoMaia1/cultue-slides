import React from 'react';

export default function Estrofes(props) {
    var s = props.slidePreview;
    var tA = s.textoArray;
    var sel = props.selecionado;
    const divBreak = <div><br></br></div>;
    var spans;
    var estiloDivEstrofe;

    const getSpan = (t, i, _array, comBreaks = false) => {
        
        var breaks = null;
        if (comBreaks) breaks = (divBreak);
        return (
            <>
                <span contentEditable={!s.eMestre && !props.eFake} id={'paragrafo-textoArray-' + sel.elemento + '-' + sel.slide + '-' + i} 
                    key={i} onInput={props.onInput} onFocus={props.onFocus}>
                {t}</span>
                {breaks}
            </>
        )
    };

    const getSpanRepetidor = vezes => {
        if (!s.estilo.paragrafo.multiplicadores)
            return null;
        return <span className='marcador-estrofe' contentEditable='true'>✕{vezes}</span>
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
        spans = tA.map(getSpan)
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