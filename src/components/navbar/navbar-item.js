import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import { lightNeutral } from '../../colors';

export const NavbarItem = (props) => {
    const {
        active,
        href,
        icon: Icon,
        title
    } = props;

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
                    margin: 0
                },
                '& .MuiButton-endIcon': {
                    color: 'action.disabled',
                    display: 'none',
                    marginLeft: 'auto'
                }
            }}
            to={href}
            variant="text"
        >
            <Typography
                color="textPrimary"
                sx={{
                    color: active ? lightNeutral[200] : lightNeutral[500],
                    display: 'flex',
                    ml: 1.25
                }}
                variant="inherit"
            >
                {title}
            </Typography>
        </Button>
    );
}

NavbarItem.propTypes = {
    active: PropTypes.bool,
    href: PropTypes.string,
    icon: PropTypes.elementType,
    title: PropTypes.string
};