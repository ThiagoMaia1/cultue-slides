import React, { useState } from 'react';
import './BotaoInfo.css';
import { AiOutlineInfoCircle } from 'react-icons/ai';

const BotaoInfo = ({mensagem}) => {
    let [info, setInfo] = useState(false);
    return (
        <div className='container-info' 
             onMouseOver={() => setInfo(true)} 
             onMouseLeave={() => setInfo(false)}>
            <AiOutlineInfoCircle size={18}/>
            {!info ? null :
                <div className='caixa-info'>
                    {mensagem}
                </div>
            }
        </div>
    )
}

export default BotaoInfo;