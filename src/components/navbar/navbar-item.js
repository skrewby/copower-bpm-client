import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import { Button, Typography } from '@mui/material';

// Local Import
import { lightNeutral } from '../../colors';

/**
 * The buttons that make up a Navbar. It consists of an icon and text that navigates to a route when clicked
 */
export const NavbarItem = (props) => {
    const { active, href, icon: Icon, title } = props;

    return (
        <Button
            component={RouterLink}
            startIcon={<Icon />}
            fullWidth
            sx={{
                justifyContent: 'flex-start',
                lineHeight: 0,
                minWidth: 'fit-content',
                px: 1.25,
                py: 1.25,
                '& .MuiButton-startIcon': {
                    color: active ? lightNeutral[200] : lightNeutral[500],
                    margin: 0,
                },
                '& .MuiButton-endIcon': {
                    color: 'action.disabled',
                    display: 'none',
                    marginLeft: 'auto',
                },
            }}
            to={href}
            variant="text"
        >
            <Typography
                color="textPrimary"
                sx={{
                    color: active ? lightNeutral[200] : lightNeutral[500],
                    display: 'flex',
                    ml: 1.25,
                }}
                variant="inherit"
            >
                {title}
            </Typography>
        </Button>
    );
};

NavbarItem.propTypes = {
    /** Colour the item in a lighter colour to mark as active */
    active: PropTypes.bool,
    /** Route to take to when item is clicked */
    href: PropTypes.string,
    /** Icon to display on left side of item */
    icon: PropTypes.elementType,
    /** Text to display after the icon */
    title: PropTypes.string,
};
