import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Material UI
import { Box, Container, Typography, Tab, Tabs, Divider } from '@mui/material';

export const Stock = () => {
    const location = useLocation();

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
                <Outlet />
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
