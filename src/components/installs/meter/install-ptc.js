import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { format } from 'date-fns';
import { bpmAPI } from '../../../api/bpmAPI';
import { useMounted } from '../../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const InstallPTC = (props) => {
    const { onEdit, install, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Permission to Connect"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="PTC Status"
                            value={
                                install.ptc_approved
                                    ? 'Approved'
                                    : install.ptc_exempted
                                    ? 'Exempted'
                                    : install.ptc_form_sent
                                    ? 'Waiting for Approval'
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="PTC Approval Date"
                            value={
                                install.ptc_approved
                                    ? format(
                                          parseISO(install.ptc_approval_date),
                                          'dd MMM yyyy'
                                      )
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Approval Condition"
                            value={
                                install.ptc_approved
                                    ? install.ptc_condition
                                    : ''
                            }
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="PTC Form Sent Date"
                            value={
                                install.ptc_form_sent
                                    ? format(
                                          parseISO(install.ptc_form_sent_date),
                                          'dd MMM yyyy'
                                      )
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Approval Number"
                            value={
                                install.ptc_approved ? install.ptc_number : ''
                            }
                        />
                    </PropertyList>
                </Grid>
            </Grid>
        </Card>
    );
};

InstallPTC.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
