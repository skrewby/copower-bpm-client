import PropTypes from 'prop-types';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export const ActionListItem = (props) => {
  const { icon: Icon, label, ...other } = props;

  return (
    <ListItemButton {...other}>
      <ListItemIcon>
        <Icon
          fontSize="small"
          sx={{ color: 'text.secondary' }}
        />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

ActionListItem.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired
};
