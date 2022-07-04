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

export const InstallFinance = () => {
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();
    const now = new Date();

    const [openPaymentsDialog, setOpenPaymentsDialog] = useState(false);

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

    const paymentsFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            deposit_paid: installState.data?.finance.deposit_paid || false,
            deposit_amount: installState.data?.finance.deposit_amount || '',
            deposit_paid_date:
                parseISO(installState.data?.finance.deposit_paid_date) || now,
            invoice_paid: installState.data?.finance.invoice_paid || false,
            invoice_amount: installState.data?.finance.invoice_amount || '',
            invoice_paid_date:
                parseISO(installState.data?.finance.invoice_paid_date) || now,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            deposit_paid: Yup.boolean(),
            deposit_amount: Yup.number(),
            deposit_paid_date: Yup.date(),
            invoice_paid: Yup.boolean(),
            invoice_amount: Yup.number(),
            invoice_paid_date: Yup.date(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                let payments_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    payments_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenPaymentsDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const paymentsFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Deposit Paid',
            name: 'deposit_paid',
            touched: paymentsFormik.touched.deposit_paid,
            errors: paymentsFormik.errors.deposit_paid,
            value: paymentsFormik.values.deposit_paid,
            width: 12,
        },
        {
            id: 2,
            variant: 'Date',
            label: 'Date Deposit Paid',
            name: 'deposit_paid_date',
            touched: paymentsFormik.touched.deposit_paid_date,
            errors: paymentsFormik.errors.deposit_paid_date,
            value: paymentsFormik.values.deposit_paid_date,
            hidden: !paymentsFormik.values.deposit_paid,
            width: 6,
        },
        {
            id: 3,
            variant: 'Input',
            label: 'Deposit Amount',
            name: 'deposit_amount',
            touched: paymentsFormik.touched.deposit_amount,
            errors: paymentsFormik.errors.deposit_amount,
            value: paymentsFormik.values.deposit_amount,
            hidden: !paymentsFormik.values.deposit_paid,
            width: 6,
        },
        {
            id: 4,
            variant: 'Control',
            label: 'Invoice Paid',
            name: 'invoice_paid',
            touched: paymentsFormik.touched.invoice_paid,
            errors: paymentsFormik.errors.invoice_paid,
            value: paymentsFormik.values.invoice_paid,
            width: 12,
        },
        {
            id: 5,
            variant: 'Date',
            label: 'Date Invoice Paid',
            name: 'invoice_paid_date',
            touched: paymentsFormik.touched.invoice_paid_date,
            errors: paymentsFormik.errors.invoice_paid_date,
            value: paymentsFormik.values.invoice_paid_date,
            hidden: !paymentsFormik.values.invoice_paid,
            width: 6,
        },
        {
            id: 6,
            variant: 'Input',
            label: 'Invoice Amount',
            name: 'invoice_amount',
            touched: paymentsFormik.touched.invoice_amount,
            errors: paymentsFormik.errors.invoice_amount,
            value: paymentsFormik.values.invoice_amount,
            hidden: !paymentsFormik.values.invoice_paid,
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
                                onEdit={() => setOpenPaymentsDialog(true)}
                                title="Payments"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Deposit Payment Date',
                                        value: installState.data.finance
                                            .deposit_paid
                                            ? format(
                                                  parseISO(
                                                      installState.data.finance
                                                          .deposit_paid_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'Awaiting Deposit',
                                    },
                                    {
                                        id: 2,
                                        label: 'Invoice Payment Date',
                                        value: installState.data.finance
                                            .invoice_paid
                                            ? format(
                                                  parseISO(
                                                      installState.data.finance
                                                          .invoice_paid_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'Awaiting Final Payment',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Deposit Amount',
                                        value: installState.data.finance
                                            .deposit_paid
                                            ? installState.data.finance
                                                  .deposit_amount
                                            : '',
                                    },
                                    {
                                        id: 2,
                                        label: 'Invoice Amount',
                                        value: installState.data.finance
                                            .invoice_paid
                                            ? installState.data.finance
                                                  .invoice_amount
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
                    onClose={() => setOpenPaymentsDialog(false)}
                    open={openPaymentsDialog}
                    formik={paymentsFormik}
                    title="Edit Payments"
                    fields={paymentsFormFields}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Install | Copower BPM</title>
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
