import wretch from 'wretch';
import firebase from '../lib/firebase';

import { parseISO, subDays } from 'date-fns';
import { throttle } from '../config';
import { applyFilters } from '../utils/apply-filters';
import { applyPagination } from '../utils/apply-pagination';
import { applySort } from '../utils/apply-sort';
import { wait } from '../utils/wait';

// Heroku
// const server_url =  https://copower-server.herokuapp.com/api

const server_url = 'http://localhost:5000/api';

// Cross origin authenticated requests on an external API
const api = wretch()
    // Set the base url
    .url(server_url)
    // Cors fetch options
    .options({ mode: 'cors' });

class BPMAPi {
    /* ------------------------------------------------------------------------------------
                                            USERS
    --------------------------------------------------------------------------------------- */
    async getUsers(options) {
        const data = await api
            .url('/users')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getCurrentUser(options) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();
        const data = await api
            .url('/user')
            .auth(`Bearer ${fb_auth.token}`)
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
        const response = await api
            .url('/leads')
            .auth(`Bearer ${fb_auth.token}`)
            .post(lead)
            .json((id) => id[0]);

        return response;
    }

    async getLeads(options) {
        const { filters, sort, sortBy, page, query, view } = options;
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url('/leads')
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        const leads = data.map((lead) => {
            lead.create_date = parseISO(lead.create_date);
            lead.last_updated = parseISO(lead.last_updated);
            return lead;
        });

        const queriedLeads = leads.filter((_lead) => {
            // If query exists, it looks in lead name and address
            if (
                !!query &&
                !_lead.first_name
                    ?.toLowerCase()
                    .includes(query.toLowerCase()) &&
                !_lead.last_name?.toLowerCase().includes(query.toLowerCase()) &&
                !_lead.address?.toLowerCase().includes(query.toLowerCase())
            ) {
                return false;
            }

            // No need to look for any resource fields
            if (typeof view === 'undefined' || view === 'all') {
                return true;
            }

            // In this case, the view represents the resource status
            return _lead.status === view;
        });
        const filteredLeads = applyFilters(queriedLeads, filters);
        const sortedLeads = applySort(filteredLeads, sort, sortBy);
        const paginatedLeads = applyPagination(sortedLeads, page);

        return Promise.resolve({
            leads: paginatedLeads,
            leadsCount: filteredLeads.length,
        });
    }

    async getLead(id) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url(`/leads/${id}`)
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        return Promise.resolve(data[0]);
    }

    async updateLead(id, values) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();
        console.log(values);
        const response = await api
            .url(`/leads/${id}`)
            .auth(`Bearer ${fb_auth.token}`)
            .put(values)
            .res((response) => response);

        return response;
    }

    async getLeadLogs(id) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url(`/leads/${id}/logs`)
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        return Promise.resolve(data);
    }

    async createLeadLog(id, entry, action) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const body = {
            content: entry,
            action: action,
        };

        const response = await api
            .url(`/leads/${id}/logs`)
            .auth(`Bearer ${fb_auth.token}`)
            .post(body)
            .res((response) => response);

        return response;
    }

    /* ------------------------------------------------------------------------------------
                                            INSTALLS
    --------------------------------------------------------------------------------------- */
    async getInstalls(options) {
        const { filters, sort, sortBy, page, query, view } = options;
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url('/installs')
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        const installs = data.map((install) => {
            install.create_date = parseISO(install.create_date);
            install.last_updated = parseISO(install.last_updated);
            return install;
        });

        const queriedInstalls = installs.filter((_install) => {
            if (
                !!query &&
                !_install.name?.toLowerCase().includes(query.toLowerCase()) &&
                !_install.email?.toLowerCase().includes(query.toLowerCase()) &&
                !_install.phone?.toLowerCase().includes(query.toLowerCase()) &&
                !_install.address?.toLowerCase().includes(query.toLowerCase())
            ) {
                return false;
            }

            // No need to look for any resource fields
            if (typeof view === 'undefined' || view === 'all') {
                return true;
            }

            // In this case, the view represents the resource status
            return _install.status === view;
        });
        const filteredInstalls = applyFilters(queriedInstalls, filters);
        const sortedInstalls = applySort(filteredInstalls, sort, sortBy);
        const paginatedInstalls = applyPagination(sortedInstalls, page);

        return Promise.resolve({
            installs: paginatedInstalls,
            installsCount: filteredInstalls.length,
        });
    }

    async getInstall(id) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url(`/installs/${id}`)
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        return Promise.resolve(data[0]);
    }

    async createInstall(install) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();
        const response = await api
            .url('/installs')
            .auth(`Bearer ${fb_auth.token}`)
            .post(install)
            .json((id) => id[0]);

        return response;
    }

    async getInstallLogs(id) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url(`/installs/${id}/logs`)
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        return Promise.resolve(data);
    }

    async createInstallLog(id, entry, action) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const body = {
            content: entry,
            action: action,
        };

        const response = await api
            .url(`/installs/${id}/logs`)
            .auth(`Bearer ${fb_auth.token}`)
            .post(body)
            .res((response) => response);

        return response;
    }

    /* ------------------------------------------------------------------------------------
                                            CUSTOMERS
    --------------------------------------------------------------------------------------- */
    async getCustomer(id) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url(`/customers/${id}`)
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        return Promise.resolve(data[0]);
    }

    /* ------------------------------------------------------------------------------------
                                            PROPERTIES
    --------------------------------------------------------------------------------------- */
    async getProperty(id) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();

        const data = await api
            .url(`/properties/${id}`)
            .auth(`Bearer ${fb_auth.token}`)
            .get()
            .json((response) => {
                return response;
            });

        return Promise.resolve(data[0]);
    }

    async updateProperty(id, values) {
        const fb_auth = await firebase.auth().currentUser.getIdTokenResult();
        
        const response = await api
            .url(`/properties/${id}`)
            .auth(`Bearer ${fb_auth.token}`)
            .put(values)
            .res((response) => response);

        return response;
    }

    /* ------------------------------------------------------------------------------------
                                            INFO
    --------------------------------------------------------------------------------------- */
    async getLeadSources(options) {
        const data = await api
            .url('/lead_sources')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getLeadStatusOptions(options) {
        const data = await api
            .url('/lead_status')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getPhasesOptions(options) {
        const data = await api
            .url('/phases')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getStoryOptions(options) {
        const data = await api
            .url('/stories')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getRoofTypeOptions(options) {
        const data = await api
            .url('/roof_types')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getRoofPitchOptions(options) {
        const data = await api
            .url('/roof_pitch')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }

    async getExistingSystemOptions(options) {
        const data = await api
            .url('/existing_system')
            .get()
            .json((response) => {
                return response;
            });

        return data;
    }
}

export const bpmAPI = new BPMAPi();
