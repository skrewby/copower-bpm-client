import wretch from "wretch"
import firebase from '../lib/firebase';

// Cross origin authenticated requests on an external API
const api = wretch()
    // Set the base url
    .url("http://localhost:3001/api")
    // Cors fetch options
    .options({ mode: "cors" });

class BPMAPi {
    /* ------------------------------------------------------------------------------------
                                            USERS
    --------------------------------------------------------------------------------------- */
    async getUsers(options) {
        const data = await api.url("/users")
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    /* ------------------------------------------------------------------------------------
                                            LEADS
    --------------------------------------------------------------------------------------- */
    async createLead(lead) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();
        const response = await api.url("/leads")
            .auth(`Bearer ${fb_auth.token}`)
            .post(lead)
            .res(response => response);

        console.log(response);
    }

    /* ------------------------------------------------------------------------------------
                                            INFO
    --------------------------------------------------------------------------------------- */
    async getLeadSources(options) {
        const data = await api.url("/lead_sources")
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getLeadStatusOptions(options) {
        const data = await api.url("/lead_status")
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }
}

export const bpmAPI = new BPMAPi();