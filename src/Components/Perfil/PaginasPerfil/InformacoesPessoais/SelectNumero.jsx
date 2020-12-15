import React from 'react';

const opcoes = [
    'Menos de 10', 
    'Entre 10 e 25', 
    'Entre 25 e 50', 
    'Entre 50 e 100', 
    'Entre 100 e 200', 
    'Entre 200 e 500', 
    'Entre 500 e 1000', 
    'Mais de 1000'
]

export default function SelectNumero (props) {
    return (
        <select id={props.id} onChange={props.onChange}>
            {opcoes.map(o => (
                <option key={o} value={o}>{o}</option>
            ))}
        </select>
    )
}