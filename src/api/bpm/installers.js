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

export async function getInstaller(id) {
    const data = await bpmServer
        .api()
        .url(`api/installers`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data[0]);
}

export async function addFileToInstaller(id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/installers/files`)
        .query({ id })
        .post({ file_id })
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getInstallerFiles(id) {
    const response = await bpmServer
        .api()
        .url(`api/installers/files`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteFileFromInstaller(installer_id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/installers/files`)
        .query({ installer_id, file_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}
