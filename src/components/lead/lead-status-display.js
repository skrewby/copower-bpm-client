import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const LeadStatusDisplay = (props) => {
    const { lead } = props;

    return (
        <Typography color={lead.status_colour} variant="h6">
            {lead.status}
        </Typography>
    );
};

LeadStatusDisplay.propTypes = {
    lead: PropTypes.object,
};
