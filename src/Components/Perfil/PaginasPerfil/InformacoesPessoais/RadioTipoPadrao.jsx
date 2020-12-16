import React from 'react';

const opcoes = [
    {nome: 'Apenas Estilo', valor: 'estilo'},
    {nome: 'Apresentação Completa', valor: 'tudo'},
]

export default function RadioTipoPadrao (props) {
    return (
        <div id={props.id}>
            {opcoes.map(o => {
                let id = 'radio-' + o.valor
                return (
                    <div key={o.nome} className='radio-e-label'>
                        <input type='radio' id={id}
                            name='Tipo de Apresentação Padrão' value={o.valor} onChange={props.onChange} checked={props.value === o.valor}/>
                        <label className='label-checkbox' for={id}>{o.nome}</label>
                    </div>
                )
            })}
        </div>
    )
}