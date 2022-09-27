import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Material UI
import {
    Box,
    Container,
    Typography,
    Tab,
    Tabs,
    Divider,
    Button,
} from '@mui/material';
import { useState } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export const Stock = () => {
    const location = useLocation();
    const [openCreateDialog, setOpenCreateDialog] = useState();

    const tabs = [
        {
            href: `/bpm/stock`,
            label: 'Items',
        },
    ];

    const renderContent = () => {
        return (
            <>
                <Box sx={{ py: 4 }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            Stock
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            color="primary"
                            size="large"
                            startIcon={<AddOutlinedIcon fontSize="small" />}
                            onClick={() => setOpenCreateDialog(true)}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Box>
                    <Tabs
                        allowScrollButtonsMobile
                        sx={{ mt: 4 }}
                        value={tabs.findIndex(
                            (tab) => tab.href === location.pathname
                        )}
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
                <Outlet context={[openCreateDialog, setOpenCreateDialog]} />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Stock | Solar BPM</title>
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
