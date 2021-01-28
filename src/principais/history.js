import { createBrowserHistory } from 'history';
export const mensagemHistory = 'mudar-location';

const history = createBrowserHistory();
history.listen(({pathname}) => {
    if(window.self !== window.top) 
        window.parent.postMessage({type: mensagemHistory, pathname});
})

export default history;

export const getIdHash = location => {
    return location.hash.replace('#/','').split('?')[0];
}