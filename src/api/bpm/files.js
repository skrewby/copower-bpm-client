import { bpmServer } from './bpm-server';

export async function getFile(id) {
    const data = await bpmServer
        .api()
        .url(`api/files`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function addFile(body) {
    const response = await bpmServer
        .api()
        .url(`api/files`)
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function deleteFile(id) {
    const res = await bpmServer
        .api()
        .url(`api/files`)
        .query({ id })
        .delete()
        .res((response) => {
            return response;
        });

    return Promise.resolve(res);
}

export async function downloadFile(id, filename) {
    await bpmServer
        .api()
        .url(`api/files/download`)
        .query({ id })
        .get()
        .blob((file) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([file]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}`);

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        });

    return Promise.resolve();
}
