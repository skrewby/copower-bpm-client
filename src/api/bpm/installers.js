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
