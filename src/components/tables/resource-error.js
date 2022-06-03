import PropTypes from 'prop-types';

// Material UI
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

const ResourceErrorRoot = styled('div')(({ theme }) => ({
    alignItems: 'center',
    backgroundColor: theme.palette.neutral[100],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(3),
}));

export const ResourceError = (props) => {
    const { error, onReload, ...other } = props;

    return (
        <ResourceErrorRoot {...other}>
            <ErrorOutlineIcon sx={{ color: 'text.secondary' }} />
            <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                {error || 'Error loading data, please try again.'}
            </Typography>
            {onReload && (
                <Button
                    color="primary"
                    onClick={onReload}
                    startIcon={<RefreshIcon fontSize="small" />}
                    sx={{ mt: 2 }}
                    variant="text"
                >
                    Reload Data
                </Button>
            )}
        </ResourceErrorRoot>
    );
};

ResourceError.propTypes = {
    error: PropTypes.string,
    onReload: PropTypes.func,
};
