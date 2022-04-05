import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';
import { InputField } from './form/input-field';
import { StatusBadge } from './status-badge';

export const StatusSelect = (props) => {
  const { options, ...other } = props;

  return (
    <InputField
      fullWidth
      select
      {...other}
    >
      {options.map((option) => (
        <MenuItem
          key={option.status_id}
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
          value={option.status_id}
        >
          <StatusBadge
            color={option.status_colour}
            sx={{
              backgroundColor: option.status_colour,
              mr: 1
            }}
          />
          {option.status_name}
        </MenuItem>
      ))}
    </InputField>
  );
};

StatusSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    status_id: PropTypes.number.isRequired,
    status_name: PropTypes.string.isRequired,
    status_colour: PropTypes.string.isRequired
  })).isRequired
};
