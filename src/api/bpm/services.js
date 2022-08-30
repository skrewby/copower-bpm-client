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
            service.visit = parseISO(service.visit);
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
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function updateService(id, values) {
    const response = await bpmServer
        .api()
        .url(`api/services`)
        .query({ id })
        .put(values)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function addItemToService(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/services/items`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getServiceItems(id) {
    const response = await bpmServer
        .api()
        .url(`api/services/items`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteItemFromService(service_id, item_id) {
    const response = await bpmServer
        .api()
        .url(`api/services/items`)
        .query({ service_id, item_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}

export async function updateServiceItem(service_id, item_id, body) {
    const response = await bpmServer
        .api()
        .url(`api/services/items`)
        .query({ service_id, item_id })
        .put(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function addFileToService(id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/services/files`)
        .query({ id })
        .post({ file_id })
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getServiceFiles(id) {
    const response = await bpmServer
        .api()
        .url(`api/services/files`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteFileFromService(service_id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/services/files`)
        .query({ service_id, file_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}

export async function createServiceLog(id, entry, action) {
    const body = {
        content: entry,
        action: action,
    };

    const response = await bpmServer
        .api()
        .url(`api/services/logs`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getServiceLogs(id) {
    const response = await bpmServer
        .api()
        .url(`api/services/logs`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}
