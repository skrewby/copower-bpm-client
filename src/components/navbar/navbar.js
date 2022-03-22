import { useState } from 'react';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// Icons
import { Moon as MoonIcon } from '../../icons/moon';
import { Sun as SunIcon } from '../../icons/sun';
import { ChevronDown as ChevronDownIcon } from '../../icons/chevron-down';

// Components
import { NotificationsPopover } from './notifications-popover';
import { AccountPopover } from './account-popover';

import { useSettings } from '../../contexts/settings-context';

export const Navbar = () => {
    const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { settings, saveSettings } = useSettings();
    const [openMenu, setOpenMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(settings.theme === 'dark');

    const handleSwitchTheme = () => {
        saveSettings({
            ...settings,
            theme: settings.theme === 'light' ? 'dark' : 'light'
        });

        setDarkMode(settings.theme === 'light');
    };

    return (
        <AppBar
            elevation={0}
            sx={{ backgroundColor: '#1e212a' }}
        >
            <Toolbar
                disableGutters
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    minHeight: 64,
                    px: 3,
                    py: 1
                }}
            >
                <IconButton
                    color="inherit"
                    onClick={handleSwitchTheme}
                    sx={{
                        mx: 2,
                        display: {
                            md: 'inline-flex',
                            xs: 'none'
                        }
                    }}
                >
                    {darkMode
                        ? <SunIcon />
                        : <MoonIcon />}
                </IconButton>
                <NotificationsPopover sx={{ mr: 2 }} />
                <AccountPopover
                    darkMode={darkMode}
                    onSwitchTheme={handleSwitchTheme}
                />
            </Toolbar>
        </AppBar>
    );
}