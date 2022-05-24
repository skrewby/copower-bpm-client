import { bpmServer } from './bpm-server';

export async function getLeadSources() {
    const data = await bpmServer
        .api()
        .url(`api/info/lead-sources`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}
