import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Material UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
} from '@mui/material';

// Components
import { InputField } from '../form/input-field';

export const CommentDialog = (props) => {
    const { open, onClose, title, submitFunction } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            comment: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            comment: Yup.string().max(255).required('Comment required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await submitFunction(values.comment);

                if (res.status === 201) {
                    toast.success('Success');
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
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
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

CommentDialog.defaultProps = {
    open: false,
};

CommentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    submitFunction: PropTypes.func,
};
