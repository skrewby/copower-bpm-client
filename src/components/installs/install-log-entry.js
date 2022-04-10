import PropTypes from 'prop-types';
import { Avatar, Box, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

export const InstallLogEntry = (props) => {
    const { log, sx, ...other } = props;

    return (
        <Card
            sx={{
                display: 'flex',
                p: 2,
                ...sx,
            }}
            variant="outlined"
            {...other}
        >
            <Avatar variant="rounded" src={'/static/user.png'} />
            <Box
                sx={{
                    flex: 1,
                    ml: 2,
                }}
            >
                <Typography color="textPrimary" variant="h6">
                    {log.user_name}
                </Typography>
                {log.action === true ? (
                    <Typography
                        color="textPrimary"
                        sx={{ fontStyle: 'italic', my: 1 }}
                        variant="body2"
                    >
                        {log.content}
                    </Typography>
                ) : (
                    <Typography
                        color="textPrimary"
                        sx={{ my: 1 }}
                        variant="body2"
                    >
                        {log.content}
                    </Typography>
                )}
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <Typography color="textSecondary" variant="caption">
                        {`${format(
                            parseISO(log.create_date),
                            'dd MMM yyyy HH:mm'
                        )} - Lead state:`}
                    </Typography>
                    <Typography color="textSecondary" variant="caption">
                        &nbsp;
                    </Typography>
                    <Typography color={log.status_colour} variant="caption">
                        {log.status}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

InstallLogEntry.propTypes = {
    log: PropTypes.object.isRequired,
    sx: PropTypes.object,
};
