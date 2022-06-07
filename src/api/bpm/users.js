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

export async function updateCurrentUser(data) {
    const response = await bpmServer
        .api()
        .url(`api/users/me`)
        .put(data)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function updateUser(id, data) {
    const response = await bpmServer
        .api()
        .url(`api/users`)
        .query({ id })
        .put(data)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createUser(data) {
    const response = await bpmServer
        .api()
        .url(`api/users`)
        .post(data)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function changePassword(data) {
    const response = await bpmServer
        .api()
        .url(`api/users/me/change-password`)
        .put(data)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}
