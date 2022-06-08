import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import {
    Badge,
    Box,
    IconButton,
    Typography,
    Popover,
    List,
    ListItem,
    ListSubheader,
    Stack,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearIcon from '@mui/icons-material/Clear';

// Local Import
import { usePopover } from '../../hooks/use-popover';
import { useState } from 'react';

const notificationsDefault = [
    {
        id: '1',
        createdAt: new Date().getTime(),
        icon: AutoAwesomeIcon,
        iconColor: '#ffb400',
        title: 'Lead: Marked as win',
        href: '/bpm/leads/1',
        details: 'John Smith - UNIT 1 354 CHISHOLM ROAD, AUBURN NSW 2144',
    },
    {
        id: '2',
        createdAt: new Date().getTime(),
        icon: AutoAwesomeIcon,
        iconColor: '#ffb400',
        title: 'Reject request for lead',
    },
    {
        id: '3',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed',
    },
    {
        id: '4',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed',
    },
    {
        id: '5',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed',
    },
    {
        id: '6',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed',
    },
    {
        id: '7',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed. Testing long title - hello world',
    },
    {
        id: '8',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed',
    },
    {
        id: '9',
        createdAt: new Date().getTime(),
        icon: CampaignIcon,
        iconColor: '#4970ff',
        title: 'New feature just deployed',
    },
];

export const NotificationsPopover = (props) => {
    const [anchorRef, open, handleOpen, handleClose] = usePopover();
    const [notifications, setNotifications] = useState(notificationsDefault);
    const navigate = useNavigate();

    return (
        <>
            <Badge
                badgeContent={notifications.length}
                color="error"
                overlap="circular"
                {...props}
            >
                <IconButton
                    onClick={handleOpen}
                    ref={anchorRef}
                    sx={{
                        color: 'primary.contrastText',
                    }}
                >
                    <NotificationsIcon />
                </IconButton>
            </Badge>
            <Popover
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
                keepMounted
                onClose={handleClose}
                open={open}
                PaperProps={{
                    sx: { width: 350 },
                }}
            >
                <List
                    sx={{
                        p: 1,
                        overflow: 'auto',
                        maxHeight: 500,
                        // hover states
                        '& .MuiListItem-root:hover': {
                            bgcolor: 'highlight',
                        },
                    }}
                    subheader={
                        <ListSubheader style={{ position: 'relative' }}>
                            Notifications
                        </ListSubheader>
                    }
                >
                    {notifications.map((notification, index) => {
                        const {
                            title,
                            createdAt,
                            icon: Icon,
                            iconColor,
                            details,
                        } = notification;

                        return (
                            <Stack key={notification.id} direction="row">
                                <ListItem
                                    disableGutters
                                    divider={notifications.length > index + 1}
                                    key={notification.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        flexDirection: 'column',
                                        p: 1,
                                    }}
                                    onClick={() => {
                                        if (notification.href) {
                                            handleClose();
                                            navigate(notification.href);
                                        }
                                    }}
                                    style={
                                        notification.href && {
                                            cursor: 'pointer',
                                        }
                                    }
                                >
                                    <Box sx={{ display: 'flex' }}>
                                        <Icon
                                            fontSize="small"
                                            sx={{ color: iconColor }}
                                        />
                                        <Typography
                                            color="textPrimary"
                                            sx={{ ml: 1.25 }}
                                            variant="body1"
                                        >
                                            {title}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        color="textSecondary"
                                        variant="body2"
                                    >
                                        {details}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        variant="caption"
                                    >
                                        {format(
                                            createdAt,
                                            'MMM dd, yyyy - hh:mm a'
                                        )}
                                    </Typography>
                                </ListItem>
                                <IconButton
                                    onClick={() =>
                                        setNotifications(
                                            notifications.filter(
                                                (item) =>
                                                    item.id !== notification.id
                                            )
                                        )
                                    }
                                    color="error"
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Stack>
                        );
                    })}
                </List>
            </Popover>
        </>
    );
};
