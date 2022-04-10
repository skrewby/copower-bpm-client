import wretch from 'wretch';
import firebase from '../lib/firebase';

import { parseISO, subDays } from 'date-fns';
import { throttle } from '../config';
import { applyFilters } from '../utils/apply-filters';
import { applyPagination } from '../utils/apply-pagination';
import { applySort } from '../utils/apply-sort';
import { wait } from '../utils/wait';

// Cross origin authenticated requests on an external API
const api = wretch()
    // Set the base url
    .url('http://localhost:3001/api')
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
            .res((response) => response);

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
