import livros from 'Livros.json';

livrosOriginal = Object.assign({},livros);

for (var livro of livros) {
    livro.name = livro.name.replace("º","ª").replace("ª",'');
    var nomeSNumero = livro.name.replace(/[1-3]/g,'').replace("ª ","").replace("º ","");
    var sAcento = livro.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    livro.abbrevPt = livro.abbrev.pt;
    livro.abbrev = [livro.abbrev.pt.toLowerCase(),
        livro.abbrev.en.toLowerCase(),
        livro.name.substr(0,5).toLowerCase(),
        livro.name.substr(0,4).toLowerCase(),
        livro.name.substr(0,3).toLowerCase(), 
        livro.name.substr(0,2).toLowerCase(),
        livro.name.substr(0,1).toLowerCase(),
        nomeSNumero.substr(0,5).toLowerCase(), 
        nomeSNumero.substr(0,4).toLowerCase(),
        nomeSNumero.substr(0,3).toLowerCase(), 
        nomeSNumero.substr(0,2).toLowerCase(),
        nomeSNumero.substr(0,1).toLowerCase(),
        livro.name.toLowerCase(),
        sAcento.toLowerCase(),
        sAcento.replace(/[aeiou]/gi,'').toLowerCase(),
        livro.abbrev.pt.replace("1", "1 ").replace("2","2 ").replace("3","3 ").toLowerCase(),
        livro.abbrev.pt.replace("1", "primeira ").replace("2","segunda ").toLowerCase(),
        livro.abbrev.pt.replace(/[1-3/]/g,'').toLowerCase()
    ]
}

for (var livro of livros) {
    var a = livro.abbrev.length
    for (var i = 0; i<a; i++) {
        livro.abbrev[i] = livro.abbrev[i].trim();
        livro.abbrev = [...livro.abbrev, (retira_acentos(livro.abbrev[i]))]
    }
    livro.abbrev = livro.abbrev.filter(a => (isNaN(a)))
}
for (var livro of livros) { 
    const set = new Set(livro.abbrev)
    livro.abbrev = [...set];
}
console.log(livros);

function retira_acentos(str) 
{

    var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    var novastr="";
    for(var i = 0; i<str.length; i++) {
        var troca = false;
        for (var a = 0; a < com_acento.length; a++) {
            if (str.substr(i,1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca=true;
                break;
            }
        }
        if (troca==false) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
}  

livros = Object.assign({},livrosOriginal);
