import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const [sourceOptions, setSourceOptions] = useState([]);
    const [salesUserOptions, setSalesUserOptions] = useState([]);

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
        setSourceOptions([]);
        setSalesUserOptions([]);

        try {
            const result = await bpmAPI.getLeads({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
            });
            const sourcesAPI = await bpmAPI.getLeadSources();
            const sourcesResult = sourcesAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
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
                setLeadsState(() => ({
                    isLoading: false,
                    data: result,
                }));
                setSourceOptions(sourcesResult);
                setSalesUserOptions(usersResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLeadsState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setSourceOptions(() => ({ error: err.message }));
                setSalesUserOptions(() => ({ error: err.message }));
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

    const exportLeads = () => {
        if (leadsState.data) {
            exportToCsv('leads.csv', leadsState.data.leads);
            toast.success('Leads exported');
        } else {
            toast.error('Something went wrong. Try again later');
        }
    };

    const addLeadFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            address: '',
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
            sales_id: Yup.string().max(255).required('Must assign to an user'),
            source_id: Yup.number().required('Must choose lead source'),
            phone: Yup.string().max(255).required('Contact number is required'),
            comment: Yup.string().max(255).nullable(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI
                    .createLead(values)
                    .then((res) => {
                        setOpenCreateDialog(false);
                        bpmAPI.createLeadLog(res.id, 'Created Lead', true);
                        toast.success(`Lead Created`);
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

    const leadFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: addLeadFormik.touched.first_name,
            errors: addLeadFormik.errors.first_name,
            value: addLeadFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addLeadFormik.touched.last_name,
            errors: addLeadFormik.errors.last_name,
            value: addLeadFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addLeadFormik.touched.company_name,
            errors: addLeadFormik.errors.company_name,
            value: addLeadFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: addLeadFormik.touched.company_abn,
            errors: addLeadFormik.errors.company_abn,
            value: addLeadFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
        },
        {
            id: 5,
            variant: 'Address',
            width: 12,
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: addLeadFormik.touched.email,
            errors: addLeadFormik.errors.email,
            value: addLeadFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: addLeadFormik.touched.phone,
            errors: addLeadFormik.errors.phone,
            value: addLeadFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
        },
        {
            id: 8,
            variant: 'Select',
            width: 6,
            touched: addLeadFormik.touched.source_id,
            errors: addLeadFormik.errors.source_id,
            value: addLeadFormik.values.source_id,
            label: 'Lead Source',
            name: 'source_id',
            options: sourceOptions,
        },
        {
            id: 9,
            variant: 'Select',
            width: 6,
            touched: addLeadFormik.touched.sales_id,
            errors: addLeadFormik.errors.sales_id,
            value: addLeadFormik.values.sales_id,
            label: 'Assign Sales',
            name: 'sales_id',
            options: salesUserOptions,
        },
        {
            id: 10,
            variant: 'Input',
            width: 12,
            touched: addLeadFormik.touched.comment,
            errors: addLeadFormik.errors.comment,
            value: addLeadFormik.values.comment,
            label: 'Comment',
            name: 'comment',
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
                                startIcon={
                                    <FileDownloadIcon fontSize="small" />
                                }
                                onClick={() => exportLeads()}
                                variant="contained"
                            >
                                Export
                            </Button>
                            <Box sx={{ px: 1 }} />
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
                            size="small"
                        />
                    </Card>
                </Container>
            </Box>
            <FormDialog
                onClose={() => setOpenCreateDialog(false)}
                open={openCreateDialog}
                formik={addLeadFormik}
                title="Add Lead"
                fields={leadFormFields}
            />
        </>
    );
};
