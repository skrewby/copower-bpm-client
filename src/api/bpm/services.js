import { parseISO } from 'date-fns';

// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getServices(options) {
    const { filters, sort, sortBy, page, query, view } = options;

    const data = await bpmServer
        .api()
        .url('api/services')
        .get()
        .json((response) => {
            return response;
        });

    const services = data.map((service) => {
        service.create_date = parseISO(service.create_date);
        if (service.visit) {
            service.visit = parseISO(service.vist);
        }
        return service;
    });

    const queriedServices = services.filter((_service) => {
        if (
            !!query &&
            !_service.customer_name
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_service.customer_email
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_service.customer_phone
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_service.address?.toLowerCase().includes(query.toLowerCase())
        ) {
            return false;
        }

        // No need to look for any resource fields
        if (typeof view === 'undefined' || view === 'all') {
            return true;
        }

        // In this case, the view represents the resource status
        return _service.status_label === view;
    });
    const filteredServices = applyFilters(queriedServices, filters);
    const sortedServices = applySort(filteredServices, sort, sortBy);
    const paginatedServices = applyPagination(sortedServices, page);

    return Promise.resolve({
        services: paginatedServices,
        servicesCount: filteredServices.length,
    });
}

export async function getService(id) {
    const data = await bpmServer
        .api()
        .url(`api/services`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data[0]);
}

export async function createService(body) {
    const response = await bpmServer
        .api()
        .url(`api/services`)
        .post(body)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}
