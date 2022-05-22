import wretch from 'wretch';

import { bpmServer } from './bpm-server';

export async function login(email, password) {
    const res = await bpmServer
        .api()
        .url('auth/login')
        .post({ email, password })
        .json((response) => {
            window.sessionStorage.setItem('idToken', response.idToken);
            console.log('Logged in (api/bpm/auth.js)');
            bpmServer.notify(response.idToken);
        });

    return Promise.resolve(res);
}
