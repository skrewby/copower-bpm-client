import { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import { InputField } from '../form/input-field';
import { bpmAPI } from '../../api/bpmAPI';
import toast from 'react-hot-toast';

export const OrganizationEditUserDialog = (props) => {
    const { open, onClose, roleOptions, user, refresh, ...other } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: user?.email || '',
            displayName: user?.displayName || '',
            phoneNumber: user?.phoneNumber || '',
            role: user?.role || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phoneNumber: Yup.string()
                .matches(
                    /^\+?[1-9]\d{1,14}$/,
                    'Phone number must be in the E.164 format (ex. +61412345678)'
                )
                .required('Phone number is required'),
            displayName: Yup.string().max(255).required('Name is required'),
            role: Yup.mixed().oneOf(roleOptions.map((option) => option.value)),
        }),
        onSubmit: async (values, helpers) => {
            try {
                bpmAPI.updateUser(values);
                toast.success('Updated member. Refresh to see changes');
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
            TransitionProps={{
                onExited: () => formik.resetForm(),
            }}
            {...other}
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Edit team member</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <InputField
                                error={Boolean(
                                    formik.touched.displayName &&
                                        formik.errors.displayName
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.displayName &&
                                    formik.errors.displayName
                                }
                                label="Display Name"
                                name="displayName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.displayName}
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
                                label="Email address"
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
                                    formik.touched.phoneNumber &&
                                        formik.errors.phoneNumber
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.phoneNumber &&
                                    formik.errors.phoneNumber
                                }
                                label="Phone Number"
                                name="phoneNumber"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.phoneNumber}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                color="textPrimary"
                                sx={{ mb: 1.5 }}
                                variant="subtitle2"
                            >
                                Role
                            </Typography>
                            <Card variant="outlined">
                                <RadioGroup
                                    name="role"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.role}
                                >
                                    {roleOptions.map((option, index) => (
                                        <Fragment key={option.id}>
                                            <FormControlLabel
                                                disableTypography
                                                control={
                                                    <Radio color="primary" />
                                                }
                                                label={
                                                    <div>
                                                        <Typography
                                                            color="textPrimary"
                                                            variant="body1"
                                                        >
                                                            {option.label}
                                                        </Typography>
                                                    </div>
                                                }
                                                sx={{ p: 1.5 }}
                                                value={option.value}
                                            />
                                            {roleOptions.length > index + 1 && (
                                                <Divider />
                                            )}
                                        </Fragment>
                                    ))}
                                </RadioGroup>
                            </Card>
                            {formik.touched.role && formik.errors.role && (
                                <FormHelperText error>
                                    {formik.errors.role}
                                </FormHelperText>
                            )}
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
                    <Button
                        color="primary"
                        onClick={onClose}
                        type="button"
                        variant="text"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                    >
                        Update
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

OrganizationEditUserDialog.defaultProps = {
    open: false,
};

OrganizationEditUserDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    roleOptions: PropTypes.array,
    user: PropTypes.object,
};
