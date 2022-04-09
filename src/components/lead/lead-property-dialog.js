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
} from '@mui/material';
import { InputField } from '../form/input-field';
import { bpmAPI } from '../../api/bpmAPI';
import { useMounted } from '../../hooks/use-mounted';

export const LeadPropertyDialog = (props) => {
    const { open, onClose, lead, refresh } = props;
    const mounted = useMounted();

    const [phaseOptions, setPhaseOptions] = useState([]);
    const [existingSystemOptions, setExistingSystemOptions] = useState([]);
    const [storyOptions, setStoryOptions] = useState([]);
    const [roofTypeOptions, setRoofTypeOptions] = useState([]);

    const getData = useCallback(async () => {
        setPhaseOptions([]);
        setExistingSystemOptions([]);
        setStoryOptions([]);
        setRoofTypeOptions([]);

        try {
            const phasesAPI = await bpmAPI.getPhasesOptions();
            const phasesResult = phasesAPI.map((row) => {
                return {
                    phase_id: row.phase_id,
                    phase_num: row.phase_num,
                };
            });
            const existingSystemAPI = await bpmAPI.getExistingSystemOptions();
            const existingSystemResult = existingSystemAPI.map((row) => {
                return {
                    existing_system_id: row.existing_system_id,
                    existing_system_comment: row.existing_system_comment,
                };
            });
            const storyOptionsAPI = await bpmAPI.getStoryOptions();
            const storyOptionsResult = storyOptionsAPI.map((row) => {
                return {
                    story_id: row.story_id,
                    story_num: row.story_num,
                };
            });
            const roofTypeAPI = await bpmAPI.getRoofTypeOptions();
            const roofTypeResult = roofTypeAPI.map((row) => {
                return {
                    roof_type_id: row.roof_type_id,
                    roof_type_name: row.roof_type_name,
                };
            });

            if (mounted.current) {
                setPhaseOptions(phasesResult);
                setExistingSystemOptions(existingSystemResult);
                setStoryOptions(storyOptionsResult);
                setRoofTypeOptions(roofTypeResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setPhaseOptions(() => ({ error: err.message }));
                setExistingSystemOptions(() => ({ error: err.message }));
                setStoryOptions(() => ({ error: err.message }));
                setRoofTypeOptions(() => ({ error: err.message }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            phase_id: lead?.phase_id || '',
            existing_system_id: lead?.existing_system_id || '',
            story_id: lead?.story_id || '',
            retailer: lead?.retailer || '',
            roof_type_id: lead?.roof_type_id || '',
            distributor: lead?.distributor || '',
            nmi: lead?.nmi || '',
            meter: lead?.meter || '',
            property_comment: lead?.property_comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            phase_id: Yup.number(),
            existing_system_id: Yup.number(),
            story_id: Yup.number(),
            retailer: Yup.string(),
            roof_type_id: Yup.number(),
            distributor: Yup.string(),
            nmi: Yup.string(),
            meter: Yup.string(),
            property_comment: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await bpmAPI.updateLead(lead.lead_id, values);
                if (res.status === 200) {
                    toast.success('Lead updated');
                } else {
                    toast.error('Something went wrong');
                }

                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                onClose?.();
                refresh();
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
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.phase_id &&
                                    formik.errors.phase_id
                            )}
                            fullWidth
                            helperText={
                                formik.touched.phase_id &&
                                formik.errors.phase_id
                            }
                            label="Phases"
                            name="phase_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            value={formik.values.phase_id}
                        >
                            {phaseOptions.map((option) => (
                                <MenuItem
                                    key={option.phase_id}
                                    value={option.phase_id}
                                >
                                    {`${option.phase_num}`}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.existing_system_id &&
                                    formik.errors.existing_system_id
                            )}
                            fullWidth
                            helperText={
                                formik.touched.existing_system_id &&
                                formik.errors.existing_system_id
                            }
                            label="Existing System"
                            name="existing_system_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            value={formik.values.existing_system_id}
                        >
                            {existingSystemOptions.map((option) => (
                                <MenuItem
                                    key={option.existing_system_id}
                                    value={option.existing_system_id}
                                >
                                    {option.existing_system_comment}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.story_id &&
                                    formik.errors.story_id
                            )}
                            fullWidth
                            helperText={
                                formik.touched.story_id &&
                                formik.errors.story_id
                            }
                            label="Story"
                            name="story_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            value={formik.values.story_id}
                        >
                            {storyOptions.map((option) => (
                                <MenuItem
                                    key={option.story_id}
                                    value={option.story_id}
                                >
                                    {option.story_num}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.retailer &&
                                    formik.errors.retailer
                            )}
                            fullWidth
                            helperText={
                                formik.touched.retailer &&
                                formik.errors.retailer
                            }
                            label="Retailer"
                            name="retailer"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.retailer}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.roof_type_id &&
                                    formik.errors.roof_type_id
                            )}
                            fullWidth
                            helperText={
                                formik.touched.roof_type_id &&
                                formik.errors.roof_type_id
                            }
                            label="Roof Type"
                            name="roof_type_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            value={formik.values.roof_type_id}
                        >
                            {roofTypeOptions.map((option) => (
                                <MenuItem
                                    key={option.roof_type_id}
                                    value={option.roof_type_id}
                                >
                                    {option.roof_type_name}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.distributor &&
                                    formik.errors.distributor
                            )}
                            fullWidth
                            helperText={
                                formik.touched.distributor &&
                                formik.errors.distributor
                            }
                            label="Distributor"
                            name="distributor"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.distributor}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.nmi && formik.errors.nmi
                            )}
                            fullWidth
                            helperText={formik.touched.nmi && formik.errors.nmi}
                            label="NMI"
                            name="nmi"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.nmi}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputField
                            error={Boolean(
                                formik.touched.meter && formik.errors.meter
                            )}
                            fullWidth
                            helperText={
                                formik.touched.meter && formik.errors.meter
                            }
                            label="Meter Number"
                            name="meter"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.meter}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.property_comment &&
                                    formik.errors.property_comment
                            )}
                            fullWidth
                            helperText={
                                formik.touched.property_comment &&
                                formik.errors.property_comment
                            }
                            label="Comment"
                            name="property_comment"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.property_comment}
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

LeadPropertyDialog.defaultProps = {
    open: false,
};

LeadPropertyDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    lead: PropTypes.object,
};
