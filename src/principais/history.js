import { createBrowserHistory } from 'history';
export const mensagemHistory = 'mudar-location';

const history = createBrowserHistory();

if(window.self !== window.top) history.listen(({pathname}) => {
    window.parent.postMessage({
        type: mensagemHistory, 
        pathname
    });
})

export default history;

export const getIdHash = location => {
    return location.hash.replace('#/','').split('?')[0];
}