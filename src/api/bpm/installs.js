import { parseISO } from 'date-fns';

// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getInstalls(options) {
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
        .url('api/installs')
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
            !_install.customer.name
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_install.customer.email
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_install.customer.phone
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_install.sold_by.name
                ?.toLowerCase()
                .includes(query.toLowerCase()) &&
            !_install.property.address
                ?.toLowerCase()
                .includes(query.toLowerCase())
        ) {
            return false;
        }

        // No need to look for any resource fields
        if (typeof view === 'undefined' || view === 'all') {
            return true;
        }

        // In this case, the view represents the resource status
        return _install.status.label === view;
    });
    const filteredInstalls = applyFilters(queriedInstalls, filters);
    const sortedInstalls = applySort(filteredInstalls, sort, sortBy);

    if (download) {
        return Promise.resolve({
            installs: sortedInstalls,
            installsCount: filteredInstalls.length,
        });
    }

    const paginatedInstalls = applyPagination(sortedInstalls, page);

    return Promise.resolve({
        installs: paginatedInstalls,
        installsCount: filteredInstalls.length,
    });
}

export async function getInstall(id) {
    const data = await bpmServer
        .api()
        .url(`api/installs`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function updateInstall(id, values) {
    const response = await bpmServer
        .api()
        .url(`api/installs`)
        .query({ id })
        .put(values)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createInstall(body) {
    const response = await bpmServer
        .api()
        .url(`api/installs`)
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createInstallDirectly(body) {
    const response = await bpmServer
        .api()
        .url(`api/installs/quick-add`)
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function createInstallLog(id, entry, action) {
    const body = {
        content: entry,
        action: action,
    };

    const response = await bpmServer
        .api()
        .url(`api/installs/logs`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getInstallLogs(id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/logs`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function addItemToInstall(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/installs/system`)
        .query({ id })
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function getInstallSystemItems(id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/system`)
        .query({ id })
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function editInstallSystemItem(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/installs/system`)
        .query({ id })
        .put(body)
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function deleteInstallSystemItem(id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/system`)
        .query({ id })
        .delete()
        .res((response) => {
            return response;
        });

    return Promise.resolve(response);
}

export async function addFileToInstall(id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/files`)
        .query({ id })
        .post({ file_id })
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getInstallFiles(id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/files`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteFileFromInstall(install_id, file_id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/files`)
        .query({ install_id, file_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}

export async function addExtraToInstall(id, body) {
    const response = await bpmServer
        .api()
        .url(`api/installs/extras`)
        .query({ id })
        .post(body)
        .res((response) => response);

    return Promise.resolve(response);
}

export async function getInstallExtras(id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/extras`)
        .query({ id })
        .get()
        .json((response) => response);

    return Promise.resolve(response);
}

export async function deleteExtraFromInstall(install_id, extra_id) {
    const response = await bpmServer
        .api()
        .url(`api/installs/extras`)
        .query({ install_id, extra_id })
        .delete()
        .res((response) => response);

    return Promise.resolve(response);
}

export async function updateInstallExtra(install_id, extra_id, body) {
    const response = await bpmServer
        .api()
        .url(`api/installs/extras`)
        .query({ install_id, extra_id })
        .put(body)
        .res((response) => response);

    return Promise.resolve(response);
}
