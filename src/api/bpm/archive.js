// Local imports
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { bpmServer } from './bpm-server';

export async function getArchive(options) {
    const { filters, sort, sortBy, page, query, view } = options;

    const data = await bpmServer
        .api()
        .url('api/archives')
        .get()
        .json((response) => {
            return response;
        });

    const queriedData = data.filter((_data) => {
        if (
            !!query &&
            !_data.first_name?.toLowerCase().includes(query.toLowerCase()) &&
            !_data.last_name?.toLowerCase().includes(query.toLowerCase()) &&
            !_data.phone?.toLowerCase().includes(query.toLowerCase()) &&
            !_data.email?.toLowerCase().includes(query.toLowerCase()) &&
            !_data.address?.toLowerCase().includes(query.toLowerCase())
        ) {
            return false;
        }

        return true;
    });
    const filteredData = applyFilters(queriedData, filters);
    const sortedData = applySort(filteredData, sort, sortBy);
    const paginatedData = applyPagination(sortedData, page);

    return Promise.resolve({
        archives: paginatedData,
        archivesCount: filteredData.length,
    });
}
