import React from 'react';
import './Checkbox.css';

export default function Checkbox(props) {
    
    const { checked, label, onClick, size, style } = props;
    const disabled = props.disabled ? 'disabled' : '';

    console.log(size);
    return (
        <div className='checkbox' onClick={onClick} style={style}>
            <input type="checkbox" checked={checked} disabled={disabled} style={{width: size, height: size}}/>
            <label className='label-checkbox' style={disabled ? {color: 'gray'} : null}>
                {label}
            </label>
        </div>
    );

}