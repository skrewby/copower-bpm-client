import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';

export const LeadPropertyDetails = (props) => {
    const { onEdit, lead, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Property Details"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Phases"
                            value={`${lead.phase ?? ''}`}
                        />
                        <PropertyListItem label="Story" value={lead.story} />
                        <PropertyListItem
                            label="Roof Type"
                            value={lead.roof_type}
                        />
                        <PropertyListItem label="NMI" value={lead.nmi} />
                        <PropertyListItem
                            label="Comment"
                            value={lead.property_comment}
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Existing System"
                            value={lead.existing_system}
                        />
                        <PropertyListItem
                            label="Retailer"
                            value={lead.retailer}
                        />
                        <PropertyListItem
                            label="Distributor"
                            value={lead.distributor}
                        />
                        <PropertyListItem
                            label="Meter Number"
                            value={lead.meterNum}
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

LeadPropertyDetails.propTypes = {
    onEdit: PropTypes.func,
    lead: PropTypes.object.isRequired,
};
