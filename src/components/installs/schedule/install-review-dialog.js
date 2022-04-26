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
    Checkbox,
    Box,
} from '@mui/material';
import { InputField } from '../../form/input-field';
import { DateField } from '../../form/date-field';
import { bpmAPI } from '../../../api/bpmAPI';
import parseISO from 'date-fns/parseISO';

const now = new Date();

export const InstallReviewDialog = (props) => {
    const { open, onClose, install, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            review_greenbot_approved:
                install?.review_greenbot_approved || false,
            review_greenbot_approved_date:
                parseISO(install?.review_greenbot_approved_date) || now,
            review_comment: install?.review_comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            review_greenbot_approved: Yup.boolean(),
            review_greenbot_approved_date: Yup.date(),
            review_comment: Yup.string(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let form_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    install.install_id,
                    form_values
                );
                if (res.status === 200) {
                    toast.success('Install updated');
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
            <DialogTitle>Review Install</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        formik.values.review_greenbot_approved
                                    }
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'review_greenbot_approved',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Greenbot Reviewed"
                        />
                    </Grid>
                    {formik.values.review_greenbot_approved ? (
                        <Grid item md={6} xs={6}>
                            <DateField
                                error={Boolean(
                                    formik.touched
                                        .review_greenbot_approved_date &&
                                        formik.errors
                                            .review_greenbot_approved_date
                                )}
                                fullWidth
                                helperText={
                                    formik.touched
                                        .review_greenbot_approved_date &&
                                    formik.errors.review_greenbot_approved_date
                                }
                                label="Greenbot Reviewed Date"
                                name="review_greenbot_approved_date"
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        'review_greenbot_approved_date',
                                        date
                                    )
                                }
                                value={
                                    formik.values.review_greenbot_approved_date
                                }
                            />
                        </Grid>
                    ) : null}
                    {formik.values.review_greenbot_approved ? (
                        <Grid item xs={12}>
                            <InputField
                                error={Boolean(
                                    formik.touched.review_comment &&
                                        formik.errors.review_comment
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.review_comment &&
                                    formik.errors.review_comment
                                }
                                label="Comment"
                                name="review_comment"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.review_comment}
                            />
                        </Grid>
                    ) : null}
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

InstallReviewDialog.defaultProps = {
    open: false,
};

InstallReviewDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
