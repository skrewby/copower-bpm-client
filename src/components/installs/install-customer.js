import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    Grid,
} from '@mui/material';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';
import { bpmAPI } from '../../api/bpmAPI';
import { useMounted } from '../../hooks/use-mounted';

export const InstallCustomer = (props) => {
    const { install, onEdit, ...other } = props;
    const [customer, setCustomer] = useState({});
    const mounted = useMounted();

    const getData = useCallback(async () => {
        setCustomer({});

        try {
            const result = await bpmAPI.getCustomer(install.customer_id);

            if (mounted.current) {
                setCustomer(result);
            }
        } catch (err) {
            console.error(err);
        }
    }, [install.customer_id, mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Customer"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem label="Name" value={customer.name} />
                        <PropertyListItem
                            label="Company Name"
                            value={customer.company_name}
                        />
                        <PropertyListItem
                            label="Email Address"
                            value={customer.email}
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Phone Number"
                            value={customer.phone}
                        />
                        <PropertyListItem
                            label="Company ABN"
                            value={customer.company_abn}
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

InstallCustomer.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
