import { parseISO } from 'date-fns';

// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getLeads(options) {
    const {
        filters,
        sort,
        sortBy,
        page,
        query,
        view,
        download = false,
    } = options;

    const data = await bpmServer
        .api()
        .url('api/leads')
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
        // If query exists, it looks in the following parameters
        if (
            !!query &&
            !_lead.first_name?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.last_name?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.address?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.phone?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.company_name?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.company_abn?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.sales?.toLowerCase().includes(query.toLowerCase()) &&
            !_lead.reference?.toLowerCase().includes(query.toLowerCase())
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

    if (download) {
        return Promise.resolve({
            leads: sortedLeads,
            leadsCount: filteredLeads.length,
        });
    }

    const paginatedLeads = applyPagination(sortedLeads, page);

    return Promise.resolve({
        leads: paginatedLeads,
        leadsCount: filteredLeads.length,
    });
}

export async function getLead(id) {
    const data = await bpmServer
        .api()
        .url(`api/leads`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data[0]);
}

export async function updateLead(id, values) {
    const response = await bpmServer
        .api()
        .url(`api/leads`)
        .query({ id })
        .put(values)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createLead(body) {
    const response = await bpmServer
        .api()
        .url(`api/leads`)
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createLeadLog(id, entry, action) {
    const body = {
        content: entry,
        action: action,
    };

    const response = await bpmServer
        .api()
        .url(`api/leads/logs`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getLeadLogs(id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/logs`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function addItemToLead(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/leads/system`)
        .query({ id })
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function getLeadSystemItems(id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/system`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function editLeadSystemItem(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/leads/system`)
        .query({ id })
        .put(body)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function deleteLeadSystemItem(id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/system`)
        .query({ id })
        .delete()
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function addFileToLead(id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/files`)
        .query({ id })
        .post({ file_id })
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getLeadFiles(id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/files`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteFileFromLead(lead_id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/files`)
        .query({ lead_id, file_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}

export async function addExtraToLead(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/leads/extras`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getLeadExtras(id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/extras`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteExtraFromLead(lead_id, extra_id) {
    const response = await bpmServer
        .api()
        .url(`api/leads/extras`)
        .query({ lead_id, extra_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}

export async function updateLeadExtra(lead_id, extra_id, body) {
    const response = await bpmServer
        .api()
        .url(`api/leads/extras`)
        .query({ lead_id, extra_id })
        .put(body)
        .res((response) => response);

    return Promise.resolve(response);
}
