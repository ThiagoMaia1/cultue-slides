const styleSheet = '.slide-ativo {z-index: 20;}' +
             '.preview-fake {background-color: white; position: absolute}' +
             '#ativar-tela-cheia {opacity: 0.2; right: 4vh; bottom: 4vh; width: 10vh; height: 10vh;}' +
             '#ativar-tela-cheia:hover {opacity: 0.8;}' + 
             '.tampao {z-index: 1;}' + 
             '.texto-preview {z-index: 2;}';

export default function TratarDadosHTML(copiaDOM) {

    var botoesTelaCheia = [...copiaDOM.querySelectorAll('#ativar-tela-cheia')];
    var botaoTelaCheia = botoesTelaCheia[0].outerHTML;
    for (var i of botoesTelaCheia) {i.remove();}
    var setasMovimento = [...copiaDOM.querySelectorAll('.container-setas')];
    var setaMovimento = setasMovimento[1].outerHTML;
    for (var j of setasMovimento) {j.remove();}
    var slides = [...copiaDOM.querySelectorAll('.preview-fake')];
    var slidesHtml = slides.map(s => s.outerHTML);
    copiaDOM.body.innerHTML = slidesHtml.join('');
    var css = copiaDOM.createElement("style"); //Inserir arquivo CSS no DOM.
    css.type = 'text/css';
    css.innerHTML = styleSheet;
    copiaDOM.head.appendChild(css);
    return {copiaDOM: copiaDOM, botaoTelaCheia: botaoTelaCheia, setaMovimento: setaMovimento};

}