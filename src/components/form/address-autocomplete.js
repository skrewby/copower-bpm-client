import * as React from 'react';
import throttle from 'lodash/throttle';
import wretch from 'wretch';

// Material UI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';

let baseUrl = 'http://165.22.253.133:5000/api/addresses';

export function AddressAutocomplete(props) {
    const { formik, ...other } = props;
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
            sx={{ paddingY: 1 }}
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
            renderInput={(params) => (
                <TextField {...params} label="Address" fullWidth />
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
