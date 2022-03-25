import React from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';

// Components
import { Navbar } from '../components/navbar/navbar';
import { Footer } from '../components/footer';

import { useSettings } from '../contexts/settings-context';

const BPMLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  paddingTop: 64
}));

const BPMLayoutContent = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

export const BPMLayout = () => {
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { settings, saveSettings } = useSettings();

  return (
    <BPMLayoutRoot>
      <Navbar />
      <BPMLayoutContent>
        <Outlet />
        <Footer />
      </BPMLayoutContent>
    </BPMLayoutRoot>
  );
};
