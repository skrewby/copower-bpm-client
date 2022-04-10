import { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Box,
    Checkbox,
    Divider,
    Link,
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
import { Status } from '../status';

const columns = [
    {
        id: 'install_id',
        label: 'ID',
    },
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'address',
        label: 'Address',
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
        label: 'Updated',
    },
    {
        id: 'status',
        label: 'Status',
    },
];

export const InstallsTable = (props) => {
    const {
        error,
        installs: installsProp,
        installsCount,
        isLoading,
        onPageChange,
        onSortChange,
        page,
        sort,
        sortBy,
    } = props;
    const [installs, setInstalls] = useState(installsProp);
    let navigate = useNavigate();

    useEffect(() => {
        setInstalls(installsProp);
    }, [installsProp]);

    const displayLoading = isLoading;
    const displayError = Boolean(!isLoading && error);
    const displayUnavailable = Boolean(
        !isLoading && !error && !installs?.length
    );

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
                    {installs.map((install) => {
                        return (
                            <TableRow
                                hover
                                key={install.install_id}
                                onClick={() => {
                                    navigate(
                                        `/bpm/installs/${install.install_id}`
                                    );
                                }}
                            >
                                <TableCell>{install.install_id}</TableCell>
                                <TableCell>{install.name}</TableCell>
                                <TableCell>{install.address}</TableCell>
                                <TableCell>{install.email}</TableCell>
                                <TableCell>{install.phone}</TableCell>
                                <TableCell>
                                    {format(install.create_date, 'dd MMM yyyy')}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        install.last_updated,
                                        'dd MMM yyyy'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Status
                                        color={install.status_colour}
                                        label={install.status}
                                    />
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
                rowsCount={installsCount}
            />
        </Box>
    );
};

InstallsTable.defaultProps = {
    installs: [],
    installsCount: 0,
    page: 1,
    sort: 'desc',
    sortBy: 'id',
};

InstallsTable.propTypes = {
    installs: Proptypes.array,
    installsCount: Proptypes.number,
    error: Proptypes.string,
    isLoading: Proptypes.bool,
    onPageChange: Proptypes.func,
    onSortChange: Proptypes.func,
    page: Proptypes.number,
    selectedInvoices: Proptypes.array,
    sort: Proptypes.oneOf(['asc', 'desc']),
    sortBy: Proptypes.string,
};
