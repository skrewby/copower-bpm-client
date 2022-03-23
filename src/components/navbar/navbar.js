import { useState, useEffect } from 'react';
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, useMediaQuery } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';

// Icons
import { Moon as MoonIcon } from '../../icons/moon';
import { Sun as SunIcon } from '../../icons/sun';
import { ChevronDown as ChevronDownIcon } from '../../icons/chevron-down';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';

// Components
import { NotificationsPopover } from './notifications-popover';
import { AccountPopover } from './account-popover';
import { NavbarItem } from './navbar-item';

import { useSettings } from '../../contexts/settings-context';

const items = [
    {
        icon: HomeOutlinedIcon,
        title: 'Dashboard',
        href: '/bpm/dashboard'
    },
    {
        icon: CalendarMonthOutlinedIcon,
        title: 'Calendar',
        href: '/bpm/calendar'
    },
    {
        icon: HeadsetMicOutlinedIcon,
        title: 'Leads',
        href: '/bpm/leads'
    },
    {
        icon: WbSunnyOutlinedIcon,
        title: 'Installs',
        href: '/bpm/installs'
    },
    {
        icon: BuildOutlinedIcon,
        title: 'Services',
        href: '/bpm/services'
    },
    {
        icon: PersonOutlinedIcon,
        title: 'Customers',
        href: '/bpm/customers'
    },
    {
        icon: WarehouseOutlinedIcon,
        title: 'Stock',
        href: '/bpm/stock'
    }
];

export const Navbar = () => {
    const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { settings, saveSettings } = useSettings();
    const [openMenu, setOpenMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(settings.theme === 'dark');
    const { pathname } = useLocation();
    const [activeItem, setActiveItem] = useState(null);

    const handleSwitchTheme = () => {
        saveSettings({
            ...settings,
            theme: settings.theme === 'light' ? 'dark' : 'light'
        });

        setDarkMode(settings.theme === 'light');
    };

    useEffect(() => {
        items.forEach((item) => {
            if (item.items) {
                for (let index = 0; index < item.items.length; index++) {
                    const active = matchPath({ path: item.items[index].href, end: true }, pathname);

                    if (active) {
                        setActiveItem(item);
                        break;
                    }
                }
            } else {
                const active = !!matchPath({ path: item.href, end: true }, pathname);

                if (active) {
                    setActiveItem(item);
                }
            }
        });
    }, [pathname]);

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
                <Stack direction="row" spacing={2}>
                    {activeItem && (items.map((item) => (
                        <NavbarItem
                            active={activeItem?.title === item.title}
                            key={item.title}
                            {...item}
                        />
                    )))}
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
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