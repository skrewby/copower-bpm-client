import { bpmServer } from './bpm-server';

export async function login(email, password) {
    const res = await bpmServer
        .api()
        .url('auth/login')
        .post({ email, password })
        .json((response) => {
            window.sessionStorage.setItem('idToken', response.idToken);
            bpmServer.notify({ idToken: response.idToken });
        });

    return Promise.resolve(res);
}

export async function logout() {
    window.sessionStorage.removeItem('idToken');
    bpmServer.notify();

    return Promise.resolve();
}
