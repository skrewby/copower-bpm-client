import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { format } from 'date-fns';
import { bpmAPI } from '../../../api/bpmAPI';
import { useMounted } from '../../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const InstallPayments = (props) => {
    const { onEdit, install, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Payments"
            />
            <Divider />
            <Grid container>
                <Grid item sm={4} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Deposit Paid"
                            value={install.deposit_paid ? 'Paid' : ''}
                        />
                        <PropertyListItem
                            label="Invoice Paid"
                            value={install.invoice_paid ? 'Paid' : ''}
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Deposit Amount"
                            value={
                                install.deposit_paid
                                    ? install.deposit_amount === null
                                        ? ''
                                        : install.deposit_amount.toString()
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Invoice Amount"
                            value={
                                install.invoice_paid
                                    ? install.invoice_amount === null
                                        ? ''
                                        : install.invoice_amount.toString()
                                    : ''
                            }
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Deposit Paid Date"
                            value={
                                install.deposit_paid
                                    ? format(
                                          parseISO(install.deposit_paid_date),
                                          'dd MMM yyyy'
                                      )
                                    : ''
                            }
                        />
                        <PropertyListItem
                            label="Invoice Paid Date"
                            value={
                                install.invoice_paid
                                    ? format(
                                          parseISO(install.invoice_paid_date),
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

InstallPayments.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
