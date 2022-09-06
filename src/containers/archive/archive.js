import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Material UI
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Typography,
    TableCell,
    TableRow,
    Tooltip,
    IconButton,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

// Local Import
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

// Components
import { DataTable } from '../../components/tables/data-table';
import { Filter } from '../../components/tables/filter';

const filterProperties = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
    },
];

const columns = [
    {
        id: 'internal_id',
        name: 'ID',
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
        id: 'email',
        label: 'Email',
    },
    {
        id: 'system_size',
        label: 'System',
    },
    {
        id: 'inverter',
        label: 'Inverter',
    },
    {
        id: 'roof_type',
        label: 'Roof',
    },
    {
        id: 'storey',
        label: 'Storey',
    },
    {
        id: 'install_date',
        label: 'Installed',
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
];

export const Archive = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'id',
        view: 'all',
    });
    const [archiveState, setArchiveState] = useState({ isLoading: true });
    const [refresh, setRefresh] = useState(false);
    let navigate = useNavigate();

    const getData = useCallback(async () => {
        setArchiveState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getArchive({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });

            if (mounted.current) {
                setArchiveState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setArchiveState(() => ({
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

    const mapFunction = (data) => {
        const location = `http://45.77.237.40:8080/bpm/trace/taskLink?tid=${data.task_id}`;
        return (
            <TableRow hover key={data.id}>
                <TableCell>{data.internal_id}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.address}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.system_size}</TableCell>
                <TableCell>{data.inverter}</TableCell>
                <TableCell>{data.roof_type}</TableCell>
                <TableCell>{data.storey}</TableCell>
                <TableCell>{data.install_date}</TableCell>
                <TableCell>
                    {data.task_id && (
                        <Tooltip title="Go to legacy BPM">
                            <IconButton
                                color="primary"
                                href={location}
                                target="_blank"
                                size="large"
                                sx={{ order: 3 }}
                            >
                                <ArrowForwardOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <>
            <Helmet>
                <title>Archive | Solar BPM</title>
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
                                Archive
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
                            disabled={archiveState.isLoading}
                            filters={controller.filters}
                            onFiltersApply={handleFiltersApply}
                            onFiltersClear={handleFiltersClear}
                            onQueryChange={handleQueryChange}
                            query={controller.query}
                            filterProperties={filterProperties}
                            views={views}
                        />
                        <Divider />
                        <DataTable
                            columns={columns}
                            rowFunction={mapFunction}
                            error={archiveState.error}
                            data={archiveState.data?.archives}
                            dataCount={archiveState.data?.archivesCount}
                            isLoading={archiveState.isLoading}
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
