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
import { DateTimeField } from '../../form/date-time-field';
import { bpmAPI } from '../../../api/bpmAPI';
import parseISO from 'date-fns/parseISO';
import { useMounted } from '../../../hooks/use-mounted';

const now = new Date();

export const InstallSetScheduleDialog = (props) => {
    const { open, onClose, install, refresh } = props;
    const mounted = useMounted();

    const [installers, setInstallers] = useState([]);
    const getData = useCallback(async () => {
        setInstallers([]);

        try {
            const installersAPI = await bpmAPI.getInstallers();
            const installersResult = installersAPI.map((row) => {
                return {
                    installer_id: row.installer_id,
                    installer_name: row.name,
                };
            });

            if (mounted.current) {
                setInstallers(installersResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInstallers(() => ({ error: err.message }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            install_scheduled: install?.install_scheduled || false,
            schedule: parseISO(install?.schedule) || now,
            installer_id: install?.installer_id || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            install_scheduled: Yup.boolean(),
            schedule: Yup.date(),
            installer_id: Yup.number(),
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
            <DialogTitle>Schedule</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.install_scheduled}
                                    onChange={(event) =>
                                        formik.setFieldValue(
                                            'install_scheduled',
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Job ready for install"
                        />
                    </Grid>
                    {formik.values.install_scheduled ? (
                        <Grid item md={6} xs={6}>
                            <DateTimeField
                                error={Boolean(
                                    formik.touched.schedule &&
                                        formik.errors.schedule
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.schedule &&
                                    formik.errors.schedule
                                }
                                label="Install Date"
                                name="schedule"
                                onChange={(date) =>
                                    formik.setFieldValue('schedule', date)
                                }
                                value={formik.values.schedule}
                            />
                        </Grid>
                    ) : null}
                    {formik.values.install_scheduled ? (
                        <Grid item xs={12}>
                            <InputField
                                error={Boolean(
                                    formik.touched.installer_id &&
                                        formik.errors.installer_id
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.installer_id &&
                                    formik.errors.installer_id
                                }
                                label="Assign Installer"
                                name="installer_id"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                value={formik.values.installer_id}
                            >
                                {installers.map((option) => (
                                    <MenuItem
                                        key={option.installer_id}
                                        value={option.installer_id}
                                    >
                                        {option.installer_name}
                                    </MenuItem>
                                ))}
                            </InputField>
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

InstallSetScheduleDialog.defaultProps = {
    open: false,
};

InstallSetScheduleDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    install: PropTypes.object,
};
