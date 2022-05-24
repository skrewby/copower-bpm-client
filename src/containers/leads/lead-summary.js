import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

// Material UI
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';

export const LeadSummary = () => {
    const [leadState, setRefresh] = useOutletContext();
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const mounted = useMounted();

    const [sourceOptions, setSourceOptions] = useState({
        isLoading: true,
        data: [],
    });

    const getData = useCallback(async () => {
        setSourceOptions(() => ({
            isLoading: true,
            data: [],
        }));

        try {
            const sourcesAPI = await bpmAPI.getLeadSources();
            const sourcesResult = sourcesAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });

            if (mounted.current) {
                setSourceOptions(() => ({
                    isLoading: false,
                    data: sourcesResult,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setSourceOptions(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const leadInfoFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            first_name: leadState.data?.first_name || '',
            last_name: leadState.data?.last_name || '',
            company_name: leadState.data?.company_name || '',
            company_abn: leadState.data?.company_abn || '',
            address: leadState.data?.address || '',
            email: leadState.data?.email || '',
            phone: leadState.data?.phone || '',
            source_id: leadState.data?.source_id || '',
            comment: leadState.data?.comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            first_name: Yup.string()
                .max(255)
                .required('First name is required'),
            last_name: Yup.string().max(255).required('Last name is required'),
            company_name: Yup.string().max(255),
            company_abn: Yup.string().max(255),
            address: Yup.string().max(255).required('Address is required'),
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phone: Yup.string().max(255).required('Phone number is required'),
            source_id: Yup.number().required('Lead source is required'),
            comment: Yup.string().max(255).default(''),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let lead_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateLead(
                    leadState.data.lead_id,
                    lead_values
                );
                if (res.status === 201) {
                    toast.success('Lead updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);

                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenInfoDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const leadInfoFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.first_name,
            errors: leadInfoFormik.errors.first_name,
            value: leadInfoFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.last_name,
            errors: leadInfoFormik.errors.last_name,
            value: leadInfoFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.company_name,
            errors: leadInfoFormik.errors.company_name,
            value: leadInfoFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.company_abn,
            errors: leadInfoFormik.errors.company_abn,
            value: leadInfoFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
        },
        {
            id: 5,
            variant: 'Input',
            width: 12,
            touched: leadInfoFormik.touched.address,
            errors: leadInfoFormik.errors.address,
            value: leadInfoFormik.values.address,
            label: 'Address',
            name: 'address',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.email,
            errors: leadInfoFormik.errors.email,
            value: leadInfoFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.phone,
            errors: leadInfoFormik.errors.phone,
            value: leadInfoFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
        },
        {
            id: 8,
            variant: 'Select',
            width: 12,
            touched: leadInfoFormik.touched.source_id,
            errors: leadInfoFormik.errors.source_id,
            value: leadInfoFormik.values.source_id,
            label: 'Lead Source',
            name: 'source_id',
            options: sourceOptions.data,
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: leadInfoFormik.touched.comment,
            errors: leadInfoFormik.errors.comment,
            value: leadInfoFormik.values.comment,
            label: 'Comment',
            name: 'comment',
        },
    ];

    const renderContent = () => {
        if (leadState.isLoading || sourceOptions.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (leadState.error || sourceOptions.error) {
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
                            Error ocurred. Refresh the page
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    <Grid
                        container
                        item
                        lg={8}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenInfoDialog(true)}
                                title="Lead Information"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Customer Name',
                                        value: leadState.data.name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company Name',
                                        value: leadState.data.company_name,
                                    },
                                    {
                                        id: 3,
                                        label: 'Email Address',
                                        value: leadState.data.email,
                                    },
                                    {
                                        id: 4,
                                        label: 'Assigned Sales',
                                        value: leadState.data.sales,
                                    },
                                    {
                                        id: 5,
                                        label: 'Comment',
                                        value: leadState.data.comment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Address',
                                        value: leadState.data.address,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company ABN',
                                        value: leadState.data.company_abn,
                                    },
                                    {
                                        id: 3,
                                        label: 'Phone Number',
                                        value: leadState.data.phone,
                                    },
                                    {
                                        id: 4,
                                        label: 'Source',
                                        value: leadState.data.source,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* <InfoCard
                                onEdit={() => setOpenPropertyDialog(true)}
                                lead={leadState.data}
                            /> */}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        lg={4}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            {/* <LeadProgress
                                lead={leadState.data}
                                refresh={setRefresh}
                            /> */}
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenInfoDialog(false)}
                    open={openInfoDialog}
                    formik={leadInfoFormik}
                    title="Edit Lead Info"
                    fields={leadInfoFormFields}
                />
                {/* <LeadPropertyDialog
                    onClose={() => setOpenPropertyDialog(false)}
                    open={openPropertyDialog}
                    lead={leadState.data}
                    refresh={setRefresh}
                /> */}
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Lead | Copower BPM</title>
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
