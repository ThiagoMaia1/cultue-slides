import { listaDirecoes } from './Constantes';

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

export function separarCamelCase(nome) {
    nome = nome.split('');
    for (var i = 1; i < nome.length; i++) {
      if(/[A-Z]/.test(nome[i])) {
        nome.splice(i, 0, [' ']);
        i++;
      }
    }
    return nome.join('');
}

export const getNomeCss = nome => separarCamelCase(nome).toLowerCase().replace(' ', '-');

export const getNomeCamel = nome => nome.toLowerCase().replace(/-[a-z]/g, c => c.replace('-', '').toUpperCase());

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

export function eObjetoVazio(objeto) {
  return JSON.stringify(objeto) === "{}";
}

export const getImgBase64 = (img, frameW = null, frameH = null, callback = null, radius = null, flipH = null, flipV = null) => {
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
    let [x, y] = [(iw - wScaled)/2, (ih - hScaled)/2];
    arredondarCtx(ctx, radius, canvas.width, canvas.height, 0, 0);
    inverterCtx(ctx, flipH, flipV, canvas);
    ctx.drawImage(img, x, y, wScaled, hScaled, 0, 0, frameW, frameH);
    var dataURL = canvas.toDataURL('image/png');
    if (callback) callback(dataURL);
    return dataURL;
}

const arredondarCtx = (ctx, radius = 0, width, height, x, y) => {
    radius = Math.min(radius*2, Math.min(width, height)/2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
}

const inverterCtx = (ctx, flipH, flipV, canvas) => {
    let sentidoX = flipH ? -1 : 1;
    let sentidoY = flipV ? -1 : 1;
    let originX = flipH ? canvas.width : 0;
    let originY = flipV ? canvas.height : 0;
    if (flipH || flipV)
        ctx.setTransform(sentidoX, 0, 0, sentidoY, originX, originY);
}

export const eEmailValido = enderecoEmail => {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(enderecoEmail);
}

export function downScaleImage(img, scale) {
    var imgCV = document.createElement('canvas');
    imgCV.width = img.width;
    imgCV.height = img.height;
    var imgCtx = imgCV.getContext('2d');
    imgCtx.drawImage(img, 0, 0);
    return downScaleCanvas(imgCV, scale);
}

// scales the canvas by (float) scale < 1
// returns a new canvas containing the scaled image.
function downScaleCanvas(cv, scale) {
    if (!(scale < 1) || !(scale > 0)) throw new Error('scale must be a positive number <1 ');
    var sqScale = scale * scale; // square scale = area of source pixel within target
    var sw = cv.width; // source image width
    var sh = cv.height; // source image height
    var tw = Math.floor(sw * scale); // target image width
    var th = Math.floor(sh * scale); // target image height
    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
    var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b
    /* untested !
    var sA = 0;  //source alpha  */    

    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; // y src position within target
        tY = 0 | ty;     // rounded : target pixel's y
        yIndex = 3 * tY * tw;  // line index within target array
        crossY = (tY !== (0 | ty + scale)); 
        if (crossY) { // if pixel is crossing botton target pixel
            wy = (tY + 1 - ty); // weight of point within target pixel
            nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale; // x src position within target
            tX = 0 |  tx;    // rounded : target pixel's x
            tIndex = yIndex + tX * 3; // target pixel index within target array
            crossX = (tX !== (0 | tx + scale));
            if (crossX) { // if pixel is crossing target pixel's right
                wx = (tX + 1 - tx); // weight of point within target pixel
                nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
            }
            sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

            /* !! untested : handling alpha !!
               sA = sBuffer[sIndex + 3];
               if (!sA) continue;
               if (sA != 0xFF) {
                   sR = (sR * sA) >> 8;  // or use /256 instead ??
                   sG = (sG * sA) >> 8;
                   sB = (sB * sA) >> 8;
               }
            */
            if (!crossX && !crossY) { // pixel does not cross
                // just add components weighted by squared scale.
                tBuffer[tIndex    ] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) { // cross on X only
                w = wx * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tX+1) px                
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) { // cross on Y only
                w = wy * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tY+1) px                
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else { // crosses both x and y : four target points involved
                // add weighted component for current px
                w = wx * wy;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // for tX + 1; tY px
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                // for tX ; tY + 1 px
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                // for tX + 1 ; tY +1 px
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        } // end for sx 
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV.toDataURL();
}

export function hslToRgb({h, s, l}) {
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
    return {r, g, b, a: 1};
}

export function rgbToHsl({r, g, b}) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    // Calculate hue
    // No difference
    if (delta === 0)
        h = 0;
    // Red is max
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {h, s, l};
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

export function componentToHex(c = 0) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  
export function rgbToHex({r, g, b}) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function rgbObjToStr({r, g, b, a}) {
    return 'rgba(' + [r, g, b, a === undefined ? 1 : a].join(', ') + ')'
}

export function rgbStrToObject(str) {
    let keys = ['r', 'g', 'b', 'a'];
    let rgbObj = cssColorStrToObject(str, keys)
    if (rgbObj.a === undefined) rgbObj.a = 1;
    return rgbObj;
}

export function hslStrToObject(str) {
    let keys = ['h', 's', 'l'];
    let hslObj = cssColorStrToObject(str, keys)
    return hslObj;
}

export function cssColorStrToObject(str, keys) {
    let array = str.replace(/[^0-9, ]/g, '').split(/(?:,| )+/);
    let objKeys = array.reduce((obj, a, i) => {
        let k = keys[i];
        obj[k] = Number(a);
        if (isNaN(obj[k])) obj[k] = 0; 
        return obj;
    }, {});
    return objKeys;
}

export const parseCorToRgb = cor => {
    if(typeof cor === 'string') {
        if(/rgb/.test(cor))
            cor = rgbStrToObject(cor);
        else if(/hsl/.test(cor))
            cor = hslStrToObject(cor);
        else if(/#/.test(cor)) 
            cor = hexToRgb(cor);
        else 
            cor = null;
    } else if(typeof cor === 'object') {
        let keys = Object.keys(cor);
        if (keys.includes('h'))
            cor = hslToRgb(cor);
        else if(cor.rgb)
            cor = cor.rgb;
        else if (!keys.includes('r'))
            cor = null;
    }
    return cor || null;
}

export function invertColor(hex, blackOrWhite) {
    if (hex.indexOf('#') === 0)
        hex = hex.slice(1);
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3)
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) {
        return '#000';
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (blackOrWhite) {
        console.log(r, g, b, r * 0.299 + g * 0.587 + b * 0.114)
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}
  
export const getBackgroundImageColor = color => 'linear-gradient(' + color + ', ' + color + ')';

export const getStrPercentual = decimal => {
    if(typeof decimal === 'string' && /%/.test(decimal)) return decimal;
    return Number(decimal).toFixed(2)*100 + '%';
}

export const numeroEntre = (limiteInferior, num, limiteSuperior) => num >= limiteInferior && num <= limiteSuperior;

export const comparacaoComMargem = (num, comparativo, margem) => numeroEntre(comparativo - margem, num, comparativo + margem);

export const limitarMinMax = (limiteInferior, num, limiteSuperior) => Math.min(Math.max(num, limiteInferior), limiteSuperior);

export const arredonarParaMultiplo = (num, multiplo) => Math.round(num/multiplo)*multiplo;

export function toggleFullscreen (element = null) {        
    
    if (document.fullscreenElement || !element) {
        document.exitFullscreen()
        .catch(function(error) {
            console.log(error.message);
        });
    } else {
        element.requestFullscreen()
        .catch(function(error) {
            console.log(error.message);
        });
    }
}

export const getObjectByStringPath = (object, path) => {
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot
    var a = path.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in object) {
            object = object[k];
        } else {
            return;
        }
    }
    return object;
}

