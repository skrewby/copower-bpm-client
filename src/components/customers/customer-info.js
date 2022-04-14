import PropTypes from 'prop-types';
import {
    Button,
    Card,
    CardHeader,
    Divider,
    Grid,
} from '@mui/material';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';

export const CustomerInfo = (props) => {
    const { customer, onEdit, ...other } = props;

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

CustomerInfo.propTypes = {
    onEdit: PropTypes.func,
    customer: PropTypes.object.isRequired,
};
