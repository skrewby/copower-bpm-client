import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

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
    Button,
} from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

// Local import
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

// Components
import { DataTable } from '../../components/tables/data-table';
import { Filter } from '../../components/tables/filter';
import { Status } from '../../components/tables/status';
import { useAuth } from '../../hooks/use-auth';
import { useFormik } from 'formik';
import { getRoleID } from '../../utils/get-role-id';
import { FormDialog } from '../../components/dialogs/form-dialog';

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
        name: 'create_date',
        type: 'date',
    },
    {
        label: 'Last Updated',
        name: 'last_updated',
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
        id: 'reference',
        label: 'Reference',
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
        sortBy: 'create_date',
        view: 'all',
    });
    const [installsState, setInstallsState] = useState({ isLoading: true });
    let navigate = useNavigate();
    const { user } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState();
    const [salesUserOptions, setSalesUserOptions] = useState([]);

    const getData = useCallback(async () => {
        setInstallsState(() => ({ isLoading: true }));
        setSalesUserOptions([]);

        try {
            const result = await bpmAPI.getInstalls({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });
            const usersAPI = await bpmAPI.getUsers();
            const salesResult = usersAPI.filter(
                (user) => user.disabled === false
            );
            const usersResult = salesResult.map((user) => {
                return {
                    id: user.account_id,
                    name: user.name,
                };
            });

            if (mounted.current) {
                setInstallsState(() => ({
                    isLoading: false,
                    data: result,
                }));
                setSalesUserOptions(usersResult);
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
    }, [controller, getData, refresh]);

    const addInstallsFormik = useFormik({
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
            address: Yup.string().max(255).required('Must enter an address'),
            address_id: Yup.string().max(255),
            sales_id: Yup.string().max(255).required('Must assign to an user'),
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
                } else {
                    const customer = await bpmAPI.getCustomer(
                        values.customer_id
                    );
                    values.first_name = customer.first_name;
                    values.last_name = customer.last_name;
                }
                await bpmAPI
                    .createInstallDirectly(values)
                    .then(async (res) => {
                        setOpenCreateDialog(false);
                        toast.success(`Install Created`);
                        const roles = await bpmAPI.getValidRoles();
                        bpmAPI.createNotification({
                            icon: 'announcement',
                            title: `New Install`,
                            details: `${values.first_name} ${values.last_name}: ${values.address}`,
                            role: getRoleID(roles, 'Operations'),
                            href: `/bpm/installs/${res.id}`,
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

    const addInstallFormFields = [
        {
            id: 1,
            variant: 'Customer Search',
            width: 12,
            label: 'Assign Customer',
            touched: addInstallsFormik.touched.customer_id,
            errors: addInstallsFormik.errors.customer_id,
            allowCreate: true,
            name: 'customer_id',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addInstallsFormik.touched.first_name,
            errors: addInstallsFormik.errors.first_name,
            value: addInstallsFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
            hidden: !(addInstallsFormik.values.customer_id === -1),
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addInstallsFormik.touched.last_name,
            errors: addInstallsFormik.errors.last_name,
            value: addInstallsFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
            hidden: !(addInstallsFormik.values.customer_id === -1),
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: addInstallsFormik.touched.company_name,
            errors: addInstallsFormik.errors.company_name,
            value: addInstallsFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
            hidden: !(addInstallsFormik.values.customer_id === -1),
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: addInstallsFormik.touched.company_abn,
            errors: addInstallsFormik.errors.company_abn,
            value: addInstallsFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
            hidden: !(addInstallsFormik.values.customer_id === -1),
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: addInstallsFormik.touched.email,
            errors: addInstallsFormik.errors.email,
            value: addInstallsFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
            hidden: !(addInstallsFormik.values.customer_id === -1),
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: addInstallsFormik.touched.phone,
            errors: addInstallsFormik.errors.phone,
            value: addInstallsFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
            hidden: !(addInstallsFormik.values.customer_id === -1),
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: addInstallsFormik.touched.address,
            errors: addInstallsFormik.errors.address,
            value: addInstallsFormik.values.address,
            label: 'Address',
            name: 'address',
        },
        {
            id: 10,
            variant: 'Select',
            width: 12,
            touched: addInstallsFormik.touched.sales_id,
            errors: addInstallsFormik.errors.sales_id,
            value: addInstallsFormik.values.sales_id,
            label: 'Assign Sales',
            name: 'sales_id',
            options: salesUserOptions,
        },
    ];

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
                <TableCell>{install.reference}</TableCell>
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
                {user.role !== 'Sales' && (
                    <TableCell>
                        <Tooltip title="Install details">
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    navigate(
                                        `/bpm/installs/${install.install_id}`
                                    );
                                }}
                                size="large"
                                sx={{ order: 3 }}
                            >
                                <ArrowForwardOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                )}
            </TableRow>
        );
    };

    return (
        <>
            <Helmet>
                <title>Installs | Solar BPM</title>
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
            <FormDialog
                onClose={() => setOpenCreateDialog(false)}
                open={openCreateDialog}
                formik={addInstallsFormik}
                title="Create Install"
                fields={addInstallFormFields}
            />
        </>
    );
};
