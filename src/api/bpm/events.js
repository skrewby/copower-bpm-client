import { bpmServer } from './bpm-server';

export async function getEvents() {
    const data = await bpmServer
        .api()
        .url(`api/events`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function createEvent(body) {
    const response = await bpmServer
        .api()
        .url(`api/events`)
        .post(body)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function updateEvent(id, values) {
    const response = await bpmServer
        .api()
        .url(`api/events`)
        .query({ id })
        .put(values)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function deleteEvent(id) {
    const response = await bpmServer
        .api()
        .url(`api/events`)
        .query({ id })
        .delete()
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}
