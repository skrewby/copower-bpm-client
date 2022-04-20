import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    MenuItem,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { InputField } from '../../form/input-field';
import { DateField } from '../../form/date-field';
import { bpmAPI } from '../../../api/bpmAPI';
import parseISO from 'date-fns/parseISO';

const now = new Date();

export const InstallPaymentsDialog = (props) => {
    const { open, onClose, install, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            deposit_paid: install?.deposit_paid || false,
            deposit_amount: install?.deposit_amount || '',
            deposit_paid_date: parseISO(install?.deposit_paid_date) || now,
            invoice_paid: install?.invoice_paid || false,
            invoice_amount: install?.invoice_amount || '',
            invoice_paid_date: parseISO(install?.invoice_paid_date) || now,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            deposit_paid: Yup.boolean(),
            deposit_amount: Yup.number(),
            deposit_paid_date: Yup.date(),
            invoice_paid: Yup.boolean(),
            invoice_amount: Yup.number(),
            invoice_paid_date: Yup.date()
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let payments_values = Object.fromEntries(Object.entries(values).filter(([_, v]) => (v !== null && v !== "")));

                payments_values.deposit_amount = Number(payments_values.deposit_amount);    
                payments_values.invoice_amount = Number(payments_values.invoice_amount);    
                const res = await bpmAPI.updateInstall(install.install_id, payments_values);
                if (res.status === 200) {
                    toast.success('Property updated');
                } else {
                    toast.error('Something went wrong');
                }

                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                onClose?.();
                refresh(true);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <Dialog
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    width: '100%',
                },
            }}
            TransitionProps={{
                onExited: () => formik.resetForm(),
            }}
        >
            <DialogTitle>Edit Payments</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    checked={formik.values.deposit_paid}
                                    onChange={(event) => formik.setFieldValue('deposit_paid',
                                        event.target.checked)}
                                />
                             )}
                      label="Deposit Paid"
                    />
                    </Grid>
                    {formik.values.deposit_paid ?
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.deposit_amount &&
                                    formik.errors.deposit_amount
                            )}
                            fullWidth
                            helperText={
                                formik.touched.deposit_amount &&
                                formik.errors.deposit_amount
                            }
                            label="Deposit Amount"
                            name="deposit_amount"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.deposit_amount}
                        />
                    </Grid>
                    :
                    null
                    }
                    {formik.values.deposit_paid ?
                    <Grid
                    item
                    md={6}
                    xs={6}
                  >
                    <DateField
                      error={Boolean(formik.touched.deposit_paid_date && formik.errors.deposit_paid_date)}
                      fullWidth
                      helperText={formik.touched.deposit_paid_date && formik.errors.deposit_paid_date}
                      label="Deposit Paid Date"
                      name="deposit_paid_date"
                      onChange={(date) => formik.setFieldValue('deposit_paid_date', date)}
                      value={formik.values.deposit_paid_date}
                    />
                  </Grid>
                  :
                  null
                  }

                  <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    checked={formik.values.invoice_paid}
                                    onChange={(event) => formik.setFieldValue('invoice_paid',
                                        event.target.checked)}
                                />
                             )}
                      label="Invoice Paid"
                    />
                    </Grid>
                    {formik.values.invoice_paid ?
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.invoice_amount &&
                                    formik.errors.invoice_amount
                            )}
                            fullWidth
                            helperText={
                                formik.touched.invoice_amount &&
                                formik.errors.invoice_amount
                            }
                            label="Invoice Amount"
                            name="invoice_amount"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.invoice_amount}
                        />
                    </Grid>
                    :
                    null
                    }
                    {formik.values.invoice_paid ?
                    <Grid
                    item
                    md={6}
                    xs={6}
                  >
                    <DateField
                      error={Boolean(formik.touched.invoice_paid_date && formik.errors.invoice_paid_date)}
                      fullWidth
                      helperText={formik.touched.invoice_paid_date && formik.errors.invoice_paid_date}
                      label="Invoice Paid Date"
                      name="invoice_paid_date"
                      onChange={(date) => formik.setFieldValue('invoice_paid_date', date)}
                      value={formik.values.invoice_paid_date}
                    />
                  </Grid>
                  :
                  null
                  }
                    {formik.errors.submit && (
                        <Grid item xs={12}>
                            <FormHelperText error>
                                {formik.errors.submit}
                            </FormHelperText>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose} variant="text">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        formik.handleSubmit();
                    }}
                    variant="contained"
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

InstallPaymentsDialog.defaultProps = {
    open: false,
};

InstallPaymentsDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
