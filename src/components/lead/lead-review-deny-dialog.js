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
import { bpmAPI } from '../../api/bpmAPI';

export const LeadReviewDenyDialog = (props) => {
    const { open, onClose, leadID, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            reject_reason: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            reject_reason: Yup.string()
                .max(255)
                .required('Deny reason required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.createLeadLog(
                    leadID,
                    `Marked review as failed. Reason: ${values.reject_reason}`,
                    true
                );
                const res = await bpmAPI
                    .updateLead(leadID, { status_id: 3 })
                    .then(refresh(true));

                if (res.status === 200) {
                    toast.success('Denied lead submission request');
                } else {
                    toast.error('Something went wrong');
                }
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
            <DialogTitle>Deny Lead Submission</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.reject_reason &&
                                    formik.errors.reject_reason
                            )}
                            fullWidth
                            helperText={
                                formik.touched.reject_reason &&
                                formik.errors.reject_reason
                            }
                            label="Reason"
                            name="reject_reason"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.reject_reason}
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
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

LeadReviewDenyDialog.defaultProps = {
    open: false,
};

LeadReviewDenyDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    leadID: PropTypes.number,
};
