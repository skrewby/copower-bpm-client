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

export const InstallInspectionDialog = (props) => {
    const { open, onClose, install, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            inspection_booked: install?.inspection_booked || false,
            inspection_booked_date:
                parseISO(install?.inspection_booked_date) || now,
            inspection_name: install?.inspection_name || '',
            inspection_licence: install?.inspection_licence || '',
            inspection_exempted: install?.inspection_exempted || false,
            inspection_completed: install?.inspection_completed || false,
            inspection_completed_date:
                parseISO(install?.inspection_completed_date) || now,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            inspection_booked: Yup.boolean(),
            inspection_booked_date: Yup.date(),
            inspection_name: Yup.string(255),
            inspection_licence: Yup.string(255),
            inspection_exempted: Yup.boolean(),
            inspection_completed: Yup.boolean(),
            inspection_completed_date: Yup.date(),
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
            <DialogTitle>Inspection</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.inspection_booked}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'inspection_booked',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Inspection Booked"
                        />
                    </Grid>
                    {formik.values.inspection_booked ? (
                        <Grid item md={6} xs={6}>
                            <DateField
                                error={Boolean(
                                    formik.touched.inspection_booked_date &&
                                        formik.errors.inspection_booked_date
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.inspection_booked_date &&
                                    formik.errors.inspection_booked_date
                                }
                                label="Inspection Booked Date"
                                name="inspection_booked_date"
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        'inspection_booked_date',
                                        date
                                    )
                                }
                                value={formik.values.inspection_booked_date}
                            />
                        </Grid>
                    ) : null}
                    {formik.values.inspection_booked ? (
                        <Grid item md={6} xs={6}>
                            <Box />
                        </Grid>
                    ) : null}
                    {formik.values.inspection_booked ? (
                        <Grid item xs={6}>
                            <InputField
                                error={Boolean(
                                    formik.touched.inspection_name &&
                                        formik.errors.inspection_name
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.inspection_name &&
                                    formik.errors.inspection_name
                                }
                                label="Inspector Name"
                                name="inspection_name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.inspection_name}
                            />
                        </Grid>
                    ) : null}
                    {formik.values.inspection_booked ? (
                        <Grid item xs={6}>
                            <InputField
                                error={Boolean(
                                    formik.touched.inspection_licence &&
                                        formik.errors.inspection_licence
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.inspection_licence &&
                                    formik.errors.inspection_licence
                                }
                                label="Inspector Licence Number"
                                name="inspection_licence"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.inspection_licence}
                            />
                        </Grid>
                    ) : null}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.inspection_completed}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'inspection_completed',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Inspection Completed"
                        />
                    </Grid>
                    {formik.values.inspection_completed ? (
                        <Grid item md={6} xs={6}>
                            <DateField
                                error={Boolean(
                                    formik.touched.inspection_completed_date &&
                                        formik.errors.inspection_completed_date
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.inspection_completed_date &&
                                    formik.errors.inspection_completed_date
                                }
                                label="Inspection Completed Date"
                                name="inspection_completed_date"
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        'inspection_completed_date',
                                        date
                                    )
                                }
                                value={formik.values.inspection_completed_date}
                            />
                        </Grid>
                    ) : null}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.inspection_exempted}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'inspection_exempted',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Inspection Exempted"
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

InstallInspectionDialog.defaultProps = {
    open: false,
};

InstallInspectionDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
