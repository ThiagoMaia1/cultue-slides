import React from 'react';
import { createStore } from 'redux';
import SlideFormatado from './SlideFormatado';

const initial = {present: {selecionado: {}}};

const reducerRedividir = (state = initial, action) => {
    switch (action.type) {
        case 'atualizar-slide-preview':
            let {ratio, slidePreview} = action;
            return {...state, slidePreview, ratio};
        default:
            return state;
    }
}

export const storeRedividir = createStore(reducerRedividir);

const idPreview = 'container-preview-invisivel';

export default function PreviewRedividir() {
    let { slidePreview } = storeRedividir.getState();
    return ( 
        <>
            {!slidePreview ? null :
                <div id={idPreview} className={idPreview}> 
                    <SlideFormatado 
                        slidePreview={slidePreview}
                        className='preview-fake'
                        editavel={false}
                        proporcao={1}
                    />
                </div>
            }
        </>
    )
}