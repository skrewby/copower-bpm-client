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

export async function getPhaseOptions() {
    const data = await bpmServer
        .api()
        .url(`api/info/phases`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function getExistingSystemOptions() {
    const data = await bpmServer
        .api()
        .url(`api/info/existing-system`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function getStoryOptions() {
    const data = await bpmServer
        .api()
        .url(`api/info/stories`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function getRoofTypeOptions() {
    const data = await bpmServer
        .api()
        .url(`api/info/roof-types`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function getLeadStatusOptions() {
    const data = await bpmServer
        .api()
        .url(`api/info/lead-status`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}
