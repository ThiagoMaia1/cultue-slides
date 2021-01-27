import useMousePosition from './useMousePosition';

const useTilt = (ref, taxa, iframe) => {
    let centro = [];
    if (ref.current) {
        var rect = ref.current.getBoundingClientRect();
        centro = [
            rect.left + rect.width/2,
            rect.top + rect.height/2
        ]
    }
    let coordenadas = useMousePosition(undefined, iframe);
    let tamanho = [window.innerWidth, window.innerHeight];
    let angulo = coordenadas.map((c, i) => 
        (i*2-1)*taxa*100*(-c - centro[i] + tamanho[i]/2)/tamanho[i]
    );
    let transform = `perspective(1000px) rotateX(${angulo[1]}deg) rotateY(${angulo[0]}deg)`;
    return transform;
};

export default useTilt;