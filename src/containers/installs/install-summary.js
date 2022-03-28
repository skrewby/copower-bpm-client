import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { installApi } from '../../api/install';
import { InstallInfo } from '../../components/installs/install-info';
import { InstallInfoDialog } from '../../components/installs/install-info-dialog';
import { InstallPropertyDetails } from '../../components/installs/install-property-details';
import { LeadPropertyDialog } from '../../components/lead/lead-property-dialog';
import { InstallProgress } from '../../components/installs/install-progress';
import { LeadFiles } from '../../components/lead/lead-files';
import { InstallSystemSummary } from '../../components/installs/install-system-summary';
import { useMounted } from '../../hooks/use-mounted';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

export const InstallSummary = () => {
  const mounted = useMounted();
  const [installState, setInstallState] = useState({ isLoading: true });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openPropertyDialog, setOpenPropertyDialog] = useState(false);

  const getInstall = useCallback(async () => {
    setInstallState(() => ({ isLoading: true }));

    try {
      const result = await installApi.getInstall();

      if (mounted.current) {
        setInstallState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setInstallState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [mounted]);

  useEffect(() => {
    getInstall().catch(console.error);
  }, [getInstall]);

  const renderContent = () => {
    if (installState.isLoading) {
      return (
        <Box sx={{ py: 4 }}>
          <Skeleton height={42} />
          <Skeleton />
          <Skeleton />
        </Box>
      );
    }

    if (installState.error) {
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
              {installState.error}
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
                install={installState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <InstallPropertyDetails
                onEdit={() => toast.error('Not implemented yet')}
                install={installState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <InstallSystemSummary
                onEdit={() => toast.error('Not implemented yet')}
                install={installState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <LeadFiles files={installState.data?.files} />
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
              <InstallProgress install={installState.data} />
            </Grid>
          </Grid>
        </Grid>
        <InstallInfoDialog
          onClose={() => setOpenInfoDialog(false)}
          open={openInfoDialog}
          lead={installState.data}
        />
        <LeadPropertyDialog
          onClose={() => setOpenPropertyDialog(false)}
          open={openPropertyDialog}
          lead={installState.data}
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
