import { React, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';

// Local import
import { useAuth } from '../hooks/use-auth';

// Components
import { Navbar } from '../components/navbar/navbar';
import { Footer } from '../components/general/footer';

// Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import GroupsIcon from '@mui/icons-material/Groups';

const BPMLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    paddingTop: 64,
}));

const BPMLayoutContent = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const getNavbarItems = (role) => {
    if (role === 'System Administrator' || role === 'Manager') {
        return [
            {
                icon: HomeOutlinedIcon,
                title: 'Dashboard',
                href: '/bpm/dashboard',
            },
            {
                icon: CalendarMonthOutlinedIcon,
                title: 'Calendar',
                href: '/bpm/calendar',
            },
            {
                icon: HeadsetMicOutlinedIcon,
                title: 'Leads',
                href: '/bpm/leads',
            },
            {
                icon: WbSunnyOutlinedIcon,
                title: 'Installs',
                href: '/bpm/installs',
            },
            {
                icon: BuildOutlinedIcon,
                title: 'Services',
                href: '/bpm/services',
            },
            {
                icon: PersonOutlinedIcon,
                title: 'Customers',
                href: '/bpm/customers',
            },
            {
                icon: WarehouseOutlinedIcon,
                title: 'Stock',
                href: '/bpm/stock',
            },
            {
                icon: GroupsIcon,
                title: 'Organisation',
                href: '/bpm/organisation',
            },
        ];
    } else if (
        role === 'Administration Officer' ||
        role === 'Operations' ||
        role === 'Finance'
    ) {
        return [
            {
                icon: HomeOutlinedIcon,
                title: 'Dashboard',
                href: '/bpm/dashboard',
            },
            {
                icon: CalendarMonthOutlinedIcon,
                title: 'Calendar',
                href: '/bpm/calendar',
            },
            {
                icon: HeadsetMicOutlinedIcon,
                title: 'Leads',
                href: '/bpm/leads',
            },
            {
                icon: WbSunnyOutlinedIcon,
                title: 'Installs',
                href: '/bpm/installs',
            },
            {
                icon: BuildOutlinedIcon,
                title: 'Services',
                href: '/bpm/services',
            },
            {
                icon: PersonOutlinedIcon,
                title: 'Customers',
                href: '/bpm/customers',
            },
            {
                icon: WarehouseOutlinedIcon,
                title: 'Stock',
                href: '/bpm/stock',
            },
        ];
    } else if (role === 'Sales' || role === 'Sales Manager') {
        return [
            {
                icon: HomeOutlinedIcon,
                title: 'Dashboard',
                href: '/bpm/dashboard',
            },
            {
                icon: CalendarMonthOutlinedIcon,
                title: 'Calendar',
                href: '/bpm/calendar',
            },
            {
                icon: HeadsetMicOutlinedIcon,
                title: 'Leads',
                href: '/bpm/leads',
            },
            {
                icon: WbSunnyOutlinedIcon,
                title: 'Installs',
                href: '/bpm/installs',
            },
            {
                icon: PersonOutlinedIcon,
                title: 'Customers',
                href: '/bpm/customers',
            },
        ];
    } else if (role === 'Services') {
        return [
            {
                icon: HomeOutlinedIcon,
                title: 'Dashboard',
                href: '/bpm/dashboard',
            },
            {
                icon: CalendarMonthOutlinedIcon,
                title: 'Calendar',
                href: '/bpm/calendar',
            },
            {
                icon: WbSunnyOutlinedIcon,
                title: 'Installs',
                href: '/bpm/installs',
            },
            {
                icon: BuildOutlinedIcon,
                title: 'Services',
                href: '/bpm/services',
            },
            {
                icon: PersonOutlinedIcon,
                title: 'Customers',
                href: '/bpm/customers',
            },
            {
                icon: WarehouseOutlinedIcon,
                title: 'Stock',
                href: '/bpm/stock',
            },
        ];
    }
    return [];
};

export const BPMLayout = () => {
    const { user } = useAuth();
    const [navbarItems, setNavbarItems] = useState([]);

    useEffect(() => {
        setNavbarItems(getNavbarItems(user.role));
    }, [user.role]);

    return (
        <BPMLayoutRoot>
            <Navbar items={navbarItems} />
            <BPMLayoutContent>
                <Outlet />
                <Footer />
            </BPMLayoutContent>
        </BPMLayoutRoot>
    );
};
