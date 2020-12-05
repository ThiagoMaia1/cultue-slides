export function getCoords(elem, x = 0, y = 0) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    var width = elem.offsetWidth;
    var height = elem.offsetHeight;

    left = left + x*width;
    top = top + y*height;

    return { top: Math.round(top), left: Math.round(left) };
}

export function canvasTextWidth(texto, fontStyle) {
    var canvas = canvasTextWidth.canvas || (canvasTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = fontStyle;
    var metrics = context.measureText(texto);
    return metrics.width;
  }
  
export function capitalize (string, caseTexto) {

    const primeiraMaiuscula = string => {
        if (typeof string !== 'string') return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    switch (caseTexto) {
        case 'Maiúsculas':
        return string.toUpperCase();
        case 'Minúsculas':
        return string.toLowerCase();
        case 'Primeira Maiúscula':
        return primeiraMaiuscula(string);
        default:
        return string;
    }
}
  
export function retiraAcentos(str) {
    var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    var novastr='';
    for(var i = 0; i < str.length; i++) {
        var troca = false;
        for (var a = 0; a < com_acento.length; a++) {
            if (str.substr(i,1) === com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca=true;
                break;
            }
        }
        if (!troca) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
}  

export const multiplicarArray = (array, rate) => array.map(c => c*rate); 

// const getNomeId = nome => getNomeInterfaceTipo(nome).toLowerCase().replace(' ', '-');

// const getNomeCamel = nome => nome.toLowerCase().replace(/-[a-z]/g, c => c.replace('-', '').toUpperCase());

export function inteiroAleatorio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const randomPosNeg = () => {
    var i;
    do {
        i  = inteiroAleatorio(-1, 2);
    } while (i === 0);
    return i;
}

export function inverterString(str) {
    return str.split('').reverse().join('');
}

export function objetosSaoIguais(objeto, ...objetos) {
    objeto = JSON.stringify(objeto);
    for (var o of objetos) {
        if (JSON.stringify(o) !== objeto) {
            return false;
        }
    }
    return true;
}

export const getImgBase64 = (img, frameW = null, frameH = null, callback = null) => {
    if (!frameW) frameW = img.width;
    if (!frameH) frameH = img.width;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var iw = img.width;
    var ih = img.height;
    var scale = Math.max((frameW/iw), (frameH/ih));
    var wScaled = frameW/scale;
    var hScaled = frameH/scale;
    canvas.width = frameW;
    canvas.height = frameH;
    ctx.drawImage(img, (iw - wScaled)/2, (ih - hScaled)/2, wScaled, hScaled, 0, 0, frameW, frameH);
    var dataURL = canvas.toDataURL('image/png');
    if (callback) callback(dataURL);
    return dataURL;
}