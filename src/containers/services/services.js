import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
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
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// Local import
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';
import { getRoleID } from '../../utils/get-role-id';

// Components
import { DataTable } from '../../components/tables/data-table';
import { Filter } from '../../components/tables/filter';
import { Status } from '../../components/tables/status';
import { FormDialog } from '../../components/dialogs/form-dialog';

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
        label: 'In Progress',
        value: 'In Progress',
    },
    {
        label: 'Complete',
        value: 'Complete',
    },
];

const filterProperties = [
    {
        label: 'Created Date',
        name: 'createdDate',
        type: 'date',
    },
    {
        label: 'Status',
        name: 'status',
        type: 'string',
    },
    {
        label: 'Visit Date',
        name: 'visitDate',
        type: 'date',
    },
];

const columns = [
    {
        id: 'id',
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
        id: 'email',
        label: 'Email',
    },
    {
        id: 'create_date',
        label: 'Created',
    },
    {
        id: 'visit',
        label: 'Visit',
    },
    {
        id: 'status',
        label: 'Status',
    },
];

export const Services = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'createdDate',
        view: 'all',
    });
    const [services, setServices] = useState({ isLoading: true });
    const [openCreateDialog, setOpenCreateDialog] = useState();
    const [refresh, setRefresh] = useState(false);
    let navigate = useNavigate();

    const getData = useCallback(async () => {
        setServices(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getServices({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });

            if (mounted.current) {
                setServices(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setServices(() => ({
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

    const addServiceFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            customer_id: '',
            address: '',
            address_id: '',
            email: '',
            first_name: '',
            last_name: '',
            company_name: '',
            company_abn: '',
            sales_id: '',
            phone: '',
            source_id: '',
            comment: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            customer_id: Yup.number(),
            first_name: Yup.string().max(255),
            last_name: Yup.string().max(255),
            company_name: Yup.string().max(255),
            company_abn: Yup.string().max(255),
            email: Yup.string().email('Must be a valid email').max(255),
            phone: Yup.string().max(255),
            address: Yup.string().max(255),
            address_id: Yup.string().max(255),
            comment: Yup.string().max(255).nullable(),
        }),
        onSubmit: async (form_values, helpers) => {
            try {
                let values = Object.fromEntries(
                    Object.entries(form_values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );
                // The Form will return a -1 if the user chose to create a new customer
                if (values.customer_id === -1) {
                    const customer = await bpmAPI.createCustomer(values);
                    values.customer_id = customer.id;
                }
                await bpmAPI
                    .createService(values)
                    .then(async (res) => {
                        setOpenCreateDialog(false);
                        toast.success(`Service Created`);
                        const roles = await bpmAPI.getValidRoles();
                        bpmAPI.createNotification({
                            icon: 'announcement',
                            title: `New Service`,
                            details: `${values.first_name} ${values.last_name}: ${values.address}`,
                            role: getRoleID(roles, 'Services'),
                            href: `/bpm/services/${res.id}`,
                        });
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

    const addServiceFormFields = [
        {
            id: 1,
            variant: 'Customer Search',
            width: 12,
            label: 'Assign Customer',
            touched: addServiceFormik.touched.customer_id,
            errors: addServiceFormik.errors.customer_id,
            allowCreate: true,
            name: 'customer_id',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addServiceFormik.touched.first_name,
            errors: addServiceFormik.errors.first_name,
            value: addServiceFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addServiceFormik.touched.last_name,
            errors: addServiceFormik.errors.last_name,
            value: addServiceFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: addServiceFormik.touched.company_name,
            errors: addServiceFormik.errors.company_name,
            value: addServiceFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: addServiceFormik.touched.company_abn,
            errors: addServiceFormik.errors.company_abn,
            value: addServiceFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 6,
            variant: 'Input',
            width: 12,
            touched: addServiceFormik.touched.address,
            errors: addServiceFormik.errors.address,
            value: addServiceFormik.values.address,
            label: 'Address',
            name: 'address',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: addServiceFormik.touched.email,
            errors: addServiceFormik.errors.email,
            value: addServiceFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: addServiceFormik.touched.phone,
            errors: addServiceFormik.errors.phone,
            value: addServiceFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
            hidden: !(addServiceFormik.values.customer_id === -1),
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: addServiceFormik.touched.comment,
            errors: addServiceFormik.errors.comment,
            value: addServiceFormik.values.comment,
            label: 'Comment',
            name: 'comment',
        },
    ];

    const mapFunction = (service) => {
        return (
            <TableRow hover key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.customer_name}</TableCell>
                <TableCell>{service.customer_company}</TableCell>
                <TableCell>{service.address}</TableCell>
                <TableCell>{service.customer_phone}</TableCell>
                <TableCell>{service.customer_email}</TableCell>
                <TableCell>
                    {format(service.create_date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                    {service.visit ? format(service.visit, 'dd MMM yyyy') : '-'}
                </TableCell>
                <TableCell>
                    <Status
                        color={service.status_colour}
                        label={service.status_label}
                    />
                </TableCell>
                <TableCell>
                    <Tooltip title="Service details">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                navigate(`/bpm/services/${service.id}`);
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
                <title>Services | Copower BPM</title>
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
                                Services
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
                            disabled={services.isLoading}
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
                            error={services.error}
                            data={services.data?.services}
                            dataCount={services.data?.servicesCount}
                            isLoading={services.isLoading}
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
                formik={addServiceFormik}
                title="Create Service"
                fields={addServiceFormFields}
            />
        </>
    );
};
