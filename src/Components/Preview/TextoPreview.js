import React from 'react';
import { RefInvalida } from "../TextoBiblico/referenciaBiblica"

// export class Element {
//     constructor(apiKey, tipo, titulo, texto) {
//       idElement++;
//       this.id = idElement;
//       this.apiKey = apiKey;
//       this.tipo = tipo;
//       this.titulo = titulo;
//       this.texto = texto;
//     }
//   }

// function textoPreview (elemento) {
//     var textoDividido = [];
//     switch (elemento.tipo) {
//         case 'Bíblia':
//             formatarVersiculos(elemento.texto);
//         case 'Música':
//             formatarMusica(elemento.texto);
//         case 'Título':

//         case 'Imagem':

//     }
// }

export function formatarVersiculos(versiculos) {
    return versiculos.map((v, i) => {
        if (v instanceof RefInvalida) {
            return (<><br></br><br></br><div className="itens" style={{backgroundColor:'#ffcccc', color:'red'}}><b>{v.texto}</b></div></>)
        }
        var r = [];
        var l = (<><b>{v.livro} </b></>);
        var c = (<><br></br><br></br><b>{v.cap}:</b></>);
        if (i === 0) {
            r.push(l, c);
        } else {
            if (v.livro !== versiculos[i-1].livro) {
                r.push(<><br></br><br></br></>, l, c);
            } else if (v.cap !== versiculos[i-1].cap) {
                r.push(c);
            }
        } 
        r.push(<><b>{v.vers}</b> {v.texto} </>);
        return r;
    })
}