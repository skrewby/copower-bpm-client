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
} from '@mui/material';
import { CustomerAutocomplete } from '../form/customer-autocomplete';
import { bpmAPI } from '../../api/bpmAPI';

export const InstallChooseCustomerDialog = (props) => {
    const { open, install, onClose, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            customer_id: null,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            customer_id: Yup.number().required(
                'Must select a customer to assign to install'
            ),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await bpmAPI
                    .updateInstall(install.install_id, values)
                    .then();
                if (res.status === 200) {
                    bpmAPI.createInstallLog(
                        install.install_id,
                        `Changed customer`,
                        true
                    );
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                refresh(true);

                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                onClose?.();
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
            <DialogTitle>Choose Customer</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomerAutocomplete
                            fullWidth
                            formik={formik}
                            value={formik.values.customer_id}
                        />
                    </Grid>
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

InstallChooseCustomerDialog.defaultProps = {
    open: false,
};

InstallChooseCustomerDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
