import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

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
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Local imports
import { useMounted } from '../../hooks/use-mounted';
import { onClickUrl } from '../../utils/open-link';
import { bpmAPI } from '../../api/bpm/bpm-api';
import { exportToCsv } from '../../utils/export-csv';

// Components
import { DataTable } from '../../components/tables/data-table';
import { Status } from '../../components/tables/status';
import { Filter } from '../../components/tables/filter';
import { FormDialog } from '../../components/dialogs/form-dialog';

const columns = [
    {
        id: 'id',
        label: 'ID',
    },
    {
        id: 'type_name',
        label: 'Type',
    },
    {
        id: 'brand',
        label: 'Brand',
    },
    {
        id: 'series',
        label: 'Series',
    },
    {
        id: 'model',
        label: 'Model',
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
        label: 'Inverters',
        value: 'Inverter',
    },
    {
        label: 'Panels',
        value: 'Panel',
    },
    {
        label: 'Batteries',
        value: 'Battery',
    },
    {
        label: 'Meters',
        value: 'Meter',
    },
    {
        label: 'Rails',
        value: 'Rail',
    },
    {
        label: 'Mount Kits',
        value: 'Mount Kit',
    },
    {
        label: 'Cabels',
        value: 'Cable',
    },
    {
        label: 'Others',
        value: 'Other',
    },
];

const filterProperties = [
    {
        label: 'Created Date',
        name: 'create_date',
        type: 'date',
    },
    {
        label: 'Last Updated',
        name: 'last_updated',
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

export const StockItems = () => {
    const [openCreateDialog, setOpenCreateDialog] = useState();
    const [itemsState, setRefresh, controller, setController] =
        useOutletContext();
    const mounted = useMounted();

    const [typeOptions, setTypeOptions] = useState([]);

    const getData = useCallback(async () => {
        setTypeOptions([]);

        try {
            const typeOptionsAPI = await bpmAPI.getStockTypes();

            if (mounted.current) {
                setTypeOptions(typeOptionsAPI);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setTypeOptions(() => ({
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const mapFunction = (item) => {
        return (
            <TableRow hover key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.type_name}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.series}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell sx={{ width: 145 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            color="primary"
                            onClick={() => {
                                toast.error('Not implemented yet');
                            }}
                            sx={{
                                cursor: 'pointer',
                            }}
                            variant="subtitle2"
                        >
                            Edit
                        </Typography>
                        <>
                            <Divider
                                flexItem
                                orientation="vertical"
                                sx={{ mx: 2 }}
                            />
                            {item.disabled ? (
                                <Typography
                                    color="error"
                                    onClick={() => {
                                        toast.error('Not implemeneted yet');
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                    variant="subtitle2"
                                >
                                    Enable
                                </Typography>
                            ) : (
                                <Typography
                                    color="error"
                                    onClick={() => {
                                        toast.error('Not implemented yet');
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                    variant="subtitle2"
                                >
                                    Disable
                                </Typography>
                            )}
                        </>
                    </Box>
                </TableCell>
            </TableRow>
        );
    };

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

    const exportLeads = () => {
        if (itemsState.data) {
            exportToCsv('stock.csv', itemsState.data.items);
            toast.success('Stock items exported');
        } else {
            toast.error('Something went wrong. Try again later');
        }
    };

    const addItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            type: '',
            brand: '',
            series: '',
            model: '',
            active: true,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            type: Yup.number().integer().max(255).required('Type is required'),
            brand: Yup.string().max(255),
            series: Yup.string().max(255),
            model: Yup.string().max(255).required('Model is required'),
            active: Yup.boolean(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI
                    .createStockItem(values)
                    .then((res) => {
                        setOpenCreateDialog(false);
                        toast.success(`Item Created`);
                        setRefresh(true);
                    })
                    .catch((err) => {
                        toast.error('There was an error. Try again.');
                    });
                helpers.resetForm();
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const addItemFormFields = [
        {
            id: 1,
            variant: 'Select',
            width: 12,
            touched: addItemFormik.touched.type,
            errors: addItemFormik.errors.type,
            value: addItemFormik.values.type,
            label: 'Item Type',
            name: 'type',
            options: typeOptions,
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addItemFormik.touched.brand,
            errors: addItemFormik.errors.brand,
            value: addItemFormik.values.brand,
            label: 'Brand',
            name: 'brand',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addItemFormik.touched.series,
            errors: addItemFormik.errors.series,
            value: addItemFormik.values.series,
            label: 'Series',
            name: 'series',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: addItemFormik.touched.model,
            errors: addItemFormik.errors.model,
            value: addItemFormik.values.model,
            label: 'Model',
            name: 'model',
        },
        {
            id: 5,
            variant: 'Control',
            label: 'Active',
            name: 'active',
            touched: addItemFormik.touched.active,
            errors: addItemFormik.errors.active,
            value: addItemFormik.values.active,
            width: 12,
        },
    ];

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
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                        }}
                        variant="outlined"
                    >
                        <Filter
                            disabled={itemsState.isLoading}
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
                            error={itemsState.error}
                            data={itemsState.data?.items}
                            dataCount={itemsState.data?.itemsCount}
                            isLoading={itemsState.isLoading}
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
            <FormDialog
                onClose={() => setOpenCreateDialog(false)}
                open={openCreateDialog}
                formik={addItemFormik}
                title="Add Item"
                fields={addItemFormFields}
            />
        </>
    );
};
