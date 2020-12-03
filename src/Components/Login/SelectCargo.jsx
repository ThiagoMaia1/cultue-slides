import React from 'react';
import './Login.css';

const listaCargos = ['Pastor', 'Presbítero', 'Diácono', 'Líder de Jovens', 'Líder de Ministério de Mulheres',
                     'Líder de Ministério de Homens', 'Secretário(a)', 'Funcionário da Igreja', 'Membro Voluntário', 'Outro'
]

const SelectCargo = props => {

    return (
        <select id={props.id || 'cargo-usuario'} className='combo-popup' placeholder='Cargo' type='select' value={props.cargo}
            onChange={props.onChange}>
            {listaCargos.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
    );
}

export default SelectCargo;
  