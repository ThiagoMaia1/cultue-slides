import { useEffect, useRef } from 'react';

const useOutsideClick = (callback, permitirClickPopup = false) => {
    let ref = useRef();
    const handleClick = e => {
        if (
            (ref.current && !ref.current.contains(e.target)) && 
            !(permitirClickPopup && 
                [...document.querySelectorAll('.popup')]
                    .reduce((resultado, el) => resultado || el.contains(e.target), false)
            )
        )
            callback();
    };

    useEffect(() => {   
        document.addEventListener('mouseup', handleClick);
        return () => {
            document.removeEventListener('mouseup', handleClick);
        };
    });
    return ref;
};

export default useOutsideClick;