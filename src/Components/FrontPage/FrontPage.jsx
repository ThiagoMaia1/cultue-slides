import React, {useState, useRef} from 'react';
// import LogoCultue from '../Basicos/Splash/LogoCultue';
import LogoComPalavra from '../Basicos/Splash/LogoComPalavra';
import './FrontPage.css';
import '../BarraInferior/BarraInferior';
import BarraInferior from '../BarraInferior/BarraInferior';

// const descricao = "Um aplicativo gratuito e online para criar slides para o culto. Nunca foi tão fácil e rápido criar apresentações de slides para sua igreja. Com o Cultue, você só precisa digitar o que quer incluir, e pode montar sua apresentação de slides em poucos minutos. O acesso é totalmente gratuito e online, não preciso instalar nada. Suas apresentações ficam salvas na nuvem, e podem ser acessadas de qualquer lugar. Pesquise letras de música, insira textos bíblicos, imagens, vídeo, salve estruturas personalizadas para sua apresentação. Após salvar suas preferências fica ainda mais fácil criar a apresentação. Além disso, com o Cultue Premium, você pode criar a apresentação com apenas um clique, basta colar a lista de conteúdos que você quer na apresentação, e sua apresentação pronta aparecerá na tela. Você pode exibir a apresentação online, ou baixar para usar offline em HTML ou PowerPoint. Também pode compartilhar a apresentação por link. Além disso, o cultue possui diversos atalhos que facilitam o uso do programa. Nós sabemos que a igreja tem várias necessidades, então queremos te ajudar a economizar tempo. Você faz os slides bem mais rápido e tem mais tempo para servir à igreja. Encontre qualquer letra de música com nossa pesquisa vagalume. As letras das músicas gospel estão a apenas um clique! Cansado de gastar tempo cortando e colando vários pedacinhos do texto bíblico pra dividir entre os slides? O cultue divide automaticamente o conteúdo dos slides pra se encaixar perfeitamente na sua formatação. Altere a fonte, e os slides se redividem automaticamente. Alternativa a holyrics. Alternativa a ProPresenter 6. Alternativa a Easyworship. Alternativa a Easyslides. Alternativa a Adoreslides. Alternativa a OpenLP. Alternativa a Data Show Praise. Alternativa a Super Cânticos. Alternativa a Opensong. Alternativa a datamusic. Alternativa a WL Show. Alternativa a PowerPoint. Alternativa a Adore Slides. Culture Slides"

const coresQuadrados = ['azul-forte', 'azul-claro', 'cinza'];
const secoes = [
    {texto: 'Nunca foi tão fácil e rápido criar apresentações de slides para sua igreja.', imagem: 'Luzes'},
    {texto: 'Pesquise qualquer música, e insira automaticamente na sua apresentação.', imagem: 'Violão'},
    {texto: 'Textos bíblicos com pesquisa rápida.', imagem: 'Bíblia'},
    {texto: 'Apresentações salvas na nuvem, e acessadas de qualquer lugar', imagem: 'Celular'},
    {texto: 'Exporte para uso offline ou compartilhe o link', imagem: 'Carta'}
]

const botoes = [
    {apelido: 'Faça seu Login', path: 'login'},
    {apelido: 'Acesse o Sistema', path: 'main'}
]

const BotaoEntrar = ({history, botao}) => (
    <button className='botao-inicial' 
            onClick={() => history.push('/' + botao.path)}>
        {botao.apelido}
    </button>
)

const FrontPage = ({history}) => {

    let [scroll, setScroll] = useState(0);
    let ref = useRef();
    return (
        <div id='fundo-front-page' 
             onScroll={e => {
                // e.preventDefault();
                setScroll(Math.min(e.target.scrollTop, ref.current.offsetTop - window.innerHeight + 80));
             }}
             style={{'--scroll': scroll}}>
            <div id='wraper-front-page'>
                <div id='cabecalho-front'>
                    <LogoComPalavra rotate={-15 + scroll/9}/>
                    {/* <LogoCultue escala={1.8} style={{left: '55vw', top: '17vh'}} rotate={-10 + scroll/10}/> */}
                    <div className='linha-flex'>
                        {botoes.map(b => <BotaoEntrar history={history} botao={b}/>)}
                    </div>
                </div>
                {secoes.map(({texto, imagem}, i) => {
                    let esquerda = i % 2 === 0;
                    let vazio = <div className='conteudo-secao vazio'>
                        <img className='img-conteudo-secao' src={'' + require('./Imagens/' + imagem + '.jpg')} alt={imagem}/>
                    </div>;
                    return (
                        <div key={texto} className={'secao-front-page ' + coresQuadrados[i % 3]} style={{zIndex: 99-i, '--posicao': i}}>
                            {esquerda ? vazio : null}
                            <div className='conteudo-secao'>{texto}</div>
                            {esquerda ? null : vazio}
                        </div>
                    )        
                })}
                <div ref={ref}>
                    <BarraInferior/>
                </div>
            </div>
        </div>
    )
}


export default FrontPage;