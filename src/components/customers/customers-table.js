import { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
import { Pagination } from '../pagination';
import { ResourceError } from '../resource-error';
import { ResourceUnavailable } from '../resource-unavailable';

const columns = [
    {
        id: 'customer_id',
        label: 'ID',
    },
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'company_name',
        label: 'Company',
    },
    {
        id: 'email',
        label: 'Email',
    },
    {
        id: 'phone',
        label: 'Phone',
    },
    {
        id: 'create_date',
        label: 'Created',
    },
    {
        id: 'last_updated',
        label: 'Last Updated',
    },
];

export const CustomersTable = (props) => {
    const {
        error,
        customers: customersProp,
        customersCount,
        isLoading,
        onPageChange,
        onSortChange,
        page,
        sort,
        sortBy,
    } = props;
    const [customers, setCustomers] = useState(customersProp);
    let navigate = useNavigate();

    useEffect(() => {
        setCustomers(customersProp);
    }, [customersProp]);

    const displayLoading = isLoading;
    const displayError = Boolean(!isLoading && error);
    const displayUnavailable = Boolean(!isLoading && !error && !customers?.length);

    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
            }}
        >
            <Table sx={{ minWidth: 1000, height: 'fit-content' }}>
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
                <TableBody>
                    {customers.map((customers) => {
                        return (
                            <TableRow
                                hover
                                key={customers.customer_id}
                                onClick={() => {
                                    navigate(`/bpm/customers/${customers.customer_id}`);
                                }}
                            >
                                <TableCell>{customers.customer_id}</TableCell>
                                <TableCell>{customers.name}</TableCell>
                                <TableCell>{customers.company_name}</TableCell>
                                <TableCell>{customers.email}</TableCell>
                                <TableCell>{customers.phone}</TableCell>
                                <TableCell>
                                    {format(customers.create_date, 'dd MMM yyyy')}
                                </TableCell>
                                <TableCell>
                                    {format(customers.last_updated, 'dd MMM yyyy')}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
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
                rowsCount={customersCount}
            />
        </Box>
    );
};

CustomersTable.defaultProps = {
    customers: [],
    customersCount: 0,
    page: 1,
    sort: 'desc',
    sortBy: 'id',
};

CustomersTable.propTypes = {
    customers: Proptypes.array,
    customersCount: Proptypes.number,
    error: Proptypes.string,
    isLoading: Proptypes.bool,
    onPageChange: Proptypes.func,
    onSortChange: Proptypes.func,
    page: Proptypes.number,
    selectedInvoices: Proptypes.array,
    sort: Proptypes.oneOf(['asc', 'desc']),
    sortBy: Proptypes.string,
};
