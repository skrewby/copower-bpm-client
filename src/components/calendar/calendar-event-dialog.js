import { useMemo } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { addMinutes } from 'date-fns';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    Dialog,
    Divider,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createEvent, deleteEvent, updateEvent } from '../../slices/calendar';
import { useDispatch } from '../../store';
import { DateTimePicker } from '@mui/lab';

export const CalendarEventDialog = (props) => {
    const {
        event,
        onAddComplete,
        onClose,
        onDeleteComplete,
        onEditComplete,
        open,
        range,
        ...other
    } = props;
    const dispatch = useDispatch();
    const initialValues = useMemo(() => {
        if (event) {
            return {
                allDay: event.allDay || false,
                color: event.color || '',
                description: event.description || '',
                end: event.end
                    ? new Date(event.end)
                    : addMinutes(new Date(), 30),
                start: event.start ? new Date(event.start) : new Date(),
                title: event.title || '',
                submit: null,
            };
        }

        if (range) {
            return {
                allDay: false,
                color: '',
                description: '',
                end: new Date(range.end),
                start: new Date(range.start),
                title: '',
                submit: null,
            };
        }

        return {
            allDay: false,
            color: '',
            description: '',
            end: addMinutes(new Date(), 30),
            start: new Date(),
            title: '',
            submit: null,
        };
    }, [event, range]);
    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues,
        validationSchema: Yup.object({
            allDay: Yup.bool(),
            description: Yup.string().max(5000),
            end: Yup.date(),
            start: Yup.date(),
            title: Yup.string().max(255).required('Title is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const data = {
                    allday: values.allDay,
                    description: values.description,
                    enddate: values.end.toISOString(),
                    startdate: values.start.toISOString(),
                    title: values.title,
                };

                if (event) {
                    await dispatch(updateEvent(event.id, data));
                } else {
                    await dispatch(createEvent(data));
                }

                toast.success('Event added!');

                if (!event && onAddComplete) {
                    onAddComplete();
                }

                if (event && onEditComplete) {
                    onEditComplete();
                }
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const handleStartDateChange = (date) => {
        formik.setFieldValue('start', date);

        // Prevent end date to be before start date
        if (formik.values.end && date > formik.values.end) {
            formik.setFieldValue('end', date);
        }
    };

    const handleEndDateChange = (date) => {
        formik.setFieldValue('end', date);

        // Prevent start date to be after end date
        if (formik.values.start && date < formik.values.start) {
            formik.setFieldValue('start', date);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteEvent(event.id));

            onDeleteComplete?.();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ p: 3 }}>
                    <Typography align="center" gutterBottom variant="h5">
                        {event ? 'Edit Event' : 'Add Event'}
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <TextField
                        error={Boolean(
                            formik.touched.title && formik.errors.title
                        )}
                        fullWidth
                        helperText={formik.touched.title && formik.errors.title}
                        label="Title"
                        name="title"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                    />
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            error={Boolean(
                                formik.touched.description &&
                                    formik.errors.description
                            )}
                            fullWidth
                            helperText={
                                formik.touched.description &&
                                formik.errors.description
                            }
                            label="Description"
                            name="description"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.allDay}
                                    name="allDay"
                                    onChange={formik.handleChange}
                                />
                            }
                            label="All day"
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <DateTimePicker
                            label="Start date"
                            inputFormat="dd/MM/yyyy - p"
                            onChange={handleStartDateChange}
                            renderInput={(inputProps) => (
                                <TextField fullWidth {...inputProps} />
                            )}
                            value={formik.values.start}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <DateTimePicker
                            label="End date"
                            inputFormat="dd/MM/yyyy - p"
                            onChange={handleEndDateChange}
                            renderInput={(inputProps) => (
                                <TextField fullWidth {...inputProps} />
                            )}
                            value={formik.values.end}
                        />
                    </Box>
                    {Boolean(formik.touched.end && formik.errors.end) && (
                        <Box sx={{ mt: 2 }}>
                            <FormHelperText error>
                                {formik.errors.end}
                            </FormHelperText>
                        </Box>
                    )}
                </Box>
                <Divider />
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        p: 2,
                    }}
                >
                    {event && (
                        <IconButton onClick={() => handleDelete()}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        disabled={formik.isSubmitting}
                        sx={{ ml: 1 }}
                        type="submit"
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </Box>
            </form>
        </Dialog>
    );
};

CalendarEventDialog.propTypes = {
    event: PropTypes.object,
    onAddComplete: PropTypes.func,
    onCancel: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    range: PropTypes.object,
};
