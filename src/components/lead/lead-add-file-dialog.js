import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Typography,
} from '@mui/material';
import { Trash as TrashIcon } from '../../icons/trash';
import { InputField } from '../form/input-field';
import { ImageDropzone } from '../image-dropzone';

const currencyOptions = [
    {
        label: 'EUR',
        value: 'eur',
    },
    {
        label: 'USD',
        value: 'usd',
    },
];

const fileTypeOptions = [
    {
        label: 'Meterbox',
        value: 'meterbox',
    },
    {
        label: 'Panel Design',
        value: 'panelDesign',
    },
    {
        label: 'Panel String Design',
        value: 'panelStringDesign',
    },
    {
        label: 'Front of House',
        value: 'frontHouse',
    },
    {
        label: 'Energy Bill',
        value: 'energyBill',
    },
    {
        label: 'Misc',
        value: 'misc',
    },
];

export const LeadAddFileDialog = (props) => {
    const { open, onClose, onExited, onVariantsChange, variant, ...other } =
        props;
    const mode = variant ? 'update' : 'add';
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fileType: variant?.fileType || '',
            file: variant?.file || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            fileType: Yup.string()
                .oneOf(fileTypeOptions.map((option) => option.value))
                .required('File type is required'),
            file: Yup.string().required('File is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                toast.success(
                    mode === 'update' ? 'File updated' : 'File uploaded'
                );
                onVariantsChange?.({ ...variant, ...values }, mode);
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
                onExited: () => {
                    onExited?.();
                    formik.resetForm();
                },
            }}
            {...other}
        >
            <DialogTitle>
                {mode === 'update' ? 'Update File' : 'Add File'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputField
                            error={Boolean(
                                formik.touched.fileType &&
                                    formik.errors.fileType
                            )}
                            helperText={
                                formik.touched.fileType &&
                                formik.errors.fileType
                            }
                            label="Type"
                            name="fileType"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            sx={{ minWidth: 236 }}
                            value={formik.values.fileType}
                        >
                            {fileTypeOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            color="textPrimary"
                            sx={{ mb: 1.25 }}
                            variant="subtitle2"
                        >
                            File
                        </Typography>
                        {formik.values.file ? (
                            <Box
                                sx={{
                                    borderRadius: 1,
                                    boxShadow:
                                        '0 0 0 1px rgba(24, 33, 77, 0.23)',
                                    display: 'flex',
                                    position: 'relative',
                                    width: 'fit-content',
                                    '& img': {
                                        borderRadius: 1,
                                        display: 'block',
                                        maxWidth: 126,
                                    },
                                    '&:hover': {
                                        boxShadow: (theme) =>
                                            `0 0 0 1px ${theme.palette.primary.main}`,
                                        '& > button': {
                                            display: 'block',
                                        },
                                        '& img': {
                                            opacity: 0.3,
                                        },
                                    },
                                }}
                            >
                                <img
                                    alt={formik.values.name}
                                    src={formik.values.image}
                                />
                                <IconButton
                                    color="error"
                                    onClick={() =>
                                        formik.setFieldValue('image', '')
                                    }
                                    sx={{
                                        display: 'none',
                                        left: 0,
                                        position: 'absolute',
                                        top: 0,
                                    }}
                                >
                                    <TrashIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <ImageDropzone
                                onDrop={(files) =>
                                    formik.setFieldValue(
                                        'image',
                                        URL.createObjectURL(files[0])
                                    )
                                }
                                sx={{
                                    minHeight: 126,
                                    maxWidth: 126,
                                }}
                            />
                        )}
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
                    {mode === 'update' ? 'Update Variant' : 'Add Variant'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

LeadAddFileDialog.defaultProps = {
    open: false,
};

LeadAddFileDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onExited: PropTypes.func,
    onVariantsChange: PropTypes.func,
    variant: PropTypes.object,
};
