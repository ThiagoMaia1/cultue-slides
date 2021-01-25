import React, { Fragment, useRef } from 'react';
import { getTextoVersiculo } from './TextoPreview';
import store from '../../index';
import './Estrofes.css';

const divBreak = <div><br></br></div>;

const SpanEstrofe = ({t, texto, i, eVersiculo = false, versoAnterior, editavel, onInput, ativarRealce, slidePreview}) => {
        
    let ref = useRef();
    let {temVers, temCap, temLivro} = slidePreview.estilo.paragrafo;
    let versoTem = {temVers, temCap, temLivro}
    let referencia
    if (eVersiculo) {
        referencia = getTextoVersiculo(t, versoAnterior, versoTem, true, !i);
        referencia.pop();
    }
    return (
        <span className={'container-estrofe' + (!eVersiculo ? ' estrofe-area' : '')}
              onClick={() => {
                  ativarRealce('paragrafo');
                  ref.current.focus();
              }}>
            {!eVersiculo ? null :
                <span className='numero-verso'><>{referencia}</></span>
            }
            <span className='estrofe-editavel'
                  id={'textoArray-' + i}
                  ref={ref}
                  contentEditable={editavel} 
                  suppressContentEditableWarning='true'
                  onBlur={e => {
                    onInput({...t, texto: e.target.innerText}, 'textoArray', i);
                  }}
            >
                {texto} 
            </span>
        </span>
    )
};

const Repetidor = ({repeticoes, i}) => {
    return (
        <span className='marcador-estrofe'>
            <span>✕</span>
            <input style={{width: String(repeticoes).split('').length*2 + 'vw'}}
                   value={repeticoes}
                   type='number'
                   onChange={e => store.dispatch({type: 'editar-slide', objeto: 'repeticoes', numero: i, valor: e.target.value})}/>
        </span>
    )
}

export default function Estrofes(props) {
    var s = props.slidePreview;
    var tA = s.textoArray;
    var spans;
    var estiloDivEstrofe;
    let sel = s.selecionado;
    let key = sel.elemento + '.' + sel.slide + '.';
    
    const getConteudoWraper = (t, i) => (
        <Fragment key={i}>
            {i ? divBreak : null}
            <div className='wraper-estrofe'>
                <SpanEstrofe key={key + i} t={t} i={i} texto={t.texto} {...props}/>
                {!s.estilo.paragrafo.multiplicadores || (t.repeticoes || 1) < 2 ? null :
                    <Repetidor repeticoes={t.repeticoes} i={i}/>
                }
            </div>
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
            <SpanEstrofe t={t} key={key + i} i={i} texto={t.texto} eVersiculo={!s.eMestre} versoAnterior={i ? tA[i-1] : s.versoAnterior} {...props}/>
        )
    } else {
        estiloDivEstrofe = {display: 'flex', width: '100%', flexDirection: 'column'};
        estiloDivEstrofe.alignItems = getAlinhamento(s.estilo.paragrafo.textAlign);
        if (s.tipo === 'Música') spans = tA.map(getConteudoWraper)
        else spans = tA.map((t, i) => <SpanEstrofe t={t} key={key + i} i={i} texto={t.texto} {...props}/>)
    }
    return (
        <div className='container-estrofes' style={estiloDivEstrofe}>
            {spans} 
        </div>
    );
}