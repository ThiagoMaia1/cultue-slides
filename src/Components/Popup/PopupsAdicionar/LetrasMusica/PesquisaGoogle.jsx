import React, { Component } from 'react';


class PesquisaGoogle extends Component {
  
    resultsReadyCallback = (_n, _q, _p, results, resultsDiv) => {
        for (let r of results) {
            this.props.callback(r.titleNoFormatting.replace(' - VAGALUME',''));
        }    
        resultsDiv = <></>;
        return false;
    };
    

    componentDidMount() {
        var cx = 'eb73de29ad1eb8479';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
        window.__gcse || (window.__gcse = {});
        window.__gcse.searchCallbacks = {
            web: {
                ready: this.resultsReadyCallback,
            },
        };
    }

    render() {
        return (
            <div id='box-google'>
                 <div data-gname='pesquisa-vagalume' class="gcse-searchbox"></div> 
                 <div data-gname='pesquisa-vagalume' class="gcse-searchresults" data-enableOrderBy={false} data-resultSetSize='3'></div>
            </div>
        );
    }
};
  
export default PesquisaGoogle;
  