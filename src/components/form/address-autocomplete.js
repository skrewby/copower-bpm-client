import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import throttle from 'lodash/throttle';
import wretch from 'wretch';

let baseUrl = 'https://addressr.p.rapidapi.com/addresses?q=';
let addressrAPIoptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'addressr.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.REACT_APP_ADDRESSR_KEY,
    },
};

export function AddressAutocomplete(props) {
    const { formik, ...other } = props;
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const adressAPI = React.useMemo(
        () =>
            throttle((request, callback) => {
                const input = encodeURI(request.input);
                const url = `${baseUrl}${input}`;
                wretch()
                    .url(url)
                    .options(addressrAPIoptions)
                    .get()
                    .json(callback);
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
                    const data = results.map((item) => item.sla);
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
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            onChange={(event, newValue) => {
                formik.setFieldValue(
                    'address',
                    newValue !== null ? newValue : ''
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
                                {option}
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
            {...other}
        />
    );
}
