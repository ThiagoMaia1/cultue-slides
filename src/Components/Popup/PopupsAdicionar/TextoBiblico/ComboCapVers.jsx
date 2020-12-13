// import React, { Component } from 'react';

// class ComboCapVers extends Component {

//     constructor (props) {
//         super(props);
//     }

//     limitarInput(e) {

//     }

//     render (){
//         return (
//             <input className='combo-popup' type="text" list="versiculos"
//                 onKeyUp={e => this.limitarInput(e, this.props.num)} />
//             <datalist id='versiculos'>
//                 {this.criarLista(this.state.comboVersos)}
//             </datalist>  
//         )
//     }
// }


























 // criarLista(num){
    //     var r = []
    //     for (var i = 1; i <= num; i++) {
    //         r.push(<option key={i} value={i}></option>);
    //     }
    //     return r;
    // }

    // numVersiculos(ref) {

    // }

    // limitarInput(e, max, min = 1) {
    //     var v = e.target.value;
    //     var w = e.which;
    //     var n = Number(v);
    //     if (w !== 8 && (w < 48 || w > 57)) {
    //         v = v.replace(/\D/g, '');
    //     } else if (n-1 > max || n < min){
    //         alert('Referência Inválida');
    //         v = v.replace(/\D/g, '');
    //     }
    //     if (w === 13) {

    //     }
    // }

    /* <input className='combo-popup' type="text" list="capitulos" 
                    onKeyUp={e => this.limitarInput(e, this.state.comboCapInicial, )}/>
                <datalist id='capitulos'>
                    {this.criarLista(this.state.comboCaps)}
                </datalist>
                <input className='combo-popup' type="text" list="versiculos"
                    onKeyUp={e => this.limitarInput(e, this.state.comboCaps)} />
                <datalist id='versiculos'>
                    {this.criarLista(this.state.comboVersos)}
                </datalist>                      */