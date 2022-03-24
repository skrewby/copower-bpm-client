import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
import { useAuth } from '../../hooks/use-auth';
import { usePopover } from '../../hooks/use-popover';
import { ChevronDown as ChevronDownIcon } from '../../icons/chevron-down';
import { Logout as LogoutIcon } from '../../icons/logout';
import { User as UserIcon } from '../../icons/user';
import { lightNeutral } from '../../colors';

export const AccountPopover = (props) => {
  const {
    darkMode,
    onSwitchTheme,
    ...other
  } = props;
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorRef, open, handleOpen, handleClose] = usePopover();

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
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
          ml: 2
        }}
        {...other}
      >
        <Avatar
          src="/static/user-pedro.png"
          variant="rounded"
          sx={{
            height: 40,
            width: 40
          }}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: {
              md: 'flex',
              xs: 'none'
            },
            flex: 1,
            ml: 1,
            minWidth: 120
          }}
        >
          <div>
            <Typography
              sx={{
                color: lightNeutral[500]
              }}
              variant="caption"
            >
              Operations
            </Typography>
            <Typography
              sx={{ color: 'primary.contrastText' }}
              variant="subtitle2"
            >
              Pedro Alves
            </Typography>
          </div>
          <ChevronDownIcon
            sx={{
              color: 'primary.contrastText',
              ml: 1
            }}
          />
        </Box>
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            width: 260,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <List>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src="/static/user-pedro.png"
              />
            </ListItemAvatar>
            <ListItemText
              primary="Pedro Alves"
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
              <UserIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
          <ListItem
            button
            onClick={handleLogout}
          >
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

AccountPopover.propTypes = {
  // @ts-ignore
  darkMode: PropTypes.bool.isRequired,
  onSwitchTheme: PropTypes.func.isRequired,
};