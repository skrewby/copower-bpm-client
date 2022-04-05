import {
    Card,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography
  } from '@mui/material';
  import AllInboxIcon from '@mui/icons-material/AllInbox';
  import GroupIcon from '@mui/icons-material/Group';
  import EngineeringIcon from '@mui/icons-material/Engineering';
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
  
  export const Notifications = () => (
    <Card variant="outlined">
      <List>
        <ListItem divider>
          <ListItemIcon>
            <AllInboxIcon sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography
                color="inherit"
                variant="body2"
              >
                <Typography
                  color="inherit"
                  component="span"
                  variant="subtitle2"
                >
                  3 leads
                </Typography>
                {' '}
                in progress.
              </Typography>
            )}
          />
          <ListItemSecondaryAction>
            <IconButton size="small">
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem divider>
          <ListItemIcon>
            <GroupIcon sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography
                color="inherit"
                variant="body2"
              >
                <Typography
                  color="inherit"
                  component="span"
                  variant="subtitle2"
                >
                  1 team notes
                </Typography>
                {' '}
                from
                {' '}
                <Typography
                  color="inherit"
                  component="span"
                  variant="subtitle2"
                >
                  Isabella.
                </Typography>
              </Typography>
            )}
          />
          <ListItemSecondaryAction>
            <IconButton size="small">
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EngineeringIcon sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography
                color="inherit"
                variant="body2"
              >
                <Typography
                  color="inherit"
                  component="span"
                  variant="subtitle2"
                >
                  3 installations
                </Typography>
                {' '}
                scheduled for this week.
              </Typography>
            )}
          />
          <ListItemSecondaryAction>
            <IconButton size="small">
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Card>
  );
  