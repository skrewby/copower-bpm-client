import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { leadApi } from '../../api/lead';
import { LeadInfo } from '../../components/lead/lead-info';
import { LeadInfoDialog } from '../../components/lead/lead-info-dialog';
import { LeadPropertyDetails } from '../../components/lead/lead-property-details';
import { LeadPropertyDialog } from '../../components/lead/lead-property-dialog';
import { LeadProgress } from '../../components/lead/lead-progress';
import { LeadFiles } from '../../components/lead/lead-files';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { useOutletContext } from 'react-router-dom';

export const LeadSummary = () => {
    const [leadState, setRefresh] = useOutletContext();
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);

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
                            p: 3,
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
                <Grid container spacing={3}>
                    <Grid
                        container
                        item
                        lg={8}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <LeadInfo
                                onEdit={() => setOpenInfoDialog(true)}
                                lead={leadState.data}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LeadPropertyDetails
                                onEdit={() =>
                                    toast.error('Not implemented yet')
                                }
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
                        <Grid item xs={12}>
                            <LeadProgress
                                lead={leadState.data}
                                refresh={setRefresh}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <LeadInfoDialog
                    onClose={() => setOpenInfoDialog(false)}
                    open={openInfoDialog}
                    lead={leadState.data}
                    refresh={setRefresh}
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
                    flexGrow: 1,
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {renderContent()}
                </Container>
            </Box>
        </>
    );
};
