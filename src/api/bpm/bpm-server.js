import { useNavigate } from 'react-router-dom';
import wretch from 'wretch';

class Server {
    constructor() {
        this.observer = [];
        this.server_url = process.env.REACT_APP_SERVER_URL;
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

    uploadURL() {
        const url = `${this.server_url}api/upload`;
        return url;
    }

    api() {
        const bpmServer = wretch()
            // Set the base url
            .url(this.server_url)
            // Cors fetch options
            .options({ credentials: 'include', mode: 'cors' })
            .auth(`Bearer ${window.sessionStorage.getItem('idToken')}`)
            .catcher(401, async (error, request) => {
                const tokens = await wretch()
                    .url(`${this.server_url}auth/refresh`)
                    .options({ credentials: 'include', mode: 'cors' })
                    .get()
                    .json((res) => res);

                window.sessionStorage.setItem('idToken', tokens.idToken);
                this.notify(tokens);
                return request
                    .auth(`Bearer ${window.sessionStorage.getItem('idToken')}`)
                    .replay()
                    .unauthorized((err) => {
                        window.sessionStorage.removeItem('idToken');
                        this.notify();
                        const { navigate } = useNavigate();
                        navigate(`/login`);
                    })
                    .json();
            });
        return bpmServer;
    }
}

export const bpmServer = new Server();
