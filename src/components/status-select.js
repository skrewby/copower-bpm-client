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
          key={option.value}
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
          value={option.value}
        >
          <StatusBadge
            color={option.color}
            sx={{
              backgroundColor: option.color,
              mr: 1
            }}
          />
          {option.label}
        </MenuItem>
      ))}
    </InputField>
  );
};

StatusSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired
};
