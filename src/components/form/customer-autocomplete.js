import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import throttle from 'lodash/throttle';
import wretch from 'wretch';
import { bpmAPI } from '../../api/bpmAPI';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function CustomerAutocomplete(props) {
    const { formik, ...other  } = props;
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState(null);
    const [options, setOptions] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);

    async function searchCustomers(query) {
        if(query) {
            if(query.length > 1) {
                bpmAPI.searchCustomers(query).then((res) => setCustomers(res));
            }
        }
    }

    React.useEffect(() => {
        let active = true;

        if(active) {
            if (inputValue === '') {
                setOptions(value ? [value] : []);
                return undefined;
            }
    
            let newOptions = [];
    
            if(customers) {
                newOptions = customers;
            }
            setOptions(newOptions);
        }

        return () => {
            active = false;
        }
    }, [customers, inputValue, value]);

    return (
        <Autocomplete
            id="customer_id"
            name="customer_id"
            sx={{ paddingY: 1 }}
            isOptionEqualToValue={(option, value) => {
                return option.customer_id === value}}
            getOptionLabel={(option) =>
                {
                    // Very hacky way to get the input box to display the selected customer 
                    // Will first check if the option is a JSON object (happens when typing)
                    // If it's just the value (the customer_id), it will search the customers 
                    // array to find it. This happen once you click on the options
                    if(option.name) {
                        return option.name;
                    }else {
                        const res = customers.filter((c) => c.customer_id === option);
                        const customer = res[0] || null;
                        return customer ? (customer.company_name || customer.name) : "";
                    }
                }
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            onChange={(event, newValue) => {
                formik.setFieldValue(
                    "customer_id",
                    newValue !== null ? newValue.customer_id : null
                  );
            }}
            onInputChange={(event, newInputValue) => {
                searchCustomers(newInputValue);
                setInputValue(newInputValue);     
            }}
            renderInput={(params) => (
                <TextField {...params} label="Customer" fullWidth />
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={AccountCircleIcon}
                                    sx={{ color: 'text.secondary', mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                {option.company_name ? option.company_name : option.name}
                            </Grid>
                            <Grid item xs>
                                {option.email}
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
            {...other}
        />
    );
}
