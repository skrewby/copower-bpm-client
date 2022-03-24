import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Button, Container, Skeleton, Typography, Tab, Tabs, Divider } from '@mui/material';
import { leadApi } from '../../api/lead';
import { ActionsMenu } from '../../components/actions-menu';
import { useMounted } from '../../hooks/use-mounted';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// NOTE: This should be generated based on product data because "/1" represents "/:id" from routing
// //  strategy where ":id" is dynamic depending on current product id
const tabs = [
  {
    href: '/bpm/leads/1',
    label: 'Summary'
  },
  {
    href: '/bpm/leads/1/quotation',
    label: 'Quotation'
  }
];

export const Lead = () => {
  const mounted = useMounted();
  const [leadState, setLeadState] = useState({ isLoading: true });
  const location = useLocation();

  const getLead = useCallback(async () => {
    setLeadState(() => ({ isLoading: true }));

    try {
      const result = await leadApi.getLead();

      if (mounted.current) {
        setLeadState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setLeadState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    getLead().catch(console.error);
  }, [getLead]);

  const handleSendQuote = () => {
    toast.error('Not implemented yet. It should create a pdf similar to Pylon quote and send it to customer by email');
  };

  const handleReject = () => {
    toast.error('Not implemented yet. This option will be shown to operations when sales sends lead to operations. A wizard will appear where operations can leave a comment');
  };

  const handleAccept = () => {
    toast.error('Not implemented yet. This option will be shown to operations when sales sends lead to operations');
  };

  const actions = [
    {
      label: 'Send Quote',
      onClick: handleSendQuote
    },
    {
      label: 'Accept Sale',
      onClick: handleAccept
    },
    {
      label: 'Reject Sale',
      onClick: handleReject
    }
  ];

  const renderContent = () => {
    if (leadState.isLoading) {
      return (
        <Box sx={{ py: 4 }}>
          <Skeleton height={42} />
          <Skeleton />
          <Skeleton />
        </Box>
      );
    }

    if (leadState.error) {
      return (
        <Box sx={{ py: 4 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <PriorityHighOutlinedIcon />
            <Typography
              color="textSecondary"
              sx={{ mt: 2 }}
              variant="body2"
            >
              {leadState.error}
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              color="primary"
              component={RouterLink}
              startIcon={<ArrowBackOutlinedIcon />}
              to="/bpm/leads"
              variant="text"
            >
              Leads
            </Button>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {`${leadState.data.refID} - ${leadState.data.name}`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <ActionsMenu actions={actions} />
          </Box>
          <Tabs
            allowScrollButtonsMobile
            sx={{ mt: 4 }}
            value={tabs.findIndex((tab) => tab.href === location.pathname)}
            variant="scrollable"
          >
            {tabs.map((option) => (
              <Tab
                component={RouterLink}
                key={option.href}
                label={option.label}
                to={option.href}
              />
            ))}
          </Tabs>
          <Divider />
        </Box>
        <Outlet />
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Lead | Copower BPM</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {renderContent()}
        </Container>
      </Box>
    </>
  );
};
