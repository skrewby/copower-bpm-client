import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
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
import { FormDialog } from '../../components/dialogs/form-dialog';

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
];

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

const views = [
    {
        label: 'Show all',
        value: 'all',
    },
];

export const Customers = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'id',
        view: 'all',
    });
    const [customersState, setCustomersState] = useState({ isLoading: true });
    const [openCreateDialog, setOpenCreateDialog] = useState();
    const [refresh, setRefresh] = useState(false);
    let navigate = useNavigate();

    const getData = useCallback(async () => {
        setCustomersState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getCustomers({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });

            if (mounted.current) {
                setCustomersState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setCustomersState(() => ({
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

    const addCustomerFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            first_name: '',
            last_name: '',
            company_name: '',
            company_abn: '',
            email: '',
            phone: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            first_name: Yup.string()
                .max(255)
                .required('First name is required'),
            last_name: Yup.string().max(255).required('Last name is required'),
            company_name: Yup.string().max(255),
            company_abn: Yup.string().max(255),
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phone: Yup.string().max(255).required('Contact number is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI
                    .createCustomer(values)
                    .then((res) => {
                        setOpenCreateDialog(false);
                        bpmAPI.createCustomerLog(
                            res.id,
                            'Created Customer',
                            true
                        );
                        toast.success(`Customer Created`);
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

    const addCustomerFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: addCustomerFormik.touched.first_name,
            errors: addCustomerFormik.errors.first_name,
            value: addCustomerFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addCustomerFormik.touched.last_name,
            errors: addCustomerFormik.errors.last_name,
            value: addCustomerFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addCustomerFormik.touched.company_name,
            errors: addCustomerFormik.errors.company_name,
            value: addCustomerFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: addCustomerFormik.touched.company_abn,
            errors: addCustomerFormik.errors.company_abn,
            value: addCustomerFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: addCustomerFormik.touched.email,
            errors: addCustomerFormik.errors.email,
            value: addCustomerFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: addCustomerFormik.touched.phone,
            errors: addCustomerFormik.errors.phone,
            value: addCustomerFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
        },
    ];

    const mapFunction = (customers) => {
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
                <TableCell>
                    <Tooltip title="Lead details">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                navigate(
                                    `/bpm/customers/${customers.customer_id}`
                                );
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
                <title>Customers | Copower BPM</title>
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
                                Customers
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
                            disabled={customersState.isLoading}
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
                            error={customersState.error}
                            data={customersState.data?.customers}
                            dataCount={customersState.data?.customersCount}
                            isLoading={customersState.isLoading}
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
                formik={addCustomerFormik}
                title="Add Customers"
                fields={addCustomerFormFields}
            />
        </>
    );
};
