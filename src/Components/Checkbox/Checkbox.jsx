import React from 'react';
import './Checkbox.css';

export default function Checkbox(props) {
    
    const { checked, label, onClick } = props;
    const disabled = props.disabled ? 'disabled' : '';

    return (
        <div className='checkbox' onClick={onClick}>
            <input type="checkbox" checked={checked} disabled={disabled}/>
            <label className='label-checkbox' style={disabled ? {color: 'gray'} : null}>
                {label}
            </label>
        </div>
    );

}