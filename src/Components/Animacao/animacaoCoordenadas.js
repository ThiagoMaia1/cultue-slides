// Recebe coordenadas atuais do elemento a ser animado, coordenadas limite de alvo, e uma proporcao para mvoer no sentido y de forma diferente do x.
// Retorn as coordenadas novas ou false se já atingiu as coordenadas limite.

const animacaoCoordenadas = (coordenadasAtuais, coordenadasLimite, proporcaoY) => {
    if (JSON.stringify(coordenadasAtuais) === JSON.stringify(coordenadasLimite)) 
        return false;
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

export default animacaoCoordenadas;