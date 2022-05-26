import { bpmServer } from './bpm-server';

export async function getUsers() {
    const data = await bpmServer
        .api()
        .url(`api/users`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function getCurrentUser() {
    const data = await bpmServer
        .api()
        .url(`api/users/me`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data[0]);
}
