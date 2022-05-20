import PropTypes from 'prop-types';

// Material UI
import { Box, Typography } from '@mui/material';

// Components
import { StatusBadge } from './status-badge';

export const Status = (props) => {
    const { color, label, showBadge, ...other } = props;

    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
            }}
            {...other}
        >
            {showBadge && <StatusBadge color={color} />}
            <Typography
                sx={{
                    color,
                    ml: 1.75,
                }}
                variant="body2"
            >
                {label}
            </Typography>
        </Box>
    );
};

Status.defaultProps = {
    showBadge: true,
};

Status.propTypes = {
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
