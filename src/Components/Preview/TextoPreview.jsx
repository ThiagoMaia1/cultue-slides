import React from 'react';
import { RefInvalida } from "../Popup/PopupsAdicionar/TextoBiblico/referenciaBiblica";
import {listaSuperscritos} from '../../principais/Constantes';

function numSuperscrito(num) {
    var lista = String(num).split('');
    var sup = [];
    for (var n of lista) {
        sup.push(listaSuperscritos[Number(n)]);
    }
    return sup.join('');
}

function superscritoPrevia(num) {
    return <sup>{num}</sup>;
}

export function markupParaSuperscrito (texto) {
    var splitado = texto.split('<sup>');
    if (splitado.length < 2) return texto;
    var numero = Number(splitado[1].split('</sup>')[0]);
    return texto.replace(/<sup>.*<\/sup>/g, numSuperscrito(numero));
}

export function reverterSuperscrito(sup) {
    var lista = String(sup).split('');
    var num = [];
    for (var n of lista) {
        var i = listaSuperscritos.indexOf(n)
        if (i > -1) {
            num.push(i);
        } 
    }
    if (num.length === 0) return;
    return num.join('');
}

export function getNumeroVersiculo(texto) {
    var verso;
    var n = -1;
    var palavras = texto.split(' ');
    do {
        n++;
        verso = reverterSuperscrito(palavras[n]);
    } while (isNaN(verso) && !(n >= palavras.length))
    return {textoAntes: palavras.slice(0, Math.max(n,0)).join(' '), numero: verso, textoDepois: palavras.slice(n+1).join(' ')};
}

export const getTextoVersiculo = (verso, versoAnterior = {}, versoTem = {}, sup, primeiro) => {
    
    if (!verso.vers) return verso;
    let v = [{...versoAnterior}, {...verso}]
    
    let funcaoSuperscrito = sup 
                            ? superscritoPrevia
                            : numSuperscrito
    let espaco = '';
    
    const tem = obj => {
        let ind = 'tem' + obj.split('').map((c, i) => i > 0 ? c : c.toUpperCase()).join('');
        if(obj === 'vers' && versoTem[ind]) {
            espaco = ' ';
            return funcaoSuperscrito(v[1].vers);
        }
        if(v[0][obj] !== v[1][obj] && versoTem[ind]) 
            return v[1][obj] + ' ';
        return '';
    }

    const keysVersiculo = ['livro', 'cap', 'vers'];
    let final = keysVersiculo
        .reduce((resultado, k) => 
            resultado.concat(tem(k))
        , []);
    final.push(espaco);
    final.push(v[1].texto);
    final = final.filter(t => !!t);
    if(!primeiro) final.unshift(' ');
    return sup 
           ? final
           : final.join('');
}

// export function formatarVersiculosSlide(versiculos) {
//     return versiculos.map((v, i) => {
//         var r = numSuperscrito(v.vers) + ' ' + v.texto + ' ';
//         var c = v.cap + ' ';
//         var l = v.livro + ' ';
//         if (i === 0) {
//             r = l + c + r;
//         } else {
//             if (v.livro !== versiculos[i-1].livro) {
//                 r = '\n\n' + l + c + r;
//             } else if (v.cap !== versiculos[i-1].cap) {
//                 r = c + r;
//             }
//         } 
//         return r;
//     })
// }

export function formatarVersiculos(versiculos) {
    return versiculos.map((v, i) => {
        if (v instanceof RefInvalida) {
            return (
                <div>
                    <br></br><br></br>
                    <div className="itens versiculos referencia-invalida">
                        <b>{v.texto}</b>
                    </div>
                </div>
            )
        }
        var r = [];
        var l = (<><b>{v.livro} </b></>);
        var c = (<><br></br><br></br><b>{v.cap} </b></>);
        if (i === 0) {
            r.push(l, c);
        } else {
            if (v.livro !== versiculos[i-1].livro) {
                r.push(<><br></br><br></br></>, l, c);
            } else if (v.cap !== versiculos[i-1].cap) {
                r.push(c);
            }
        } 
        r.push(<><b>{superscritoPrevia(v.vers)}</b> {v.texto} </>);
        return <span>{r}</span>;
    })
}