import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Box,
    Collapse,
    Divider,
    IconButton,
    Link,
    ListItem,
    Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Status } from '../../status';
import { InstallSummary } from './install-summary';
import toast from 'react-hot-toast';

const statusVariants = [
    {
        color: 'info.main',
        label: 'Assign',
        value: 'installer',
    },
    {
        color: 'error.main',
        label: 'Pending',
        value: 'pending',
    },
    {
        color: 'warning.main',
        label: 'Installing',
        value: 'progress',
    },
    {
        color: 'success.main',
        label: 'Complete',
        value: 'complete',
    },
];

export const InstallPreviewItem = (props) => {
    const { install, ...other } = props;
    const [expanded, setExpanded] = useState(false);
    const statusVariant = statusVariants.find(
        (variant) => variant.value === install.status
    );

    const handleExpandedChange = () => {
        setExpanded((prev) => !prev);
    };

    const handleGoToInstall = () => {
        toast.error('Not implemented yet');
    };

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
                >
                    <Status
                        color={statusVariant.color}
                        label={statusVariant.label}
                    />
                    <IconButton onClick={handleGoToInstall} sx={{ ml: 3 }}>
                        <ChevronRightIcon
                            sx={{
                                transition: 'transform 150ms',
                                transform: expanded ? 'rotate(180deg)' : 'none',
                            }}
                        />
                    </IconButton>
                </Box>
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
