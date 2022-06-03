import React from 'react';
import PropTypes from 'prop-types';

// Material UI
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

// Components
import { InputField } from '../form/input-field';
import { AddressAutocomplete } from '../form/address-autocomplete';

export const FormDialog = (props) => {
    const { open, onClose, formik, title, fields } = props;

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
                    {fields.map((field) => {
                        if (field.variant === 'Input') {
                            return (
                                <React.Fragment key={field.id}>
                                    <Grid item xs={field.width}>
                                        <InputField
                                            error={Boolean(
                                                field.touched && field.errors
                                            )}
                                            fullWidth
                                            helperText={
                                                field.touched && field.errors
                                            }
                                            label={field.label}
                                            name={field.name}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type={field.type}
                                            value={field.value}
                                        />
                                    </Grid>
                                </React.Fragment>
                            );
                        } else if (field.variant === 'Select') {
                            return (
                                <React.Fragment key={field.id}>
                                    <Grid item xs={field.width}>
                                        <InputField
                                            error={Boolean(
                                                field.touched && field.errors
                                            )}
                                            fullWidth
                                            helperText={
                                                field.touched && field.errors
                                            }
                                            label={field.label}
                                            name={field.name}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            select
                                            value={field.value}
                                        >
                                            {field.options.map((option) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </InputField>
                                    </Grid>
                                </React.Fragment>
                            );
                        } else if (field.variant === 'Address') {
                            return (
                                <React.Fragment key={field.id}>
                                    <Grid item xs={field.width}>
                                        <AddressAutocomplete
                                            fullWidth
                                            formik={formik}
                                        />
                                    </Grid>
                                </React.Fragment>
                            );
                        } else if (field.variant === 'Custom') {
                            return field.customComponent;
                        }
                        return <Grid item xs={12}></Grid>;
                    })}
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

FormDialog.defaultProps = {
    open: false,
};

FormDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
};
