import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Material UI
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { LogAdd } from '../../components/logs/log-add';
import { LogEntry } from '../../components/logs/log-entry';

export const CustomerSummary = () => {
    const [customerState, customerLogs, setRefresh] = useOutletContext();
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const customerEditFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            first_name: customerState.data.first_name || '',
            last_name: customerState.data.last_name || '',
            company_name: customerState.data.company_name || '',
            company_abn: customerState.data.company_abn || '',
            email: customerState.data.email || '',
            phone: customerState.data.phone || '',
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
                const res = await bpmAPI
                    .updateCustomer(customerState.data.customer_id, values)
                    .then(setRefresh(true));
                if (res.status === 201) {
                    toast.success(`Customer Updated`);
                } else {
                    toast.error(`Something went wrong`);
                }
                setOpenEditDialog(false);
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

    const customerEditFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: customerEditFormik.touched.first_name,
            errors: customerEditFormik.errors.first_name,
            value: customerEditFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: customerEditFormik.touched.last_name,
            errors: customerEditFormik.errors.last_name,
            value: customerEditFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: customerEditFormik.touched.company_name,
            errors: customerEditFormik.errors.company_name,
            value: customerEditFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: customerEditFormik.touched.company_abn,
            errors: customerEditFormik.errors.company_abn,
            value: customerEditFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: customerEditFormik.touched.email,
            errors: customerEditFormik.errors.email,
            value: customerEditFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: customerEditFormik.touched.phone,
            errors: customerEditFormik.errors.phone,
            value: customerEditFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
        },
    ];

    const handleCreateLog = (content) => {
        bpmAPI.createCustomerLog(
            customerState.data.customer_id,
            content,
            false
        );
        toast.success('Log added');
        setRefresh(true);
    };

    const renderContent = () => {
        if (customerState.isLoading || customerLogs.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (customerState.error || customerLogs.error) {
            return (
                <Box sx={{ py: 4 }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 3,
                        }}
                    >
                        <PriorityHighOutlinedIcon />
                        <Typography
                            color="textSecondary"
                            sx={{ mt: 2 }}
                            variant="body2"
                        >
                            Error Ocurred
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid
                        container
                        item
                        lg={11}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenEditDialog(true)}
                                title="Customer"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Name',
                                        value: customerState.data.name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company Name',
                                        value: customerState.data.company_name,
                                    },
                                    {
                                        id: 3,
                                        label: 'Email Address',
                                        value: customerState.data.email,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Phone Number',
                                        value: customerState.data.phone,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company ABN',
                                        value: customerState.data.company_abn,
                                    },
                                ]}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gap: 1,
                                }}
                            >
                                <LogAdd onSend={handleCreateLog} />
                                {customerLogs.data.map((log) => (
                                    <LogEntry key={log.log_id} log={log} />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenEditDialog(false)}
                    open={openEditDialog}
                    formik={customerEditFormik}
                    title="Edit Customer Information"
                    fields={customerEditFormFields}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Customer | Copower BPM</title>
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
                    {renderContent()}
                </Container>
            </Box>
        </>
    );
};
