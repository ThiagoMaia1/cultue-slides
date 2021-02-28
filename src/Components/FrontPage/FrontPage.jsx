import React, {useState, useRef} from 'react';
import LogoComPalavra from '../Basicos/Splash/LogoComPalavra';
import './FrontPage.css';
import '../BarraInferior/BarraInferior';
import BarraInferior from '../BarraInferior/BarraInferior';
import IframeAplicacao from './IframeAplicacao';
import { useHotkeysFilter } from '../../principais/atalhos';

const coresQuadrados = ['azul-forte', 'cinza', 'azul-claro'];
const secoes = [
    {titulo: 'Economize Tempo', texto: 'Nunca foi tão fácil e rápido criar apresentações de slides para sua igreja.', imagem: 'Luzes'},
    {titulo: 'Criação Expressa', texto: 'O Cultue lê a sua lista de ordem do culto e gera automaticamente uma apresentação formatada com suas predefinições.', imagem: 'Expresso'},
    {titulo: 'Letras de Música', texto: 'Pesquise qualquer música, e insira instantaneamente na sua apresentação.', imagem: 'Violão'},
    {titulo: 'Textos Bíblicos', texto: 'Pesquise rapidamente por referências bíblicas, os slides se dividem para caber.', imagem: 'Bíblia'},
    {titulo: 'Estilo Personalizado', texto: 'Configure o estilo dos slides, e salve suas preferências para ter mais agilidade.', imagem: 'Paleta'},
    {titulo: 'Compartilhamento Fácil', texto: 'As apresentações ficam salvas na nuvem. Acesse a qualquer momento, ou exporte para uso offline.', imagem: 'Celular'}
]

const botoes = [
    {apelido: 'Faça seu Login', path: 'login'},
    {apelido: 'Acesse o Sistema', path: 'main'}
]

const BotaoEntrar = ({history, botao, animacao = true}) => (
    <button className={'botao-inicial' + (animacao ? ' animado' : '')}
            onClick={() => history.push('/' + botao.path)}>
        {botao.apelido}
    </button>
)

const FrontPage = ({history}) => {

    const acessarApp = () => history.push('/' + botoes[1].path);
    
    let [scroll, setScroll] = useState(0);
    let ref = useRef();
    useHotkeysFilter(() => false);

    return (
        <div id='fundo-front-page' 
             onScroll={e => setScroll(Math.min(e.target.scrollTop, ref.current.offsetTop - window.innerHeight + 80))}
             style={{'--scroll': scroll}}>
            <div id='wraper-front-page'>
                <div id='cabecalho-front'>
                    <button onClick={acessarApp} class='container-logo-front'>
                        <LogoComPalavra rotate={-15 + scroll/9}/>
                    </button>
                    <div className='linha-flex'>
                        {botoes.map(b => <BotaoEntrar history={history} botao={b}/>)}
                    </div>
                </div>
                {secoes.map(({titulo, texto, imagem}, i) => {
                    let esquerda = i % 2 === 0;
                    let vazio = <div className='conteudo-secao vazio'>
                        <img className='img-conteudo-secao' src={'' + require('./Imagens/' + imagem + '.jpg')} alt={imagem}
                             onClick={acessarApp}/>
                    </div>;
                    return (
                        <div key={texto} className={'secao-front-page ' + coresQuadrados[i % 3]} style={{zIndex: 99-i, '--posicao': i}}>
                            {esquerda ? vazio : null}
                            <div className='conteudo-secao'>
                                <h5>{titulo}</h5>
                                {texto}
                            </div>
                            {esquerda ? null : vazio}
                        </div>
                    )        
                })}
                <div ref={ref}>
                    <div className='diagonal'/>
                    <div id='descricao-front'>
                        <div>
                            <IframeAplicacao/> 
                        </div>
                        <div className='conteudo-secao'>
                            <h5>Cultue - Apresentações de Slides para Igrejas</h5>
                            O Cultue Slides é um sistema gratuito e online, voltado para a criação de apresentações para cultos cristãos. 
                            É uma aplicação de fácil uso, que não requer qualquer instalação ou cadastro. Clique e comece a usar agora!
                            <BotaoEntrar history={history} botao={botoes[1]} animacao={false}/>
                        </div>
                    </div>
                    <BarraInferior/>
                </div>
            </div>
        </div>
    )
}


export default FrontPage;