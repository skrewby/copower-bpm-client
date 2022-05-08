import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import firebase from '../../lib/firebase';
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
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpmAPI';

export const LeadCreateDialog = (props) => {
    const { open, onClose, refresh, ...other } = props;
    const mounted = useMounted();

    const [users, setUsers] = useState({ isLoading: true, data: [] });
    const [sources, setSources] = useState({ isLoading: true, data: [] });

    const getData = useCallback(async () => {
        try {
            const usersAPI = await bpmAPI.getUsers();
            // TODO: Filter users by roles -> Only show Sales
            const usersResult = usersAPI.map((row) => {
                return {
                    uid: row.uid,
                    displayName: row.displayName,
                };
            });
            const sourcesAPI = await bpmAPI.getLeadSources();
            const sourcesResult = sourcesAPI.map((row) => {
                return {
                    source_id: row.source_id,
                    source_name: row.source_name,
                };
            });

            if (mounted.current) {
                setUsers(() => ({
                    isLoading: false,
                    data: usersResult,
                }));
                setSources(() => ({
                    isLoading: false,
                    data: sourcesResult,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setUsers(() => ({
                    isLoading: false,
                    data: [],
                    error: err.message,
                }));
                setSources(() => ({
                    isLoading: false,
                    data: [],
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            address: '',
            email: '',
            first_name: '',
            last_name: '',
            company_name: '',
            company_abn: '',
            sales_id: '',
            phone: '',
            source_id: '',
            comment: '',
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
            sales_id: Yup.string()
                .max(255)
                .required('Must assign to a sales person'),
            source_id: Yup.number().required('Must choose lead source'),
            phone: Yup.string().max(255).required('Contact number is required'),
            comment: Yup.string().max(255).nullable(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await bpmAPI
                    .createLead(formik.values, refresh)
                    .then(refresh(true));
                if (res.status === 201) {
                    bpmAPI.createLeadLog(res.lead_id, 'Created Lead', true);
                    toast.success(`Lead Created`);
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
            <DialogTitle>Create Lead</DialogTitle>
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
                    <Grid item xs={12}>
                        <AddressAutocomplete fullWidth formik={formik} />
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
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.comment && formik.errors.comment
                            )}
                            fullWidth
                            helperText={
                                formik.touched.comment && formik.errors.comment
                            }
                            label="Comment"
                            name="comment"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.comment}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.source_id &&
                                    formik.errors.source_id
                            )}
                            fullWidth
                            helperText={
                                formik.touched.source_id &&
                                formik.errors.source_id
                            }
                            label="Lead Source"
                            name="source_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            value={formik.values.source_id}
                        >
                            {sources.data.map((option) => (
                                <MenuItem
                                    key={option.source_id}
                                    value={option.source_id}
                                >
                                    {option.source_name}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.sales_id &&
                                    formik.errors.sales_id
                            )}
                            fullWidth
                            helperText={
                                formik.touched.sales_id &&
                                formik.errors.sales_id
                            }
                            label="Assign Sales"
                            name="sales_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            value={formik.values.sales_id}
                        >
                            {users.data.map((option) => (
                                <MenuItem key={option.uid} value={option.uid}>
                                    {option.displayName}
                                </MenuItem>
                            ))}
                        </InputField>
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
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

LeadCreateDialog.defaultProps = {
    open: false,
};

LeadCreateDialog.propTypes = {
    customer: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
};
