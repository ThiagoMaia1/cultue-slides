// Recebe coordenadas atuais do elemento a ser animado, coordenadas limite de alvo, e uma proporcao para mvoer no sentido y de forma diferente do x.
// Retorn as coordenadas novas ou false se já atingiu as coordenadas limite.

export const animacaoCoordenadas = (coordenadasAtuais, coordenadasLimite, proporcaoY) => {
    if (JSON.stringify(coordenadasAtuais) === JSON.stringify(coordenadasLimite)) 
        return coordenadasAtuais;
    var coordenadas = coordenadasAtuais;
    var sentido = coordenadas.map((c, i) => {
        if (c > coordenadasLimite[i]) {
            return -1;
        } else if (c < coordenadasLimite[i]) {
            return +1;
        } else {
            return 0;
        }
    });
    for (var c = 0; c < 4; c++) {
        if (c === 1 || c === 3) sentido[c] = sentido[c]*proporcaoY;
        if ((c === 1 || c === 3) && Math.abs(coordenadas[c] - coordenadasLimite[c]) <= proporcaoY) {
            coordenadas[c] = coordenadasLimite[c];
        } else {
            coordenadas[c] += sentido[c];
        }
    }
    return coordenadas;
}

export const toggleAnimacao = (coordenadasAtuais, coordenadasFechado, coordenadasAberto, callbackRepetida, callbackCondicional = null, funcaoCondicao = null, proporcaoY= null) => {
    var limite = JSON.stringify(coordenadasAtuais) !== JSON.stringify(coordenadasFechado) ? 
                     coordenadasFechado : 
                     coordenadasAberto;
    proporcaoY = proporcaoY || Math.min((100 - coordenadasAberto[3] - coordenadasAberto[1])/(100 - coordenadasAberto[0] - coordenadasAberto[2]), 4);
        var animacao = setInterval(() => {
            var coordenadas = animacaoCoordenadas(coordenadasAtuais, limite, proporcaoY);
            if (funcaoCondicao && callbackCondicional) {
                if (funcaoCondicao(coordenadas)) {
                    callbackCondicional(true);
                } else {
                    callbackCondicional(false);
                }
            }
            if (JSON.stringify(coordenadas) === JSON.stringify(limite)) clearInterval(animacao)
            callbackRepetida(coordenadas);
        }, 10);
}
