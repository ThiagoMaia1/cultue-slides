const styleSheet = '.slide-ativo {z-index: 20;}' +
             '.preview-fake {background-color: white; position: absolute}' +
             '#ativar-tela-cheia {opacity: 0.2; right: 4vh; bottom: 4vh; width: 10vh; height: 10vh;}' +
             '#ativar-tela-cheia:hover {opacity: 0.8;}' + 
             '.tampao {z-index: 1; border-radius: 0}' + 
             '.texto-preview {z-index: 2;}';

export default function TratarDadosHTML(copiaDOM) {

    var botaoTelaCheia = copiaDOM.getElementById('ativar-tela-cheia').outerHTML;
    var setaMovimento = copiaDOM.querySelectorAll('.container-setas')[0];
    setaMovimento.style.display = '';
    setaMovimento = setaMovimento.outerHTML;
    var slides = [...copiaDOM.querySelectorAll('.preview-fake')];
    var slidesHtml = slides.map(s => s.outerHTML);
    copiaDOM.body.innerHTML = slidesHtml.join('');
    var css = copiaDOM.createElement("style"); //Inserir arquivo CSS no DOM.
    css.type = 'text/css';
    css.innerHTML = styleSheet;
    copiaDOM.head.appendChild(css);
    return {copiaDOM: copiaDOM, botaoTelaCheia: botaoTelaCheia, setaMovimento: setaMovimento};

}