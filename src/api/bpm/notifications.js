import { socket } from '../../contexts/socket-context';
import { bpmServer } from './bpm-server';

export async function getNotifications() {
    const data = await bpmServer
        .api()
        .url(`api/notifications`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function createNotification(body) {
    const response = await bpmServer
        .api()
        .url(`api/notifications`)
        .post(body)
        .res((response) => {
            const room = body.user ? body.user : body.role;
            socket.emit('notify', room);
            return response;
        });

    return Promise.resolve(response);
}

export async function deleteNotification(id) {
    const response = await bpmServer
        .api()
        .url(`api/notifications`)
        .query({ id })
        .delete()
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}
