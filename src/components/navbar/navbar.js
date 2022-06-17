import { useState, useEffect } from 'react';
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';

// Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

// Components
import { NavbarItem } from './navbar-item';
import { NavbarAccount } from './navbar-account';
import { NotificationsPopover } from './notifications-popover';

import { useSettings } from '../../contexts/settings-context';

/**
 * The navigation bar at the top of the page
 */
export const Navbar = (props) => {
    const { items } = props;
    const { settings, saveSettings } = useSettings();
    const [darkMode, setDarkMode] = useState(settings.theme === 'dark');
    const { pathname } = useLocation();
    const [activeItem, setActiveItem] = useState(null);

    const handleSwitchTheme = () => {
        saveSettings({
            ...settings,
            theme: settings.theme === 'light' ? 'dark' : 'light',
        });

        setDarkMode(settings.theme === 'light');
    };

    useEffect(() => {
        setActiveItem(null);
        items.forEach((item) => {
            if (item.items) {
                for (let index = 0; index < item.items.length; index++) {
                    const active = !!matchPath(
                        {
                            path: item.items[index].href.concat('/*'),
                            exact: false,
                            strict: false,
                        },
                        pathname
                    );

                    if (active) {
                        setActiveItem(item);
                        break;
                    }
                }
            } else {
                const active = !!matchPath(
                    {
                        path: item.href.concat('/*'),
                        exact: false,
                        strict: false,
                    },
                    pathname
                );

                if (active) {
                    setActiveItem(item);
                }
            }
        });
    }, [items, pathname]);

    return (
        <AppBar elevation={0} sx={{ backgroundColor: '#1e212a' }}>
            <Toolbar
                disableGutters
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    minHeight: 64,
                    px: 3,
                    py: 1,
                }}
            >
                <Stack direction="row" spacing={2}>
                    {items.map((item) => (
                        <NavbarItem
                            active={activeItem?.title === item.title}
                            key={item.title}
                            {...item}
                        />
                    ))}
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    color="inherit"
                    onClick={handleSwitchTheme}
                    sx={{
                        mx: 2,
                        display: {
                            md: 'inline-flex',
                            xs: 'none',
                        },
                    }}
                >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <NotificationsPopover sx={{ mr: 2 }} />
                <NavbarAccount
                    darkMode={darkMode}
                    onSwitchTheme={handleSwitchTheme}
                />
            </Toolbar>
        </AppBar>
    );
};

Navbar.propTypes = {
    /** The buttons displayed on the navbar that can be clicked to navigate. Refer to NavbarItem */
    items: PropTypes.array,
};
