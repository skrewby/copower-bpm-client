import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';

// Local Import
import { InfoCardList } from './info-card-list';
import { InfoCardListItem } from './info-card-list-item';

/**
 * Displays a card with a grid inside that shows information that is passed to it.
 * The data passed to it must be an array of JSON objects of the format {label: "", value: ""}
 */
export const InfoCard = (props) => {
    const { dataLeft, dataRight, title, onEdit, allowEdit, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            {allowEdit ? (
                <CardHeader
                    action={
                        <Button color="primary" onClick={onEdit} variant="text">
                            Edit
                        </Button>
                    }
                    title={title}
                />
            ) : (
                <CardHeader title={title} />
            )}
            <Divider />
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <InfoCardList>
                        {dataLeft.map((data) => (
                            <React.Fragment key={data.id}>
                                <InfoCardListItem
                                    label={data.label}
                                    value={data.value}
                                    onClick={data.onClick}
                                />
                            </React.Fragment>
                        ))}
                    </InfoCardList>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <InfoCardList>
                        {dataRight.map((data) => (
                            <React.Fragment key={data.id}>
                                <InfoCardListItem
                                    label={data.label}
                                    value={data.value}
                                    onClick={data.onClick}
                                />
                            </React.Fragment>
                        ))}
                    </InfoCardList>
                </Grid>
            </Grid>
        </Card>
    );
};

InfoCard.defaultProps = {
    allowEdit: true,
};

InfoCard.propTypes = {
    /** Function called when the edit button is pressed on the info card */
    onEdit: PropTypes.func,
    /** The string to show in the top of the info card */
    title: PropTypes.string.isRequired,
    /** Information to show on the first column of the grid in the card */
    dataLeft: PropTypes.array.isRequired,
    /** Information to show on the second column of the grid in the card */
    dataRight: PropTypes.array.isRequired,
    allowEdit: PropTypes.bool,
};
