import { parseISO } from 'date-fns';

// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getCustomers(options) {
    const { filters, sort, sortBy, page, query, view } = options;

    const data = await bpmServer
        .api()
        .url('api/customers')
        .get()
        .json((response) => {
            return response;
        });

    const customers = data.map((customer) => {
        customer.create_date = parseISO(customer.create_date);
        customer.last_updated = parseISO(customer.last_updated);
        return customer;
    });

    const queriedLeads = customers.filter((_customer) => {
        // If query exists, it looks in lead name and address
        if (
            !!query &&
            !_customer.first_name
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_customer.last_name?.toLowerCase().includes(query.toLowerCase()) &&
            !_customer.address?.toLowerCase().includes(query.toLowerCase()) &&
            !_customer.phone?.toLowerCase().includes(query.toLowerCase()) &&
            !_customer.company_name
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_customer.company_abn
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_customer.email?.toLowerCase().includes(query.toLowerCase())
        ) {
            return false;
        }

        // No need to look for any resource fields
        if (typeof view === 'undefined' || view === 'all') {
            return true;
        }

        // In this case, the view represents the resource status
        return _customer.status === view;
    });
    const filteredLeads = applyFilters(queriedLeads, filters);
    const sortedLeads = applySort(filteredLeads, sort, sortBy);
    const paginatedLeads = applyPagination(sortedLeads, page);

    return Promise.resolve({
        customers: paginatedLeads,
        customersCount: filteredLeads.length,
    });
}

export async function getCustomer(id) {
    const data = await bpmServer
        .api()
        .url(`api/customers`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data[0]);
}

export async function updateCustomer(id, values) {
    const response = await bpmServer
        .api()
        .url(`api/customers`)
        .query({ id })
        .put(values)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createCustomer(body) {
    const response = await bpmServer
        .api()
        .url(`api/customers`)
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createCustomerLog(id, entry, action) {
    const body = {
        content: entry,
        action: action,
    };

    const response = await bpmServer
        .api()
        .url(`api/customers/logs`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getCustomerLogs(id) {
    const response = await bpmServer
        .api()
        .url(`api/customers/logs`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}
