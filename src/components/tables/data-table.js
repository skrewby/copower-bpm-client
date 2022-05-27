import Proptypes from 'prop-types';

// Material UI
import {
    Box,
    Divider,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@mui/material';

// Local imports
import { Pagination } from './pagination';
import { ResourceError } from './resource-error';
import { ResourceUnavailable } from './resource-unavailable';

/**
 * Table that can be used to display data like leads, installs and services
 */
export const DataTable = (props) => {
    const {
        error,
        columns,
        data,
        dataCount,
        rowFunction,
        isLoading,
        onPageChange,
        onSortChange,
        page,
        sort,
        sortBy,
        size,
    } = props;

    const displayLoading = isLoading;
    const displayError = Boolean(!isLoading && error);
    const displayUnavailable = Boolean(!isLoading && !error && !data?.length);

    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
            }}
        >
            <Table sx={{ minWidth: 1000, height: 'fit-content' }} size={size}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>
                                <TableSortLabel
                                    active={sortBy === column.id}
                                    direction={
                                        sortBy === column.id ? sort : 'asc'
                                    }
                                    disabled={isLoading}
                                    onClick={(event) =>
                                        onSortChange(event, column.id)
                                    }
                                >
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>{data.map(rowFunction)}</TableBody>
            </Table>
            {displayLoading && (
                <Box sx={{ p: 2 }}>
                    <Skeleton height={42} />
                    <Skeleton height={42} />
                    <Skeleton height={42} />
                </Box>
            )}
            {displayError && (
                <ResourceError
                    error={error}
                    sx={{
                        flexGrow: 1,
                        m: 2,
                    }}
                />
            )}
            {displayUnavailable && (
                <ResourceUnavailable
                    sx={{
                        flexGrow: 1,
                        m: 2,
                    }}
                />
            )}
            <Divider sx={{ mt: 'auto' }} />
            <Pagination
                disabled={isLoading}
                onPageChange={onPageChange}
                page={page}
                rowsCount={dataCount}
            />
        </Box>
    );
};

DataTable.defaultProps = {
    data: [],
    dataCount: 0,
    page: 1,
    size: 'medium',
};

DataTable.propTypes = {
    /** The data to display */
    data: Proptypes.array,
    /** How many data points were passed */
    dataCount: Proptypes.number,
    /** The function that is passed inside the data.map function to determine how to display rows*/
    rowFunction: Proptypes.func,
    /** The definition for columns to display and the data they access */
    columns: Proptypes.array,
    error: Proptypes.string,
    isLoading: Proptypes.bool,
    onPageChange: Proptypes.func,
    onSortChange: Proptypes.func,
    page: Proptypes.number,
    selectedInvoices: Proptypes.array,
    sort: Proptypes.oneOf(['asc', 'desc']),
    sortBy: Proptypes.string,
    size: Proptypes.oneOf(['small', 'medium']),
};
