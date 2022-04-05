import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Box,
    Collapse,
    Divider,
    Link,
    ListItem,
    Typography,
} from '@mui/material';
import { InstallSummary } from './install-summary';

export const InstallPreviewItem = (props) => {
    const { install, ...other } = props;
    const [expanded] = useState(false);

    return (
        <ListItem
            disableGutters
            disablePadding
            key={install.id}
            sx={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'stretch',
            }}
            {...other}
        >
            <Box
                sx={{
                    display: {
                        sm: 'flex',
                        xs: 'block',
                    },
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            mr: 2,
                            px: 1.5,
                            py: 0.5,
                        }}
                    >
                        <Typography color="textSecondary" variant="h5">
                            {format(new Date(install.createdAt), 'dd')}
                        </Typography>
                        <Typography color="textSecondary" variant="caption">
                            {format(new Date(install.createdAt), 'MMM yy')}
                        </Typography>
                    </Box>
                    <div>
                        <Link
                            color="textPrimary"
                            component={RouterLink}
                            sx={{ display: 'block' }}
                            to="#"
                            underline="none"
                            variant="body2"
                        >
                            {`${install.customer.firstName} ${install.customer.lastName}`}
                        </Link>
                        <Link
                            color="textSecondary"
                            component={RouterLink}
                            to="#"
                            underline="none"
                            variant="body2"
                        >
                            {`#${install.id}`}
                        </Link>
                    </div>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        ml: {
                            sm: 0,
                            xs: 1.5,
                        },
                    }}
                ></Box>
            </Box>
            <Collapse in={expanded}>
                <Divider />
                <InstallSummary install={install} />
            </Collapse>
        </ListItem>
    );
};

InstallPreviewItem.propTypes = {
    install: PropTypes.object.isRequired,
};
