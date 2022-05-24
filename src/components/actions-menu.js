import PropTypes from 'prop-types';

// Material UI
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local import
import { usePopover } from '../hooks/use-popover';

export const ActionsMenu = (props) => {
    const { actions, label, ...other } = props;
    const [anchorRef, open, handleOpen, handleClose] = usePopover();

    return (
        <>
            <Button
                color="primary"
                endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                onClick={handleOpen}
                size="large"
                variant="contained"
                ref={anchorRef}
                {...other}
            >
                {label}
            </Button>
            <Menu
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {actions.map((item) => (
                    <MenuItem
                        key={item.label}
                        onClick={() => {
                            if (item.onClick) {
                                item.onClick();
                            }

                            handleClose();
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

ActionsMenu.defaultProps = {
    label: 'Actions',
};

ActionsMenu.propTypes = {
    actions: PropTypes.array.isRequired,
    label: PropTypes.string,
};
