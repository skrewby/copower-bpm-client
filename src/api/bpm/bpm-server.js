import wretch from 'wretch';

class Server {
    constructor() {
        this.observer = [];
        this.serverRemote = process.env.REACT_APP_SERVER_URL;
        this.serverLocal = 'http://localhost:5000/';
        this.server_url = this.serverRemote ?? this.serverLocal;
    }

    subscribe(item) {
        console.log('Subscribed');
        this.observer.push(item);
    }

    notify(data) {
        this.observer.forEach((item) => item(data));
    }

    api() {
        const bpmServer = wretch()
            // Set the base url
            .url(this.server_url)
            // Cors fetch options
            .options({ mode: 'cors' })
            .auth(`Bearer ${window.sessionStorage.getItem('idToken')}`)
            .catcher(401, async (error, request) => {
                // Renew credentials
                const token = await wretch(`${this.server_url}auth/refresh`)
                    .get()
                    .text();
                console.log(`Refreshed token: ${token}`);
                window.sessionStorage.setItem('idToken', token);
                // Replay the original request with new credentials
                return request
                    .auth(`Bearer ${token}`)
                    .replay()
                    .unauthorized((err) => {
                        throw err;
                    })
                    .json();
            });
        return bpmServer;
    }
}

export const bpmServer = new Server();
