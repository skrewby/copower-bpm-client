import PropTypes from 'prop-types';
import { Box, TextField, Grid } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { alpha } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useMemo, useState } from 'react';
import throttle from 'lodash/throttle';
import wretch from 'wretch';

const filter = createFilterOptions();
const baseUrl = 'http://165.22.253.133:5000/api/addresses';

export const AddressAutocomplete = (props) => {
    const {
        error,
        helperText,
        label,
        placeholder,
        field_name,
        field_name_id,
        formik,
        ...other
    } = props;

    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState();
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const adressAPI = useMemo(
        () =>
            throttle((request, callback) => {
                const body = { query: request.input };
                wretch().url(baseUrl).post(body).json(callback);
            }, 200),
        []
    );

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        adressAPI({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    const data = results.map((item) => {
                        return { sla: item.sla, id: item.pid };
                    });
                    newOptions = [...newOptions, ...data];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, adressAPI]);

    return (
        <Autocomplete
            id="address-autocomplete"
            getOptionLabel={(option) => option.sla}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== '') {
                    filtered.push({
                        inputValue: params.inputValue,
                        id: '',
                        sla: params.inputValue,
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
                    newValue !== null ? newValue.sla : ''
                );
                formik.setFieldValue(
                    field_name_id,
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
                            <Grid item>
                                <Box
                                    component={LocationOnIcon}
                                    sx={{ color: 'text.secondary', mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                {option.sla}
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

AddressAutocomplete.propTypes = {
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
};
