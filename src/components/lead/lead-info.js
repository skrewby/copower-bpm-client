import PropTypes from 'prop-types';
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

export const LeadInfo = (props) => {
    const { lead, onEdit, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Lead Info"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Customer Name"
                            value={lead.name}
                        />
                        <PropertyListItem
                            label="Email Address"
                            value={lead.email}
                        />
                        <PropertyListItem
                            label="Phone Number"
                            value={lead.phone}
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Address"
                            value={lead.address}
                        />
                        <PropertyListItem label="Source" value={lead.source} />
                        <PropertyListItem
                            label="Comment"
                            value={lead.comment}
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

LeadInfo.propTypes = {
    onEdit: PropTypes.func,
    lead: PropTypes.object.isRequired,
};
