import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography  } from '@mui/material';
import { leadApi } from '../../api/lead';
import { InstallInfo } from '../../components/installs/install-info';
import { LeadInfoDialog } from '../../components/lead/lead-info-dialog';
import { InstallPropertyDetails } from '../../components/installs/install-property-details';
import { LeadPropertyDialog } from '../../components/lead/lead-property-dialog';
import { InstallProgress } from '../../components/installs/install-progress';
import { LeadFiles } from '../../components/lead/lead-files';
import { useMounted } from '../../hooks/use-mounted';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

export const InstallSummary = () => {
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
  }, [mounted]);

  useEffect(() => {
    getLead().catch(console.error);
  }, [getLead]);

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
              <InstallInfo
                onEdit={() => setOpenInfoDialog(true)}
                install={leadState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <InstallPropertyDetails
                onEdit={() => toast.error('Not implemented yet')}
                install={leadState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <LeadFiles files={leadState.data?.files} />
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
              <InstallProgress lead={leadState.data} />
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
        <title>Install | Copower BPM</title>
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
