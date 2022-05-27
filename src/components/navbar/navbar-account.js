import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Material UI
import {
    Avatar,
    Box,
    Typography,
    Popover,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Local import
import { lightNeutral } from '../../colors';
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useAuth } from '../../hooks/use-auth';
import { usePopover } from '../../hooks/use-popover';

export const NavbarAccount = (props) => {
    const { darkMode, onSwitchTheme, ...other } = props;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [anchorRef, open, handleOpen, handleClose] = usePopover();

    const handleLogout = async () => {
        try {
            handleClose();
            await bpmAPI.logout();
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        }
    };

    return (
        <>
            <Box
                onClick={handleOpen}
                ref={anchorRef}
                sx={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    ml: 2,
                }}
                {...other}
            >
                <Avatar
                    src="/static/user.png"
                    variant="rounded"
                    sx={{
                        height: 40,
                        width: 40,
                    }}
                />
                <Box
                    sx={{
                        alignItems: 'center',
                        display: {
                            md: 'flex',
                            xs: 'none',
                        },
                        flex: 1,
                        ml: 1,
                        minWidth: 120,
                    }}
                >
                    <div>
                        <Typography
                            sx={{
                                color: lightNeutral[500],
                            }}
                            variant="caption"
                        >
                            Logged in as
                        </Typography>
                        <Typography
                            sx={{ color: 'primary.contrastText' }}
                            variant="subtitle2"
                        >
                            {user.name}
                        </Typography>
                    </div>
                    <KeyboardArrowDownIcon
                        sx={{
                            color: 'primary.contrastText',
                            ml: 1,
                        }}
                    />
                </Box>
            </Box>
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
                    sx: {
                        width: 260,
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <List>
                    <ListItem divider>
                        <ListItemAvatar>
                            <Avatar variant="rounded" src="/static/user.png" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.name}
                            secondary="Space Solar Service"
                        />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        divider
                        onClick={handleClose}
                        to="/bpm/account"
                    >
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log out" />
                    </ListItem>
                </List>
            </Popover>
        </>
    );
};

NavbarAccount.propTypes = {
    // @ts-ignore
    darkMode: PropTypes.bool.isRequired,
    onSwitchTheme: PropTypes.func.isRequired,
};
