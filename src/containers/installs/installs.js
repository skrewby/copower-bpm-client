import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';

// Material UI
import {
    Box,
    Container,
    TableCell,
    TableRow,
    Tooltip,
    IconButton,
    Typography,
    Divider,
    Card,
} from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

// Local import
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

// Components
import { DataTable } from '../../components/tables/data-table';
import { Filter } from '../../components/tables/filter';
import { Status } from '../../components/tables/status';

const views = [
    {
        label: 'Show all',
        value: 'all',
    },
    {
        label: 'Awaiting Deposit',
        value: 'Awaiting Deposit',
    },
    {
        label: 'PTC',
        value: 'PTC',
    },
    {
        label: 'Schedule',
        value: 'Schedule',
    },
    {
        label: 'Review',
        value: 'Review',
    },
    {
        label: 'Awaiting Payment',
        value: 'Awaiting Payment',
    },
    {
        label: 'Retailer Notification',
        value: 'Retailer Notification',
    },
    {
        label: 'STC',
        value: 'STC',
    },
    {
        label: 'Complete',
        value: 'Complete',
    },
    {
        label: 'Cancelled',
        value: 'Cancelled',
    },
];

const filterProperties = [
    {
        label: 'Created Date',
        name: 'createdDate',
        type: 'date',
    },
    {
        label: 'Last Updated',
        name: 'updatedDate',
        type: 'date',
    },
    {
        label: 'Status',
        name: 'status',
        type: 'string',
    },
    {
        label: 'Install Date',
        name: 'installDate',
        type: 'date',
    },
];

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
        id: 'company_name',
        label: 'Company Name',
    },
    {
        id: 'address',
        label: 'Address',
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

export const Installs = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'createdDate',
        view: 'all',
    });
    const [installsState, setInstallsState] = useState({ isLoading: true });
    let navigate = useNavigate();

    const getData = useCallback(async () => {
        setInstallsState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getInstalls({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });

            if (mounted.current) {
                setInstallsState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInstallsState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [
        controller.filters,
        controller.page,
        controller.query,
        controller.sort,
        controller.sortBy,
        controller.view,
        mounted,
    ]);

    useEffect(() => {
        getData().catch(console.error);
    }, [controller, getData]);

    const handleViewChange = (newView) => {
        setController({
            ...controller,
            page: 0,
            view: newView,
        });
    };

    const handleQueryChange = (newQuery) => {
        setController({
            ...controller,
            page: 0,
            query: newQuery,
        });
    };

    const handleFiltersApply = (newFilters) => {
        const parsedFilters = newFilters.map((filter) => ({
            property: filter.property.name,
            value: filter.value,
            operator: filter.operator.value,
        }));

        setController({
            ...controller,
            page: 0,
            filters: parsedFilters,
        });
    };

    const handleFiltersClear = () => {
        setController({
            ...controller,
            page: 0,
            filters: [],
        });
    };

    const handlePageChange = (newPage) => {
        setController({
            ...controller,
            page: newPage - 1,
        });
    };

    const handleSortChange = (event, property) => {
        const isAsc =
            controller.sortBy === property && controller.sort === 'asc';

        setController({
            ...controller,
            page: 0,
            sort: isAsc ? 'desc' : 'asc',
            sortBy: property,
        });
    };

    const mapFunction = (install) => {
        return (
            <TableRow hover key={install.install_id}>
                <TableCell>{install.install_id}</TableCell>
                <TableCell>{install.customer.name}</TableCell>
                <TableCell>{install.customer.company}</TableCell>
                <TableCell>{install.property.address}</TableCell>
                <TableCell>{install.customer.phone}</TableCell>
                <TableCell>
                    {format(install.create_date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                    {format(install.last_updated, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                    <Status
                        color={install.status.colour}
                        label={install.status.label}
                    />
                </TableCell>
                <TableCell>
                    <Tooltip title="Install details">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                navigate(`/bpm/installs/${install.install_id}`);
                            }}
                            size="large"
                            sx={{ order: 3 }}
                        >
                            <ArrowForwardOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <>
            <Helmet>
                <title>Installs | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Box sx={{ py: 4 }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                            }}
                        >
                            <Typography color="textPrimary" variant="h4">
                                Installs
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                        </Box>
                    </Box>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                        }}
                        variant="outlined"
                    >
                        <Filter
                            disabled={installsState.isLoading}
                            filters={controller.filters}
                            onFiltersApply={handleFiltersApply}
                            onFiltersClear={handleFiltersClear}
                            onQueryChange={handleQueryChange}
                            onViewChange={handleViewChange}
                            query={controller.query}
                            view={controller.view}
                            views={views}
                            filterProperties={filterProperties}
                        />
                        <Divider />
                        <DataTable
                            columns={columns}
                            rowFunction={mapFunction}
                            error={installsState.error}
                            data={installsState.data?.installs}
                            dataCount={installsState.data?.installsCount}
                            isLoading={installsState.isLoading}
                            onPageChange={handlePageChange}
                            onSortChange={handleSortChange}
                            page={controller.page + 1}
                            sort={controller.sort}
                            sortBy={controller.sortBy}
                            size="small"
                        />
                    </Card>
                </Container>
            </Box>
        </>
    );
};
