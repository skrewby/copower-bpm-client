import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { format } from 'date-fns';
import { bpmAPI } from '../../../api/bpmAPI';
import { useMounted } from '../../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const InstallSetSchedule = (props) => {
    const { onEdit, install, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Schedule Install"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Scheduled Date"
                            value={
                                install.install_scheduled
                                    ? format(
                                          parseISO(install.schedule),
                                          'dd/MM/yyyy - h:mm aaa'
                                      )
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Installer Email"
                            value={
                                install.install_scheduled
                                    ? install.installer_email
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Installer Accreditation"
                            value={
                                install.install_scheduled
                                    ? install.installer_accreditation
                                    : ''
                            }
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Assigned Installer"
                            value={
                                install.install_scheduled
                                    ? install.installer_name
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Installer Phone"
                            value={
                                install.install_scheduled
                                    ? install.installer_phone
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Installer Licence"
                            value={
                                install.install_scheduled
                                    ? install.installer_licence
                                    : ''
                            }
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

InstallSetSchedule.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
