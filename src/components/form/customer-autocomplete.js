import PropTypes from 'prop-types';
import { TextField, Grid } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { alpha } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import throttle from 'lodash/throttle';

// Local Import
import { bpmAPI } from '../../api/bpm/bpm-api';

const filter = createFilterOptions();

export const CustomerAutocomplete = (props) => {
    const {
        error,
        helperText,
        label,
        placeholder,
        field_name,
        formik,
        ...other
    } = props;

    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState();
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const customerAPI = useMemo(
        () =>
            throttle(async (request, callback) => {
                const response = await bpmAPI.searchCustomer(request.input);
                callback(response);
            }, 200),
        []
    );

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        customerAPI({ input: inputValue }, async (results) => {
            if (active) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    const data = results.map((item) => {
                        return {
                            id: item.customer_id,
                            name: item.name,
                            phone: item.phone,
                            email: item.email,
                        };
                    });
                    newOptions = [...newOptions, ...data];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, customerAPI]);

    return (
        <Autocomplete
            id="customer-autocomplete"
            getOptionLabel={(option) => option.name}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== '') {
                    filtered.push({
                        inputValue: params.inputValue,
                        name: 'Create new customer',
                        email: '',
                        phone: '',
                    });
                }

                return filtered;
            }}
            filterSelectedOptions
            options={options}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
                formik.setFieldValue(
                    field_name,
                    newValue !== null ? newValue.id : ''
                );
            }}
            autoComplete
            freeSolo
            sx={{
                '& .MuiFilledInput-root .MuiFilledInput-input': {
                    px: 1.5,
                    py: 0.75,
                },
            }}
            renderInput={({ InputProps, ...rest }) => (
                <TextField
                    {...rest}
                    error={error}
                    helperText={helperText}
                    label={label}
                    placeholder={placeholder}
                    sx={{
                        '& .MuiFilledInput-root': {
                            backgroundColor: 'background.paper',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? 'neutral.300'
                                    : 'neutral.700',
                            borderRadius: 1,
                            boxShadow: '0px 1px 2px 0px rgba(9, 30, 66, 0.08)',
                            '&.MuiAutocomplete-inputRoot': {
                                p: 0,
                            },
                            transition: (theme) =>
                                theme.transitions.create([
                                    'border-color',
                                    'box-shadow',
                                ]),
                            '&:hover': {
                                backgroundColor: 'background.paper',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'background.paper',
                                boxShadow: (theme) =>
                                    `${alpha(
                                        theme.palette.primary.main,
                                        0.25
                                    )} 0 0 0 0.2rem`,
                            },
                            '& .MuiFilledInput-input': {
                                fontSize: 14,
                                height: 'unset',
                                lineHeight: 1.6,
                                px: 1.5,
                                py: 0.75,
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'action.disabledBackground',
                                boxShadow: 'none',
                                borderColor: alpha('#D6DBE1', 0.5),
                            },
                            ':not(.MuiInputBase-adornedStart)': {
                                p: 0,
                            },
                        },
                    }}
                    variant="filled"
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    InputProps={{
                        disableUnderline: true,
                        ...InputProps,
                    }}
                    InputLabelProps={{
                        shrink: true,
                        sx: {
                            color: 'text.primary',
                            fontSize: 14,
                            fontWeight: 500,
                            mb: 0.5,
                            position: 'relative',
                            transform: 'none',
                        },
                    }}
                />
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Grid container spacing={4}>
                                    <Grid item>{option.name}</Grid>
                                    <Grid item>{option.email}</Grid>
                                    <Grid item>{option.phone}</Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
            ChipProps={{ variant: 'outlined' }}
            {...other}
        />
    );
};

CustomerAutocomplete.propTypes = {
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
};
