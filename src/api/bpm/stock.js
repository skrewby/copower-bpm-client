// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getStockItems(options) {
    const { filters, sort, sortBy, page, query, view } = options;

    const data = await bpmServer
        .api()
        .url('api/stock')
        .get()
        .json((response) => {
            return response;
        });

    const queriedItems = data.filter((_item) => {
        // If query exists, it looks in lead name and address
        if (
            !!query &&
            !_item.brand?.toLowerCase().includes(query.toLowerCase()) &&
            !_item.series?.toLowerCase().includes(query.toLowerCase()) &&
            !_item.model?.toLowerCase().includes(query.toLowerCase())
        ) {
            return false;
        }

        // No need to look for any resource fields
        if (typeof view === 'undefined' || view === 'all') {
            return true;
        }

        // In this case, the view represents the resource status
        return _item.status === view;
    });
    const filteredItems = applyFilters(queriedItems, filters);
    const sortedItems = applySort(filteredItems, sort, sortBy);
    const paginatedItems = applyPagination(sortedItems, page);

    return Promise.resolve({
        items: paginatedItems,
        itemsCount: filteredItems.length,
    });
}

export async function getStockTypes() {
    const data = await bpmServer
        .api()
        .url(`api/stock/types`)
        .get()
        .json((response) => {
            return response;
        });

    return Promise.resolve(data);
}

export async function createStockItem(body) {
    const response = await bpmServer
        .api()
        .url(`api/events`)
        .post(body)
        .json((response) => {
            return response;
        });

    return Promise.resolve(response);
}
