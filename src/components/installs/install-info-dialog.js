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
} from '@mui/material';
import { InputField } from '../form/input-field';

export const InstallInfoDialog = (props) => {
    const { open, onClose, lead: install } = props;
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: install?.name || '',
            address: install?.address || '',
            email: install?.email || '',
            phone: install?.contactNum || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(255).required('Name is required'),
            address: Yup.string().max(255).required('Address is required'),
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phone: Yup.string().max(255).required('Phone number is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                toast.success('Lead updated');
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
            <DialogTitle>Edit Install</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.name && formik.errors.name
                            )}
                            fullWidth
                            helperText={
                                formik.touched.name && formik.errors.name
                            }
                            label="Name"
                            name="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="name"
                            value={formik.values.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.address && formik.errors.address
                            )}
                            fullWidth
                            helperText={
                                formik.touched.address && formik.errors.address
                            }
                            label="Address"
                            name="address"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.address}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.email && formik.errors.email
                            )}
                            fullWidth
                            helperText={
                                formik.touched.email && formik.errors.email
                            }
                            label="Email"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.phone && formik.errors.phone
                            )}
                            fullWidth
                            helperText={
                                formik.touched.phone && formik.errors.phone
                            }
                            label="Phone number"
                            name="phone"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.phone}
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

InstallInfoDialog.defaultProps = {
    open: false,
};

InstallInfoDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
