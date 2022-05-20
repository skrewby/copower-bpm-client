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
    Button,
    Typography,
    Divider,
    Card,
} from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// Local imports
import { useMounted } from '../../hooks/use-mounted';
import { onClickUrl } from '../../utils/open-link';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { DataTable } from '../../components/tables/data-table';
import { Status } from '../../components/tables/status';
import { Filter } from '../../components/tables/filter';

const columns = [
    {
        id: 'lead_id',
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
        id: 'phone',
        label: 'Phone',
    },
    {
        id: 'sales',
        label: 'Assigned Sales',
    },
    {
        id: 'source',
        label: 'Source',
    },
    {
        id: 'last_updated',
        label: 'Last Updated',
    },
    {
        id: 'status',
        label: 'Status',
    },
    {
        id: 'actions',
        label: 'Actions',
    },
];

const views = [
    {
        label: 'Show all',
        value: 'all',
    },
    {
        label: 'New',
        value: 'New',
    },
    {
        label: 'Attempting Contact',
        value: 'Attempting Contact',
    },
    {
        label: 'Park',
        value: 'Park',
    },
    {
        label: 'Quotation',
        value: 'Quotation',
    },
    {
        label: 'Review',
        value: 'Review',
    },
    {
        label: 'Rejected - Pending',
        value: 'Rejected - Pending',
    },
    {
        label: 'Rejected',
        value: 'Rejected',
    },
    {
        label: 'Closed',
        value: 'Closed',
    },
    {
        label: 'Win',
        value: 'Win',
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
        label: 'Sales',
        name: 'sales',
        type: 'string',
    },
    {
        label: 'Status',
        name: 'status',
        type: 'string',
    },
    {
        label: 'Source',
        name: 'source',
        type: 'string',
    },
];

export const Leads = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'lead_id',
        view: 'all',
    });
    const [leadsState, setLeadsState] = useState({ isLoading: true });
    const [openCreateDialog, setOpenCreateDialog] = useState();
    const [refresh, setRefresh] = useState(false);
    let navigate = useNavigate();

    const mapFunction = (lead) => {
        return (
            <TableRow hover key={lead.lead_id}>
                <TableCell>{lead.lead_id}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.address}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.sales}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                    {format(lead.last_updated, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                    <Status color={lead.status_colour} label={lead.status} />
                </TableCell>
                <TableCell>
                    <Tooltip title="Email Customer">
                        <IconButton
                            color="primary"
                            onClick={onClickUrl(
                                `https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}&su=Update of Case Status - ${lead.address}`
                            )}
                            size="large"
                            sx={{ order: 3 }}
                        >
                            <EmailIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Lead details">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                navigate(`/bpm/leads/${lead.lead_id}`);
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

    const getData = useCallback(async () => {
        setLeadsState(() => ({ isLoading: true }));

        try {
            /*const result = await bpmAPI.getLeads({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });*/

            if (mounted.current) {
                setLeadsState(() => ({
                    isLoading: false,
                    data: [],
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLeadsState(() => ({
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
        setRefresh(false);
        getData().catch(console.error);
    }, [controller, getData, refresh]);

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

    return (
        <>
            <Helmet>
                <title>Leads | Copower BPM</title>
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
                                Leads
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                color="primary"
                                size="large"
                                startIcon={<AddOutlinedIcon fontSize="small" />}
                                onClick={() => setOpenCreateDialog(true)}
                                variant="contained"
                            >
                                Add
                            </Button>
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
                            disabled={leadsState.isLoading}
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
                            error={leadsState.error}
                            data={leadsState.data?.leads}
                            dataCount={leadsState.data?.leadsCount}
                            isLoading={leadsState.isLoading}
                            onPageChange={handlePageChange}
                            onSortChange={handleSortChange}
                            page={controller.page + 1}
                            sort={controller.sort}
                            sortBy={controller.sortBy}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    );
};
