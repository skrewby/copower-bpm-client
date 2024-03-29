import PropTypes from 'prop-types';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

// Material UI
import { Avatar, Box, Card, Typography } from '@mui/material';

export const LogEntry = (props) => {
    const { log, sx, showStatus, statusDescription, ...other } = props;

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
                    {showStatus ? (
                        <>
                            <Typography color="textSecondary" variant="caption">
                                {`${format(
                                    parseISO(log.create_date),
                                    'dd MMM yyyy HH:mm'
                                )} - ${statusDescription}:`}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                                &nbsp;
                            </Typography>
                            <Typography
                                color={log.status_colour}
                                variant="caption"
                            >
                                {log.status}
                            </Typography>
                        </>
                    ) : (
                        <Typography color="textSecondary" variant="caption">
                            {`${format(
                                parseISO(log.create_date),
                                'dd MMM yyyy HH:mm'
                            )}`}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

LogEntry.defaultProps = {
    showStatus: false,
    statusDescription: '',
};

LogEntry.propTypes = {
    log: PropTypes.object.isRequired,
    sx: PropTypes.object,
    showStatus: PropTypes.bool,
    statusDescription: PropTypes.string,
};
