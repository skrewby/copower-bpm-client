import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { format } from 'date-fns';
import { bpmAPI } from '../../../api/bpmAPI';
import { useMounted } from '../../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const InstallReview = (props) => {
    const { onEdit, install, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Review"
            />
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Greenbot Reviewed"
                            value={
                                install.review_greenbot_approved
                                    ? 'Review Approved'
                                    : 'Not completed'
                            }
                        />
                        <PropertyListItem
                            label="Comment"
                            value={
                                install.review_greenbot_approved
                                    ? install.review_comment
                                    : ''
                            }
                        />
                    </PropertyList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PropertyList>
                        <PropertyListItem
                            label="Review Date"
                            value={
                                install.review_greenbot_approved
                                    ? format(
                                          parseISO(
                                              install.review_greenbot_approved_date
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

InstallReview.propTypes = {
    onEdit: PropTypes.func,
    install: PropTypes.object.isRequired,
};
