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

export const InstallPTCDialog = (props) => {
    const { open, onClose, install, refresh } = props;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            ptc_form_sent: install?.ptc_form_sent || false,
            ptc_form_sent_date: parseISO(install?.ptc_form_sent_date) || now,
            ptc_approved: install?.ptc_approved || false,
            ptc_approval_date: parseISO(install?.ptc_approval_date) || now,
            ptc_number: install?.ptc_number || '',
            ptc_condition: install?.ptc_condition || '',
            ptc_exempted: install?.ptc_exempted || false,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            ptc_form_sent: Yup.boolean(),
            ptc_form_sent_date: Yup.date(),
            ptc_approved: Yup.boolean(),
            ptc_approval_date: Yup.date(),
            ptc_number: Yup.string(255),
            ptc_condition: Yup.string(255),
            ptc_exempted: Yup.boolean(),
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
            <DialogTitle>Permission to Connect</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.ptc_form_sent}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'ptc_form_sent',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="PTC Form Sent"
                        />
                    </Grid>
                    {formik.values.ptc_form_sent ? (
                        <Grid item md={6} xs={6}>
                            <DateField
                                error={Boolean(
                                    formik.touched.ptc_form_sent_date &&
                                        formik.errors.ptc_form_sent_date
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.ptc_form_sent_date &&
                                    formik.errors.ptc_form_sent_date
                                }
                                label="PTC Form Sent Date"
                                name="ptc_form_sent_date"
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        'ptc_form_sent_date',
                                        date
                                    )
                                }
                                value={formik.values.ptc_form_sent_date}
                            />
                        </Grid>
                    ) : null}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.ptc_approved}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'ptc_approved',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="PTC Approved"
                        />
                    </Grid>
                    {formik.values.ptc_approved ? (
                        <Grid item md={6} xs={6}>
                            <DateField
                                error={Boolean(
                                    formik.touched.ptc_approval_date &&
                                        formik.errors.ptc_approval_date
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.ptc_approval_date &&
                                    formik.errors.ptc_approval_date
                                }
                                label="PTC Approval Date"
                                name="ptc_approval_date"
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        'ptc_approval_date',
                                        date
                                    )
                                }
                                value={formik.values.ptc_approval_date}
                            />
                        </Grid>
                    ) : null}
                    {formik.values.ptc_approved ? (
                        <Grid item xs={6}>
                            <InputField
                                error={Boolean(
                                    formik.touched.ptc_number &&
                                        formik.errors.ptc_number
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.ptc_number &&
                                    formik.errors.ptc_number
                                }
                                label="Approval Number"
                                name="ptc_number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.ptc_number}
                            />
                        </Grid>
                    ) : null}
                    {formik.values.ptc_approved ? (
                        <Grid item xs={12}>
                            <InputField
                                error={Boolean(
                                    formik.touched.ptc_condition &&
                                        formik.errors.ptc_condition
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.ptc_condition &&
                                    formik.errors.ptc_condition
                                }
                                label="Approval Condition"
                                name="ptc_condition"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.ptc_condition}
                            />
                        </Grid>
                    ) : null}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.ptc_exempted}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'ptc_exempted',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="PTC Exempted"
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

InstallPTCDialog.defaultProps = {
    open: false,
};

InstallPTCDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
