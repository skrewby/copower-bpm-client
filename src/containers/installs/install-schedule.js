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

export const InstallSchedule = () => {
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();
    const now = new Date();

    const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [openInspectionDialog, setOpenInspectionDialog] = useState(false);

    const [statusOptions, setStatusOptions] = useState([]);
    const [installerOptions, setInstallerOptions] = useState([]);

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
            const installerOptionsAPI = await bpmAPI.getInstallers();
            const installerResult = installerOptionsAPI.map((row) => {
                return {
                    id: row.installer_id,
                    accreditation: row.accreditation,
                    licence: row.licence,
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                };
            });

            if (mounted.current) {
                setStatusOptions(statusOptionsResult);
                setInstallerOptions(installerResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setStatusOptions(() => ({
                    error: err.message,
                }));
                setInstallerOptions(() => ({
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const scheduleFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            install_scheduled: installState.data?.schedule.scheduled || false,
            schedule: parseISO(installState.data.schedule.date) || now,
            installer_id: installState.data?.schedule.installer.id || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            install_scheduled: Yup.boolean(),
            schedule: Yup.date(),
            installer_id: Yup.number(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                let form_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    form_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenScheduleDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const scheduleFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Install Scheduled',
            name: 'install_scheduled',
            touched: scheduleFormik.touched.install_scheduled,
            errors: scheduleFormik.errors.install_scheduled,
            value: scheduleFormik.values.install_scheduled,
            width: 12,
        },
        {
            id: 2,
            variant: 'DateTime',
            label: 'Install Date',
            name: 'schedule',
            touched: scheduleFormik.touched.schedule,
            errors: scheduleFormik.errors.schedule,
            value: scheduleFormik.values.schedule,
            hidden: !scheduleFormik.values.install_scheduled,
            width: 6,
        },
        {
            id: 3,
            variant: 'Select',
            width: 6,
            touched: scheduleFormik.touched.installer_id,
            errors: scheduleFormik.errors.installer_id,
            value: scheduleFormik.values.installer_id,
            label: 'Installer',
            name: 'installer_id',
            options: installerOptions,
            hidden: !scheduleFormik.values.install_scheduled,
        },
    ];

    const reviewFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            review_approved: installState.data?.review.approved || false,
            review_approved_date:
                parseISO(installState.data?.review.date) || now,
            review_comment: installState.data?.review.comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            review_approved: Yup.boolean(),
            review_approved_date: Yup.date(),
            review_comment: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                let review_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    review_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenScheduleDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const reviewFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Review Approved',
            name: 'review_approved',
            touched: reviewFormik.touched.review_approved,
            errors: reviewFormik.errors.review_approved,
            value: reviewFormik.values.review_approved,
            width: 12,
        },
        {
            id: 2,
            variant: 'Date',
            label: 'Review Date',
            name: 'review_approved_date',
            touched: reviewFormik.touched.review_approved_date,
            errors: reviewFormik.errors.review_approved_date,
            value: reviewFormik.values.review_approved_date,
            hidden: !reviewFormik.values.review_approved,
            width: 6,
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: reviewFormik.touched.review_comment,
            errors: reviewFormik.errors.review_comment,
            value: reviewFormik.values.review_comment,
            hidden: !reviewFormik.values.review_approved,
            label: 'Comment',
            name: 'review_comment',
        },
    ];

    const inspectionFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            inspection_exempted:
                installState.data?.inspection.exempted || false,
            inspection_completed:
                installState.data?.inspection.completed || false,
            inspection_booked: installState.data?.inspection.booked || false,
            inspection_booked_date:
                parseISO(installState.data?.inspection.booking_date) || now,
            inspection_completed_date:
                parseISO(installState.data?.inspection.completed_date) || now,
            inspection_name: installState.data?.inspection.inspector_name || '',
            inspection_licence:
                installState.data?.inspection.inspector_licence || '',
            inspection_ces: installState.data?.inspection.ces_number || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            inspection_exempted: Yup.boolean(),
            inspection_completed: Yup.boolean(),
            inspection_booked: Yup.boolean(),
            inspection_booked_date: Yup.date(),
            inspection_completed_date: Yup.date(),
            inspection_name: Yup.string(),
            inspection_licence: Yup.string(),
            inspection_ces: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                let form_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    form_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenScheduleDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const inspectionFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Inspection Exempted',
            name: 'inspection_exempted',
            touched: inspectionFormik.touched.inspection_exempted,
            errors: inspectionFormik.errors.inspection_exempted,
            value: inspectionFormik.values.inspection_exempted,
            width: 12,
        },
        {
            id: 2,
            variant: 'Control',
            label: 'Inspection Booked',
            name: 'inspection_booked',
            touched: inspectionFormik.touched.inspection_booked,
            errors: inspectionFormik.errors.inspection_booked,
            value: inspectionFormik.values.inspection_booked,
            width: 6,
        },
        {
            id: 3,
            variant: 'Date',
            label: 'Booked Date',
            name: 'inspection_booked_date',
            touched: inspectionFormik.touched.inspection_booked_date,
            errors: inspectionFormik.errors.inspection_booked_date,
            value: inspectionFormik.values.inspection_booked_date,
            hidden: !inspectionFormik.values.inspection_booked,
            width: 6,
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: inspectionFormik.touched.inspection_name,
            errors: inspectionFormik.errors.inspection_name,
            value: inspectionFormik.values.inspection_name,
            hidden: !(
                inspectionFormik.values.inspection_booked ||
                inspectionFormik.values.inspection_completed
            ),
            label: 'Inspector Name',
            name: 'inspection_name',
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: inspectionFormik.touched.inspection_licence,
            errors: inspectionFormik.errors.inspection_licence,
            value: inspectionFormik.values.inspection_licence,
            hidden: !(
                inspectionFormik.values.inspection_booked ||
                inspectionFormik.values.inspection_completed
            ),
            label: 'Inspector Licence',
            name: 'inspection_licence',
        },
        {
            id: 6,
            variant: 'Control',
            label: 'Inspection Completed',
            name: 'inspection_completed',
            touched: inspectionFormik.touched.inspection_completed,
            errors: inspectionFormik.errors.inspection_completed,
            value: inspectionFormik.values.inspection_completed,
            width: 12,
        },
        {
            id: 7,
            variant: 'Date',
            label: 'Booked Date',
            name: 'inspection_completed_date',
            touched: inspectionFormik.touched.inspection_completed_date,
            errors: inspectionFormik.errors.inspection_completed_date,
            value: inspectionFormik.values.inspection_completed_date,
            hidden: !inspectionFormik.values.inspection_completed,
            width: 6,
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: inspectionFormik.touched.inspection_ces,
            errors: inspectionFormik.errors.inspection_ces,
            value: inspectionFormik.values.inspection_ces,
            hidden: !inspectionFormik.values.inspection_completed,
            label: 'CES Number',
            name: 'inspection_ces',
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
                                onEdit={() => setOpenScheduleDialog(true)}
                                title="Schedule Install"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Install Date',
                                        value: installState.data.schedule
                                            .scheduled
                                            ? format(
                                                  parseISO(
                                                      installState.data.schedule
                                                          .date
                                                  ),
                                                  'dd MMM yyyy - p'
                                              )
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Installer Phone',
                                        value: installState.data.schedule
                                            .scheduled
                                            ? installState.data.schedule
                                                  .installer.phone
                                            : '',
                                    },
                                    {
                                        id: 3,
                                        label: 'Installer Accreditation',
                                        value: installState.data.schedule
                                            .scheduled
                                            ? installState.data.schedule
                                                  .installer.accreditation
                                            : '',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Installer',
                                        value: installState.data.schedule
                                            .scheduled
                                            ? installState.data.schedule
                                                  .installer.name
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Installer Email',
                                        value: installState.data.schedule
                                            .scheduled
                                            ? installState.data.schedule
                                                  .installer.email
                                            : '',
                                    },
                                    {
                                        id: 3,
                                        label: 'Installer Licence',
                                        value: installState.data.schedule
                                            .scheduled
                                            ? installState.data.schedule
                                                  .installer.licence
                                            : '',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenReviewDialog(true)}
                                title="Review Install"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Review',
                                        value: installState.data.review.approved
                                            ? 'Approved'
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Comment',
                                        value: installState.data.review.approved
                                            ? installState.data.review.comment
                                            : '',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Reviewed Date',
                                        value: installState.data.review.approved
                                            ? format(
                                                  parseISO(
                                                      installState.data.review
                                                          .date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Reviewed By',
                                        value: installState.data.review.approved
                                            ? installState.data.review.reviewer
                                            : '',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenInspectionDialog(true)}
                                title="Inspection"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Status',
                                        value: installState.data.inspection
                                            .completed
                                            ? 'Completed'
                                            : installState.data.inspection
                                                  .exempted
                                            ? 'Exempted'
                                            : installState.data.inspection
                                                  .booked
                                            ? 'Booked'
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Inspector',
                                        value:
                                            installState.data.inspection
                                                .booked ||
                                            installState.data.inspection
                                                .completed
                                                ? installState.data.inspection
                                                      .inspector_name
                                                : '',
                                    },
                                    {
                                        id: 3,
                                        label: 'CES Number',
                                        value:
                                            installState.data.inspection
                                                .booked ||
                                            installState.data.inspection
                                                .completed
                                                ? installState.data.inspection
                                                      .ces_number
                                                : '',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: installState.data.inspection
                                            .completed
                                            ? 'Completed Date'
                                            : installState.data.inspection
                                                  .booked
                                            ? 'Booked Date'
                                            : 'Completed/Booked Date',
                                        value: installState.data.inspection
                                            .completed
                                            ? format(
                                                  parseISO(
                                                      installState.data
                                                          .inspection
                                                          .completed_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : installState.data.inspection
                                                  .booked
                                            ? format(
                                                  parseISO(
                                                      installState.data
                                                          .inspection
                                                          .booking_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Inspector Licence',
                                        value:
                                            installState.data.inspection
                                                .booked ||
                                            installState.data.inspection
                                                .completed
                                                ? installState.data.inspection
                                                      .inspector_licence
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
                    onClose={() => setOpenScheduleDialog(false)}
                    open={openScheduleDialog}
                    formik={scheduleFormik}
                    title="Schedule Install"
                    fields={scheduleFormFields}
                />
                <FormDialog
                    onClose={() => setOpenReviewDialog(false)}
                    open={openReviewDialog}
                    formik={reviewFormik}
                    title="Review Install"
                    fields={reviewFormFields}
                />
                <FormDialog
                    onClose={() => setOpenInspectionDialog(false)}
                    open={openInspectionDialog}
                    formik={inspectionFormik}
                    title="Inspection"
                    fields={inspectionFormFields}
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
