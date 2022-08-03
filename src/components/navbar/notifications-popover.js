import { format, parseISO } from 'date-fns';
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
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import GamepadIcon from '@mui/icons-material/Gamepad';
import CommentIcon from '@mui/icons-material/Comment';

// Local Import
import { usePopover } from '../../hooks/use-popover';
import { useCallback, useEffect, useState } from 'react';
import { bpmAPI } from '../../api/bpm/bpm-api';
import { socket } from '../../contexts/socket-context';

const iconTags = [
    {
        id: 'default',
        icon: GamepadIcon,
        iconColor: '#4888f0',
    },
    {
        id: 'success',
        icon: AutoAwesomeIcon,
        iconColor: '#ffb400',
    },
    {
        id: 'failure',
        icon: PriorityHighOutlinedIcon,
        iconColor: '#e61c19',
    },
    {
        id: 'announcement',
        icon: CampaignIcon,
        iconColor: '#2a8532',
    },
    {
        id: 'comment',
        icon: CommentIcon,
        iconColor: '#4970ff',
    },
];

export const NotificationsPopover = (props) => {
    const [anchorRef, open, handleOpen, handleClose] = usePopover();
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const getData = useCallback(async () => {
        const result = await bpmAPI.getNotifications();
        const data = result.map((notification) => {
            notification.create_date = parseISO(notification.create_date);
            return notification;
        });
        setNotifications(data);
        socket.emit('notify', 'Hello World');
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        socket.on('new-notification', () => {
            getData();
        });
    }, [getData]);

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
                    {notifications.length > 0 &&
                        notifications.map((notification, index) => {
                            const { title, create_date, icon, details } =
                                notification;

                            const tag = iconTags.find(
                                (iconTag) => iconTag.id === icon
                            );
                            return (
                                <Stack key={notification.id} direction="row">
                                    <ListItem
                                        disableGutters
                                        divider={
                                            notifications.length > index + 1
                                        }
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            {tag.icon && (
                                                <tag.icon
                                                    fontSize="small"
                                                    sx={{
                                                        color: tag.iconColor,
                                                    }}
                                                />
                                            )}
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
                                                create_date,
                                                'MMM dd, yyyy - hh:mm a'
                                            )}
                                        </Typography>
                                    </ListItem>
                                    <IconButton
                                        onClick={() => {
                                            setNotifications(
                                                notifications.filter(
                                                    (item) =>
                                                        item.id !==
                                                        notification.id
                                                )
                                            );
                                            bpmAPI.deleteNotification(
                                                notification.id
                                            );
                                        }}
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
