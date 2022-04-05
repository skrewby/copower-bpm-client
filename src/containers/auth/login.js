import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container } from '@mui/material';
import { LoginFirebase } from '../../components/auth/login-firebase';

export const Login = () => {
    return (
        <>
            <Helmet>
                <title>Login | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    pt: '64px',
                }}
            >
                <Box sx={{ py: 9 }}>
                    <Container maxWidth="sm">
                        <Card
                            sx={{ backgroundColor: 'background.default' }}
                            elevation={0}
                        >
                            <CardContent>
                                <LoginFirebase />
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Box>
        </>
    );
};
