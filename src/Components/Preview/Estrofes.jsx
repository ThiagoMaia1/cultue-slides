import React, { Fragment, useRef, useState } from 'react';
import { getTextoVersiculo } from './TextoPreview';
import './Estrofes.css';

const divBreak = <div><br></br></div>;

const SpanEstrofe = ({t, i, comBreaks = false, eVersiculo = false, versoAnterior, editavel, onInput, ativarRealce, slidePreview}) => {
        
    let ref = useRef();
    let [key, setKey] = useState(true);
    let [classes, setClasses] = useState([]);
    let rects = useRef();
    let breaks = comBreaks ? divBreak : null;
    let {temVers, temCap, temLivro} = slidePreview.estilo.paragrafo;
    let versoTem = {temVers, temCap, temLivro}
    let [texto, textoReferencia, quadro] = [t.texto, [], {}];
    let editando = ref.current === document.activeElement;   
    if(ref.current) {
        quadro = ref.current.parentNode.getBoundingClientRect();
        if(!editando) rects.current = ref.current.getClientRects();
    }
    if (eVersiculo) {
        texto = <>{getTextoVersiculo(t, versoAnterior, versoTem)}</>;
        textoReferencia = getTextoVersiculo({...t, texto: ''}, versoAnterior, versoTem);
    }
    if (editando) ref.current.innerHTML = t.texto + ' '; 
    else if (classes.length) setClasses([]);
    if(ref.current) console.log(ref.current.innerHTML);
    console.log(textoReferencia);
    return (
        <Fragment key={key}>
            {!textoReferencia.length || !editando || slidePreview.tipo !== 'TextoBíblico' ? null :
                <span className='numero-verso'><>{textoReferencia}</></span>
            }
            <span className={classes.join(' ')}
                  ref={ref}
                  contentEditable={editavel} 
                  suppressContentEditableWarning='true'
                  onFocus={() => {
                    // let r = rects.current;
                    // console.log(r, textoReferencia.length);
                    // const tolerancia = 5;
                    // let letClasses = [...classes]
                    // if (r[textoReferencia.length].left < quadro.left + tolerancia) 
                    //     letClasses.push('esquerda');
                    // let ultimo = r[r.length-1];
                    // if (ultimo.right < quadro.right - tolerancia) 
                    //     letClasses.push('nao-direita');
                    // setClasses(letClasses);
                    ativarRealce('paragrafo')
                  }}
                  onBlur={e => {
                    let txt = e.target.innerText
                    onInput({...t, texto: txt.substr(0, txt.length-1)}, 'textoArray', i);
                    setKey(!key);
                  }}
            >
                {texto} 
            </span>
            {breaks}
        </Fragment>
    )
};

export default function Estrofes(props) {
    var s = props.slidePreview;
    var tA = s.textoArray;
    var spans;
    var estiloDivEstrofe;
    let sel = s.selecionado;
    let key = sel.elemento + '.' + sel.slide + '.';

    const getSpanRepetidor = repeticoes => {
        if (!s.estilo.paragrafo.multiplicadores || repeticoes < 2)
            return null;
        return <span className='marcador-estrofe' 
                     contentEditable='true' 
                     suppressContentEditableWarning='true'
                >✕{repeticoes}
               </span>
    }
    
    const getConteudoWraper = (t, i, array) => (
        <Fragment key={i}>
            <div className='wraper-estrofe'>
                <SpanEstrofe key={key + i} t={t} i={i} comBreaks={true} {...props}/>
                {getSpanRepetidor(t.repeticoes)}
            </div>
            {i < array.length && t.texto.substr(0,4) !== '\n\n' ? divBreak : null}
        </Fragment>
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
        spans = tA.map((t, i) => 
            <SpanEstrofe t={t} key={key + i} i={i} eVersiculo={true} versoAnterior={i ? tA[i-1] : s.versoAnterior} {...props}/>
        )
    } else {
        estiloDivEstrofe = {display: 'flex', width: '100%', flexDirection: 'column'};
        estiloDivEstrofe.alignItems = getAlinhamento(s.estilo.paragrafo.textAlign);
        if (s.tipo === 'Música') spans = tA.map(getConteudoWraper)
        else spans = tA.map((t, i) => <SpanEstrofe t={t} key={key + i} i={i} comBreaks={true} {...props}/>)
    }
    return (
        <div className='container-estrofe' style={estiloDivEstrofe}>
            {spans} 
        </div>
    );
}