import { useEffect, useRef } from 'react';

const useOutsideClick = callback => {
    let ref = useRef();
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target))
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