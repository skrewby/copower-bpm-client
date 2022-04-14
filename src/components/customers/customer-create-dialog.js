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
import { InputField } from '../form/input-field';
import { AddressAutocomplete } from '../form/address-autocomplete';
import { bpmAPI } from '../../api/bpmAPI';

export const CustomerCreateDialog = (props) => {
    const { open, onClose, refresh, ...other } = props;
    
    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            email: '',
            first_name: '',
            last_name: '',
            company_name: '',
            company_abn: '',
            phone: '',
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
                    .createCustomer(formik.values)
                    .then(refresh(true));
                if (res.status === 201) {
                    bpmAPI.createCustomerLog(res.customer_id, 'Created Customer', true);
                    toast.success(`Customer Created`);
                } else {
                    toast.error(`Something went wrong`);
                }
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

    return (
        <Dialog
            onClose={onClose}
            open={open}
            TransitionProps={{
                onExited: () => formik.resetForm(),
            }}
            {...other}
        >
            <DialogTitle>Add Customer</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.first_name &&
                                    formik.errors.first_name
                            )}
                            fullWidth
                            helperText={
                                formik.touched.first_name &&
                                formik.errors.first_name
                            }
                            label="First Name"
                            name="first_name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.first_name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.last_name &&
                                    formik.errors.last_name
                            )}
                            fullWidth
                            helperText={
                                formik.touched.last_name &&
                                formik.errors.last_name
                            }
                            label="Last Name"
                            name="last_name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.last_name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.company_name &&
                                    formik.errors.company_name
                            )}
                            fullWidth
                            helperText={
                                formik.touched.company_name &&
                                formik.errors.company_name
                            }
                            label="Company Name"
                            name="company_name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.company_name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.company_abn &&
                                    formik.errors.company_abn
                            )}
                            fullWidth
                            helperText={
                                formik.touched.company_abn &&
                                formik.errors.company_abn
                            }
                            label="Company ABN"
                            name="company_abn"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.company_abn}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.phone && formik.errors.phone
                            )}
                            fullWidth
                            helperText={
                                formik.touched.phone && formik.errors.phone
                            }
                            label="Phone"
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
                <Button color="primary" onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    disabled={formik.isSubmitting}
                    onClick={() => {
                        formik.handleSubmit();
                    }}
                    variant="contained"
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CustomerCreateDialog.defaultProps = {
    open: false,
};

CustomerCreateDialog.propTypes = {
    customer: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
};
