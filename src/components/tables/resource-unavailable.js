import PropTypes from 'prop-types';

// Material UI
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddBoxIcon from '@mui/icons-material/AddBox';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ResourceUnavailableRoot = styled('div')(({ theme }) => ({
    alignItems: 'center',
    backgroundColor: theme.palette.neutral[100],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(3),
}));

export const ResourceUnavailable = (props) => {
    const { onCreate, ...other } = props;

    return (
        <ResourceUnavailableRoot {...other}>
            <HelpOutlineIcon />
            <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                There is nothing here yet.
            </Typography>
            {onCreate && (
                <Button
                    color="primary"
                    onClick={onCreate}
                    startIcon={<AddBoxIcon />}
                    sx={{ mt: 2 }}
                    variant="contained"
                >
                    Add
                </Button>
            )}
        </ResourceUnavailableRoot>
    );
};

ResourceUnavailable.propTypes = {
    onCreate: PropTypes.func,
};
