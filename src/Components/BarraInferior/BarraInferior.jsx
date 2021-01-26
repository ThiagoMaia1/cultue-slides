import React from 'react';
import './BarraInferior.css';
import { AiFillYoutube, AiOutlineGithub } from 'react-icons/ai'
import { IoLogoFacebook, IoLogoInstagram } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import { enderecoEmail, enderecoEmailThiago } from '../../principais/Constantes';

const nomeCompleto = 'Thiago Pereira Maia';

const links = [
    {Logo: AiFillYoutube, apelido: 'Youtube', url: 'https://www.youtube.com/channel/UCU0-k6ylGjUB7RSP9J5QI9Q'},
    {Logo: IoLogoInstagram, apelido: 'Instagram', url: ''},
    {Logo: IoLogoFacebook, apelido: 'Facebook', url: ''},
    {Logo: MdEmail, apelido: enderecoEmail, url: 'mailto:' + enderecoEmail}
]

const linksThiago = [
    {Logo: AiOutlineGithub, apelido: 'GitHub', url: 'https://github.com/ThiagoMaia1'},
    {Logo: IoLogoFacebook, apelido: 'Facebook', url: 'https://www.facebook.com/thiago.p.maia/'},
    {Logo: MdEmail, apelido: enderecoEmailThiago, url: 'mailto:' + enderecoEmailThiago}
]

const LinksComLogo = ({links, children}) => (
    <div className='container-links'>
        {children}
        {links.map(({Logo, apelido, url}) => {
            // if (!url) return null;
            return (
                <div className='container-link-barra-inferior'>
                    <a href={url} target='_blank' rel='noopener noreferrer' style={{color: 'white'}}>
                        <Logo size={window.innerHeight*0.04}/>
                        <span>{apelido}</span>
                    </a>
                </div>
        )})}
    </div>
)

export default function () {
    return (
        <div id='barra-inferior'>
            <div className='sessao-horizontal-barra-inferior'>
                <div className='sessao-barra-inferior'>
                    <LinksComLogo links={links}/>
                </div>
                <div className='sessao-barra-inferior'>
                    <LinksComLogo links={linksThiago}>
                        <span className='desenvolvido-por'>Desenvolvido por {nomeCompleto}</span>
                    </LinksComLogo>
                </div>
            </div>
            <div>
                Cultue - Apresentação de Slides para Igrejas | 2021
            </div>
        </div>
    )
}