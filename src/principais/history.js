import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
export default history;

export const getIdHash = location => {
    return location.hash.replace('#/','').split('?')[0];
}