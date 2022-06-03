import PropTypes from 'prop-types';

// Material UI
import { MenuItem } from '@mui/material';

// Components
import { InputField } from '../form/input-field';
import { StatusBadge } from './status-badge';

export const StatusSelect = (props) => {
    const { options, ...other } = props;

    return (
        <InputField fullWidth select {...other}>
            {options.map((option) => (
                <MenuItem
                    key={option.id}
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                    value={option.id}
                >
                    <StatusBadge
                        color={option.colour}
                        sx={{
                            backgroundColor: option.colour,
                            mr: 1,
                        }}
                    />
                    {option.name}
                </MenuItem>
            ))}
        </InputField>
    );
};

StatusSelect.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            colour: PropTypes.string.isRequired,
        })
    ).isRequired,
};
