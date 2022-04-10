import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';
import { bpmAPI } from '../../api/bpmAPI';
import { useMounted } from '../../hooks/use-mounted';

export const InstallPropertyDetails = (props) => {
    const { onEdit, install, ...other } = props;
    const [property, setProperty] = useState({});
    const mounted = useMounted();

    const getData = useCallback(async () => {
        setProperty({});

        try {
            const result = await bpmAPI.getProperty(install.property_id);

            if (mounted.current) {
                setProperty(result);
            }
        } catch (err) {
            console.error(err);
        }
    }, [install.property_id, mounted]);

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
                title="Property Details"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Address"
                            value={property.address}
                        />
                        <PropertyListItem
                            label="Phases"
                            value={`${property.phase ?? ''}`}
                        />
                        <PropertyListItem
                            label="Story"
                            value={property.story}
                        />
                        <PropertyListItem label="NMI" value={property.nmi} />
                        <PropertyListItem
                            label="Roof Type"
                            value={property.roof_type}
                        />
                        <PropertyListItem
                            label="Comment"
                            value={property.comment}
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Existing System"
                            value={property.existing_system}
                        />
                        <PropertyListItem
                            label="Retailer"
                            value={property.retailer}
                        />
                        <PropertyListItem
                            label="Distributor"
                            value={property.distributor}
                        />
                        <PropertyListItem
                            label="Meter Number"
                            value={property.meter}
                        />
                        <PropertyListItem
                            label="Roof Pitch"
                            value={property.roof_pitch}
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

InstallPropertyDetails.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
