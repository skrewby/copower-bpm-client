import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Material UI
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local Imports
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { InstallProgress } from './install-progress';
import { format, parseISO } from 'date-fns';

export const InstallMeter = () => {
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();
    const now = new Date();

    const [openRetailerDialog, setOpenRetailerDialog] = useState(false);
    const [openPTCDialog, setOpenPTCDialog] = useState(false);

    const [statusOptions, setStatusOptions] = useState([]);

    const getData = useCallback(async () => {
        setStatusOptions([]);

        try {
            const statusOptionsAPI = await bpmAPI.getInstallStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });

            if (mounted.current) {
                setStatusOptions(statusOptionsResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setStatusOptions(() => ({
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const ptcFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            ptc_form_sent: installState.data?.ptc.form_sent || false,
            ptc_exempted: installState.data?.ptc.exempted || false,
            ptc_form_sent_date:
                parseISO(installState.data?.ptc.form_sent_date) || now,
            ptc_approved: installState.data?.ptc.approved || false,
            ptc_approval_date:
                parseISO(installState.data?.ptc.approval_date) || now,
            ptc_number: installState.data?.ptc.number || '',
            ptc_condition: installState.data?.ptc.condition || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            ptc_form_sent: Yup.boolean(),
            ptc_exempted: Yup.boolean(),
            ptc_form_sent_date: Yup.date(),
            ptc_approved: Yup.boolean(),
            ptc_approval_date: Yup.date(),
            ptc_number: Yup.string(255),
            ptc_condition: Yup.string(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenRetailerDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const ptcFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Form Sent',
            name: 'ptc_form_sent',
            touched: ptcFormik.touched.ptc_form_sent,
            errors: ptcFormik.errors.ptc_form_sent,
            value: ptcFormik.values.ptc_form_sent,
            width: 6,
        },
        {
            id: 2,
            variant: 'Control',
            label: 'Exempted',
            name: 'ptc_exempted',
            touched: ptcFormik.touched.ptc_exempted,
            errors: ptcFormik.errors.ptc_exempted,
            value: ptcFormik.values.ptc_exempted,
            width: 6,
        },
        {
            id: 3,
            variant: 'Date',
            label: 'Date Sent',
            name: 'ptc_form_sent_date',
            touched: ptcFormik.touched.ptc_form_sent_date,
            errors: ptcFormik.errors.ptc_form_sent_date,
            value: ptcFormik.values.ptc_form_sent_date,
            hidden: !ptcFormik.values.ptc_form_sent,
            width: 6,
        },
        {
            id: 4,
            variant: 'Control',
            label: 'Approved',
            name: 'ptc_approved',
            touched: ptcFormik.touched.ptc_approved,
            errors: ptcFormik.errors.ptc_approved,
            value: ptcFormik.values.ptc_approved,
            width: 12,
        },
        {
            id: 5,
            variant: 'Date',
            label: 'Date Approved',
            name: 'ptc_approval_date',
            touched: ptcFormik.touched.ptc_approval_date,
            errors: ptcFormik.errors.ptc_approval_date,
            value: ptcFormik.values.ptc_approval_date,
            hidden: !ptcFormik.values.ptc_approved,
            width: 6,
        },
        {
            id: 6,
            variant: 'Input',
            label: 'PTC Number',
            name: 'ptc_number',
            touched: ptcFormik.touched.ptc_number,
            errors: ptcFormik.errors.ptc_number,
            value: ptcFormik.values.ptc_number,
            hidden: !ptcFormik.values.ptc_approved,
            width: 6,
        },
        {
            id: 7,
            variant: 'Input',
            label: 'PTC Approval Condition',
            name: 'ptc_condition',
            touched: ptcFormik.touched.ptc_condition,
            errors: ptcFormik.errors.ptc_condition,
            value: ptcFormik.values.ptc_condition,
            hidden: !ptcFormik.values.ptc_approved,
            width: 12,
        },
    ];

    const retailerFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            retailer_notice_complete:
                installState.data?.retailer_notice.complete || false,
            retailer_notice_date:
                parseISO(installState.data?.retailer_notice.date) || now,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            retailer_notice_complete: Yup.boolean(),
            retailer_notice_date: Yup.date(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenRetailerDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const retailerFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Notice Sent',
            name: 'retailer_notice_complete',
            touched: retailerFormik.touched.retailer_notice_complete,
            errors: retailerFormik.errors.retailer_notice_complete,
            value: retailerFormik.values.retailer_notice_complete,
            width: 6,
        },
        {
            id: 2,
            variant: 'Date',
            label: 'Date Sent',
            name: 'retailer_notice_date',
            touched: retailerFormik.touched.retailer_notice_date,
            errors: retailerFormik.errors.retailer_notice_date,
            value: retailerFormik.values.retailer_notice_date,
            hidden: !retailerFormik.values.retailer_notice_complete,
            width: 6,
        },
    ];

    const renderContent = () => {
        if (installState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installState.error) {
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
                            {installState.error}
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
                                onEdit={() => setOpenPTCDialog(true)}
                                title="Permission To Connect"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'PTC Status',
                                        value: installState.data.ptc.approved
                                            ? 'Approved'
                                            : installState.data.ptc.exempted
                                            ? 'Exempted'
                                            : installState.data.ptc.form_sent
                                            ? 'Waiting for Approval'
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'PTC Approval Date',
                                        value: installState.data.ptc.approved
                                            ? format(
                                                  parseISO(
                                                      installState.data.ptc
                                                          .approval_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : '',
                                    },
                                    {
                                        id: 3,
                                        label: 'Approval Condition',
                                        value: installState.data.ptc.approved
                                            ? installState.data.ptc.condition
                                            : '',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'PTC Form Sent Date',
                                        value: installState.data.ptc.form_sent
                                            ? format(
                                                  parseISO(
                                                      installState.data.ptc
                                                          .form_sent_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Approval Number',
                                        value: installState.data.ptc.approved
                                            ? installState.data.ptc.number
                                            : '',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenRetailerDialog(true)}
                                title="Retailer Notification"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Notification Sent',
                                        value: installState.data.retailer_notice
                                            .complete
                                            ? 'Sent'
                                            : 'Not Sent',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Notification Sent Date',
                                        value: installState.data.retailer_notice
                                            .complete
                                            ? format(
                                                  parseISO(
                                                      installState.data
                                                          .retailer_notice.date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : '',
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
                            <InstallProgress
                                install={installState.data}
                                statusOptions={statusOptions.filter(
                                    (status) => status.id < 9
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenPTCDialog(false)}
                    open={openPTCDialog}
                    formik={ptcFormik}
                    title="Edit PTC Details"
                    fields={ptcFormFields}
                />
                <FormDialog
                    onClose={() => setOpenRetailerDialog(false)}
                    open={openRetailerDialog}
                    formik={retailerFormik}
                    title="Retailer Notification"
                    fields={retailerFormFields}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Install | Solar BPM</title>
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
