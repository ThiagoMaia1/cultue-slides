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

export function eObjetoVazio(objeto) {
  return JSON.stringify(objeto) === "{}";
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

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

export function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function rgbStrToObject(str) {
    let array = str.replace(/[^0-9,]/g, '').split(',');
    let keys = ['r', 'g', 'b', 'a'];
    let rgbObj = array.reduce((obj, a, i) => {
        let k = keys[i];
        obj[k] = Number(a);
        if (isNaN(obj[k])) obj[k] = 0; 
        return obj;
    }, {});
    if (rgbObj.a === undefined) rgbObj.a = 1;
    return rgbObj;
}
  
export const getBackgroundImageColor = color => 'linear-gradient(' + color + ', ' + color + ')';

export const getStrPercentual = decimal => {
    if(typeof decimal === 'string' && /%/.test(decimal)) return decimal;
    return Number(decimal).toFixed(2)*100 + '%';
}

export const numeroEntre = (limiteInferior, num, limiteSuperior) => num >= limiteInferior && num <= limiteSuperior;

export const limitarMinMax = (limiteInferior, num, limiteSuperior) => Math.min(Math.max(num, limiteInferior), limiteSuperior);

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
