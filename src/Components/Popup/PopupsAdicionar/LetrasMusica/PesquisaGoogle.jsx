import React, { Component } from 'react';

class PesquisaGoogle extends Component {
  
    componentDidMount() {
        (function() {
          var cx = 'eb73de29ad1eb8479';
          var gcse = document.createElement('script');
          gcse.type = 'text/javascript';
          gcse.async = true;
          gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(gcse, s);
        })();
      }
  render() {
    return (
        <div class="gcse-searchbox" data-resultsUrl="http://www.example.com"
             data-newWindow="true" data-queryParameterName="search"/>
    );
  }
};
  
export default PesquisaGoogle;
  