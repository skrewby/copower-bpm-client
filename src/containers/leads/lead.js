import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Button, Container, Grid, Skeleton, Typography, Tab, Tabs } from '@mui/material';
import { leadApi } from '../../api/lead';
import { ActionsMenu } from '../../components/actions-menu';
import { LeadInfo } from '../../components/lead/lead-info';
import { LeadInfoDialog } from '../../components/lead/lead-info-dialog';
import { LeadSystemItems } from '../../components/lead/lead-system-items';
import { LeadPropertyDetails } from '../../components/lead/lead-property-details';
import { LeadPropertyDialog } from '../../components/lead/lead-property-dialog';
import { LeadProgress } from '../../components/lead/lead-progress';
import { LeadFiles } from '../../components/lead/lead-files';
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
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openPropertyDialog, setOpenPropertyDialog] = useState(false);

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
        </Box>
        <Grid
          container
          spacing={3}
        >
          <Grid
            container
            item
            lg={8}
            spacing={3}
            sx={{ height: 'fit-content' }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <LeadInfo
                onEdit={() => setOpenInfoDialog(true)}
                lead={leadState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <LeadPropertyDetails
                onEdit={() => toast.error('Not implemented yet')}
                lead={leadState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <LeadFiles files={leadState.data?.files} />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <LeadSystemItems 
                onEdit={() => toast.error('Not implemented yet')} 
                lead={leadState.data} 
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            lg={4}
            spacing={3}
            sx={{ height: 'fit-content' }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <LeadProgress lead={leadState.data} />
            </Grid>
          </Grid>
        </Grid>
        <LeadInfoDialog
          onClose={() => setOpenInfoDialog(false)}
          open={openInfoDialog}
          lead={leadState.data}
        />
        <LeadPropertyDialog
          onClose={() => setOpenPropertyDialog(false)}
          open={openPropertyDialog}
          lead={leadState.data}
        />
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
