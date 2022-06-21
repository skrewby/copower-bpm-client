import * as React from 'react';
import throttle from 'lodash/throttle';
import wretch from 'wretch';

// Material UI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';

let baseUrl = 'http://165.22.253.133:5000/api/addresses';

export function AddressAutocomplete(props) {
    const { formik, error, helperText, label, placeholder, ...other } = props;
    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const adressAPI = React.useMemo(
        () =>
            throttle((request, callback) => {
                const body = { query: request.input };
                wretch().url(baseUrl).post(body).json(callback);
            }, 200),
        []
    );

    React.useEffect(() => {
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
            id="address"
            name="address"
            sx={{
                '& .MuiFilledInput-root .MuiFilledInput-input': {
                    px: 1.5,
                    py: 0.75,
                },
            }}
            size="small"
            freeSolo
            getOptionLabel={(option) => option.sla}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            onChange={(event, newValue) => {
                formik.setFieldValue(
                    'address',
                    newValue !== null ? newValue.sla : ''
                );
                formik.setFieldValue(
                    'address_id',
                    newValue !== null ? newValue.id : ''
                );
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={({ InputProps, ...rest }) => (
                <TextField
                    {...rest}
                    error={formik.error}
                    helperText={formik.helperText}
                    label={formik.label}
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
            {...other}
        />
    );
}
