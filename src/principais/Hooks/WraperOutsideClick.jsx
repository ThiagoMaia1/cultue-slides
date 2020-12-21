import React from 'react';
import useOutsideClick from './useOutsideClick';

const WraperOutsideClick = ({Component}) => {
    
    let ref = useOutsideClick();

    return (
        <Component ref={ref}/>
    )
}