import PropTypes from 'prop-types';

// Material UI
import { Typography } from '@mui/material';

export const StatusDisplay = (props) => {
    const { status, status_colour } = props;

    return (
        <Typography color={status_colour} variant="h6">
            {status}
        </Typography>
    );
};

StatusDisplay.propTypes = {
    status: PropTypes.string,
    status_colour: PropTypes.string,
};