export const diferencaArrays = (arrayMaior, arrayMenor) => arrayMaior.filter(a => !arrayMenor.includes(a));

export const mudancasArrays = (arrayNovo, arrayAntigo) => ({
    acrescentar: diferencaArrays(arrayNovo, arrayAntigo),
    remover: diferencaArrays(arrayAntigo, arrayNovo)
})


export const downloadArquivo = (nomeArquivo, blob) => {
    let elemx = window.document.createElement('a');
    elemx.href = window.URL.createObjectURL(blob); // ! createObjectURL
    elemx.download = nomeArquivo;
    elemx.style.display = 'none';
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
}
  
export const downloadArquivoTexto = function(nomeArquivo, conteudoArquivo) {
    let blob = new Blob([conteudoArquivo], { type: 'text/plain' }); // ! Blob
    downloadArquivo(nomeArquivo, blob);
}

export const removerPorcentagem = str => {
    if (typeof str === 'string' && /%/.test(str))
        str = Number(str.replace('%',''))/100;
    if (typeof str === 'number' && !isNaN(str))
        return str;
    return 0;
}

export const getInset = origem => {
    if (!origem) origem = {};
    return listaDirecoes.reduce((resultado, d) => {
        resultado[d] = getStrPercentual(origem[d]) || 0;
        return resultado;
    }, {})
};

const insetVazio = getInset();

export const getInsetNum = insetImagem => {
    var inset = {...insetVazio, ...insetImagem};
    var semPorcentagem = {};
    for (var l of listaDirecoes) {
        semPorcentagem[l] = removerPorcentagem(inset[l]);
    }
    return semPorcentagem; 
}

export const maximoDivisorComum = (a, b) => {
    if (b === 0) return a;
    return maximoDivisorComum (b, a % b)
}

export const arredondar = (num, base) => Math.round((num + Number.EPSILON) * base) / base;

export const arredondarFixo = (num, n) => arredondar(num, 10**n);

export const arredondarStep = (num, step) => arredondar(num, 1/step);