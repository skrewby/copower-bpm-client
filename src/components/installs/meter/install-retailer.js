import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { format } from 'date-fns';
import { bpmAPI } from '../../../api/bpmAPI';
import { useMounted } from '../../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const InstallRetailer = (props) => {
    const { onEdit, install, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Retailer Notification"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Notification Sent"
                            value={
                                install.retailer_notice_complete
                                    ? 'Sent'
                                    : 'Not sent'
                            }
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Retailer Notification Sent Date"
                            value={
                                install.retailer_notice_complete
                                    ? format(
                                          parseISO(
                                              install.retailer_notice_date
                                          ),
                                          'dd MMM yyyy'
                                      )
                                    : ''
                            }
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

InstallRetailer.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
