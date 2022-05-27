import wretch from 'wretch';

class Server {
    constructor() {
        this.observer = [];
        this.serverRemote = process.env.REACT_APP_SERVER_URL;
        this.serverLocal = 'http://localhost:5000/';
        this.server_url = this.serverRemote ?? this.serverLocal;
    }

    subscribe(item) {
        this.observer.push(item);

        this.api()
            .url('auth/authenticated')
            .get()
            .json((response) => {
                this.notify({ idToken: response.idToken });
            })
            .catch(() => this.notify());
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
            .catcher(401, () => {
                window.sessionStorage.removeItem('idToken');
                this.notify();
            });
        return bpmServer;
    }
}

export const bpmServer = new Server();
