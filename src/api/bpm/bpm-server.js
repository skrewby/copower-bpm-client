import wretch from 'wretch';

const serverRemote = process.env.REACT_APP_SERVER_URL;
const serverLocal = 'http://localhost:5000/';
const server_url = serverRemote ?? serverLocal;

// Cross origin authenticated requests on an external API
export const bpmServer = wretch()
    // Set the base url
    .url(server_url)
    // Cors fetch options
    .options({ mode: 'cors' });
