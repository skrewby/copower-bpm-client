import { bpmServer } from './bpm-server';

export async function getUsers() {
    const data = await bpmServer
        .api()
        .url(`api/users`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data[0]);
}
