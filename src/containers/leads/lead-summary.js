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
import { LeadProgress } from '../../components/timeline/lead-progress';

export const LeadSummary = () => {
    const [leadState, setRefresh] = useOutletContext();
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const mounted = useMounted();

    const [sourceOptions, setSourceOptions] = useState([]);
    const [phaseOptions, setPhaseOptions] = useState([]);
    const [existingSystemOptions, setExistingSystemOptions] = useState([]);
    const [storyOptions, setStoryOptions] = useState([]);
    const [roofTypeOptions, setRoofTypeOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    const getData = useCallback(async () => {
        setSourceOptions([]);
        setPhaseOptions([]);
        setExistingSystemOptions([]);
        setStoryOptions([]);
        setRoofTypeOptions([]);
        setStatusOptions([]);

        try {
            const sourcesAPI = await bpmAPI.getLeadSources();
            const sourcesResult = sourcesAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });
            const phasesAPI = await bpmAPI.getPhaseOptions();
            const phasesResult = phasesAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.num,
                };
            });
            const existingSystemAPI = await bpmAPI.getExistingSystemOptions();
            const existingSystemResult = existingSystemAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.comment,
                };
            });
            const storyOptionsAPI = await bpmAPI.getStoryOptions();
            const storyOptionsResult = storyOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.num,
                };
            });
            const roofTypeAPI = await bpmAPI.getRoofTypeOptions();
            const roofTypeResult = roofTypeAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });
            const statusOptionsAPI = await bpmAPI.getLeadStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });

            if (mounted.current) {
                setSourceOptions(sourcesResult);
                setPhaseOptions(phasesResult);
                setExistingSystemOptions(existingSystemResult);
                setStoryOptions(storyOptionsResult);
                setRoofTypeOptions(roofTypeResult);
                setStatusOptions(statusOptionsResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setSourceOptions(() => ({ error: err.message }));
                setPhaseOptions(() => ({ error: err.message }));
                setExistingSystemOptions(() => ({ error: err.message }));
                setStoryOptions(() => ({ error: err.message }));
                setRoofTypeOptions(() => ({ error: err.message }));
                setStatusOptions(() => ({ error: err.message }));
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

    const propertyFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            phase_id: leadState.data?.phase_id || '',
            existing_system_id: leadState.data?.existing_system_id || '',
            story_id: leadState.data?.story_id || '',
            retailer: leadState.data?.retailer || '',
            roof_type_id: leadState.data?.roof_type_id || '',
            distributor: leadState.data?.distributor || '',
            nmi: leadState.data?.nmi || '',
            meter: leadState.data?.meter || '',
            property_comment: leadState.data?.property_comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            phase_id: Yup.number(),
            existing_system_id: Yup.number(),
            story_id: Yup.number(),
            retailer: Yup.string(),
            roof_type_id: Yup.number(),
            distributor: Yup.string(),
            nmi: Yup.string(),
            meter: Yup.string(),
            property_comment: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let property_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateLead(
                    leadState.data.lead_id,
                    property_values
                );
                if (res.status === 201) {
                    toast.success('Lead updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);

                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenPropertyDialog(false);
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
            variant: 'Address',
            width: 12,
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
            options: sourceOptions,
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

    const propertyFormFields = [
        {
            id: 1,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.phase_id,
            errors: propertyFormik.errors.phase_id,
            value: propertyFormik.values.phase_id,
            label: 'Phases',
            name: 'phase_id',
            options: phaseOptions,
        },
        {
            id: 2,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.existing_system_id,
            errors: propertyFormik.errors.existing_system_id,
            value: propertyFormik.values.existing_system_id,
            label: 'Existing System',
            name: 'existing_system_id',
            options: existingSystemOptions,
        },
        {
            id: 3,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.roof_type_id,
            errors: propertyFormik.errors.roof_type_id,
            value: propertyFormik.values.roof_type_id,
            label: 'Roof Type',
            name: 'roof_type_id',
            options: roofTypeOptions,
        },
        {
            id: 4,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.story_id,
            errors: propertyFormik.errors.story_id,
            value: propertyFormik.values.story_id,
            label: 'Stories',
            name: 'story_id',
            options: storyOptions,
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.retailer,
            errors: propertyFormik.errors.retailer,
            value: propertyFormik.values.retailer,
            label: 'Retailer',
            name: 'retailer',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.nmi,
            errors: propertyFormik.errors.nmi,
            value: propertyFormik.values.nmi,
            label: 'NMI',
            name: 'nmi',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.distributor,
            errors: propertyFormik.errors.distributor,
            value: propertyFormik.values.distributor,
            label: 'Distributor',
            name: 'distributor',
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.meter,
            errors: propertyFormik.errors.meter,
            value: propertyFormik.values.meter,
            label: 'Meter Number',
            name: 'meter',
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: propertyFormik.touched.property_comment,
            errors: propertyFormik.errors.property_comment,
            value: propertyFormik.values.property_comment,
            label: 'Property Comment',
            name: 'property_comment',
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
                            <InfoCard
                                onEdit={() => setOpenPropertyDialog(true)}
                                title="Property Details"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Phases',
                                        value: leadState.data.phase,
                                    },
                                    {
                                        id: 2,
                                        label: 'Roof Type',
                                        value: leadState.data.roof_type,
                                    },
                                    {
                                        id: 3,
                                        label: 'Retailer',
                                        value: leadState.data.retailer,
                                    },
                                    {
                                        id: 4,
                                        label: 'NMI',
                                        value: leadState.data.nmi,
                                    },
                                    {
                                        id: 5,
                                        label: 'Property Comment',
                                        value: leadState.data.property_comment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Existing System',
                                        value: leadState.data.existing_system,
                                    },
                                    {
                                        id: 2,
                                        label: 'Stories',
                                        value: leadState.data.story,
                                    },
                                    {
                                        id: 3,
                                        label: 'Distributor',
                                        value: leadState.data.distributor,
                                    },
                                    {
                                        id: 4,
                                        label: 'Meter Number',
                                        value: leadState.data.meter,
                                    },
                                ]}
                            />
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
                            <LeadProgress
                                lead={leadState.data}
                                statusOptions={statusOptions}
                                refresh={setRefresh}
                            />
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
                <FormDialog
                    onClose={() => setOpenPropertyDialog(false)}
                    open={openPropertyDialog}
                    formik={propertyFormik}
                    title="Edit Property Details"
                    fields={propertyFormFields}
                />
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
