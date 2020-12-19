const css = 
    'body {' +
        '--azul-forte: lightgray;' +   
        '--azul-fraco: lightgray;' +   
        '--azul-oxford: lightgray;' +   
        'background-color: var(--platinum);' +   
    '}' +
    'body * {' +
        'pointer-events: none !important;' +   
    '}' +
    '.gradiente-coluna {' +
        'background-image: none !important;' + 
    '}' +
    '#borda-slide-mestre, .coluna-lista-slides {' +
        'opacity: 0.4;' + 
    '}'

var styleSheet;

export default status =>
    status
        ? !styleSheet || removerStyleSheet()
        : incluirStyleSheet()

const incluirStyleSheet = () => {
    styleSheet = document.createElement('style');
    styleSheet.innerHTML = css;
    document.head.appendChild(styleSheet);
}

const removerStyleSheet = () => {
    styleSheet.remove();
    styleSheet = null;
}
