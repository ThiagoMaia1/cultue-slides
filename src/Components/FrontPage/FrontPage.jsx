import React, {useState, useRef} from 'react';
import { MdSignalCellularNull } from 'react-icons/md';
import './FrontPage.css';

const descricao = "Um aplicativo gratuito e online para criar slides para o culto. Nunca foi tão fácil e rápido criar apresentações de slides para sua igreja. Com o Cultue, você só precisa digitar o que quer incluir, e pode montar sua apresentação de slides em poucos minutos. O acesso é totalmente gratuito e online, não preciso instalar nada. Suas apresentações ficam salvas na nuvem, e podem ser acessadas de qualquer lugar. Pesquise letras de música, insira textos bíblicos, imagens, vídeo, salve estruturas personalizadas para sua apresentação. Após salvar suas preferências fica ainda mais fácil criar a apresentação. Além disso, com o Cultue Premium, você pode criar a apresentação com apenas um clique, basta colar a lista de conteúdos que você quer na apresentação, e sua apresentação pronta aparecerá na tela. Você pode exibir a apresentação online, ou baixar para usar offline em HTML ou PowerPoint. Também pode compartilhar a apresentação por link. Além disso, o cultue possui diversos atalhos que facilitam o uso do programa. Nós sabemos que a igreja tem várias necessidades, então queremos te ajudar a economizar tempo. Você faz os slides bem mais rápido e tem mais tempo para servir à igreja. Encontre qualquer letra de música com nossa pesquisa vagalume. As letras das músicas gospel estão a apenas um clique! Cansado de gastar tempo cortando e colando vários pedacinhos do texto bíblico pra dividir entre os slides? O cultue divide automaticamente o conteúdo dos slides pra se encaixar perfeitamente na sua formatação. Altere a fonte, e os slides se redividem automaticamente. Alternativa a holyrics. Alternativa a ProPresenter 6. Alternativa a Easyworship. Alternativa a Easyslides. Alternativa a Adoreslides. Alternativa a OpenLP. Alternativa a Data Show Praise. Alternativa a Super Cânticos. Alternativa a Opensong. Alternativa a datamusic. Alternativa a WL Show. Alternativa a PowerPoint. Alternativa a Adore Slides. Culture Slides"

const coresQuadrados = ['azul-forte', 'azul-claro', 'cinza'];
const secoes = [
    {texto: 'Nunca foi tão fácil e rápido criar apresentações de slides para sua igreja.', imagem: 'Aquarela'},
    {texto: 'Pesquise qualquer música, e insira automaticamente na sua apresentação.', imagem: 'Bíblia'},
    {texto: 'Textos bíblicos com pesquisa rápida.', imagem: 'Campos'},
    {texto: 'Apresentações salvas na nuvem, e acessadas de qualquer lugar', imagem: 'Céu Lilás'},
    {texto: 'Exporte para uso offline ou compartilhe o link', imagem: 'Deserto'},
]

const FrontPage = () => {

    let [scroll, setScroll] = useState(0);
    let ref = useRef();
    let ref2 = useRef();
    let timeout = useRef();

    return (
        <div id='fundo-front-page' 
             onScroll={e => {
                // e.preventDefault();

                setScroll(-Math.max(e.target.scrollTop - ref2.current.offsetHeight, 0)/(ref.current.offsetHeight - window.innerHeight))
             }}
             style={{'--scroll': scroll}}>
            <div id='wraper-front-page' ref={ref}>
                <div className='cabecalho-front' ref={ref2}>

                </div>
                <div className='img-conteudo-secao'></div>
                {secoes.map(({texto}, i) => {
                    let esquerda = i % 2 === 0;
                    let vazio = <div className='conteudo-secao'/>;
                    return (
                        <div key={texto} className={'secao-front-page ' + coresQuadrados[i % 3]}>
                            {esquerda ? vazio : null}
                            <div className='conteudo-secao'>{texto}</div>
                            {esquerda ? null : vazio}
                        </div>
                    )        
                })}
            </div>
        </div>
    )
}


export default FrontPage;