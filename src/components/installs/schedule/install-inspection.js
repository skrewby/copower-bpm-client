import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { format } from 'date-fns';
import { bpmAPI } from '../../../api/bpmAPI';
import { useMounted } from '../../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const InstallInspection = (props) => {
    const { onEdit, install, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Inspection"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Booked Date"
                            value={
                                install.inspection_booked
                                    ? format(
                                          parseISO(
                                              install.inspection_booked_date
                                          ),
                                          'dd MMMM yyyy'
                                      )
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Inspector Licence"
                            value={
                                install.inspection_booked
                                    ? install.inspection_licence
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Completed"
                            value={
                                install.inspection_completed
                                    ? 'Inspection Completed'
                                    : 'Not completed'
                            }
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Inspector Name"
                            value={
                                install.inspection_booked
                                    ? install.inspection_name
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Exempted"
                            value={
                                install.inspection_exempted
                                    ? 'Inspection Exempted'
                                    : 'Not exempted'
                            }
                        />
                        <PropertyListItem
                            label="Completion Date Date"
                            value={
                                install.inspection_completed
                                    ? format(
                                          parseISO(
                                              install.inspection_completed_date
                                          ),
                                          'dd MMMM yyyy'
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

InstallInspection.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
