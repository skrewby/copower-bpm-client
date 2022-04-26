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
} from '@mui/material';
import { InputField } from '../../form/input-field';
import { DateField } from '../../form/date-field';
import { bpmAPI } from '../../../api/bpmAPI';
import parseISO from 'date-fns/parseISO';

const now = new Date();

export const InstallRetailerDialog = (props) => {
    const { open, onClose, install, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            retailer_notice_complete:
                install?.retailer_notice_complete || false,
            retailer_notice_date:
                parseISO(install?.retailer_notice_date) || now,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            retailer_notice_complete: Yup.boolean(),
            retailer_notice_date: Yup.date(),
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
            <DialogTitle>Retailer Notice</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        formik.values.retailer_notice_complete
                                    }
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'retailer_notice_complete',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Retailer Notice Complete"
                        />
                    </Grid>
                    {formik.values.retailer_notice_complete ? (
                        <Grid item md={6} xs={6}>
                            <DateField
                                error={Boolean(
                                    formik.touched.retailer_notice_date &&
                                        formik.errors.retailer_notice_date
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.retailer_notice_date &&
                                    formik.errors.retailer_notice_date
                                }
                                label="Retailer Notice Date"
                                name="retailer_notice_date"
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        'retailer_notice_date',
                                        date
                                    )
                                }
                                value={formik.values.retailer_notice_date}
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

InstallRetailerDialog.defaultProps = {
    open: false,
};

InstallRetailerDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
