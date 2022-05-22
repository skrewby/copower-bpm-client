import { parseISO, subDays } from 'date-fns';

// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getLeads(options) {
    const { filters, sort, sortBy, page, query, view } = options;
    const auth = window.sessionStorage.getItem('idToken');

    const data = await bpmServer
        .api()
        .url('api/leads')
        .auth(`Bearer ${auth.token}`)
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
            !_lead.first_name?.toLowerCase().includes(query.toLowerCase()) &&
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
