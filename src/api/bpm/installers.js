import { bpmServer } from './bpm-server';

export async function getInstallers() {
    const data = await bpmServer
        .api()
        .url(`api/installers`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function updateInstaller(id, data) {
    const response = await bpmServer
        .api()
        .url(`api/installers`)
        .query({ id })
        .put(data)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createInstaller(data) {
    const response = await bpmServer
        .api()
        .url(`api/installers`)
        .post(data)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}
