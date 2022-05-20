import { bpmServer } from './bpm-server';

export async function login(email, password) {
    await bpmServer
        .url('auth/login')
        .post({ email, password })
        .json((response) =>
            window.sessionStorage.setItem('idToken', response.idToken)
        );

    return Promise.resolve();
}
