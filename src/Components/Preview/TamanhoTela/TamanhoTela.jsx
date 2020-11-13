const wWidth = window.screen.width;
const wHeight = window.screen.height;
export const larguraTela = Math.max(wWidth, wHeight);
export const alturaTela = Math.min(wWidth, wHeight);

export const fonteBase = {numero: 0.025*alturaTela, unidade: 'px', fontFamily: 'Noto Sans'};