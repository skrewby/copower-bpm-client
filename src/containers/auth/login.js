import { Helmet } from 'react-helmet-async';
import { Link as BrowserLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Material UI
import {
    Box,
    Card,
    CardContent,
    Container,
    Button,
    FormHelperText,
    Grid,
    Typography,
} from '@mui/material';

// Local import
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { InputField } from '../../components/form/input-field';

export const Login = () => {
    const mounted = useMounted();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            password: Yup.string().max(255).required('Password is required'),
            policy: Yup.boolean(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.login(values.email, values.password);

                if (mounted.current) {
                    helpers.setStatus({ success: true });
                    helpers.setSubmitting(false);
                }
            } catch (err) {
                console.error(err);
                if (mounted.current) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err.message });
                    helpers.setSubmitting(false);
                }
            }
        },
    });

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
                                <form onSubmit={formik.handleSubmit}>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            mb: 3,
                                        }}
                                    >
                                        <Typography
                                            color="textPrimary"
                                            variant="h4"
                                        >
                                            Login
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <InputField
                                                autoFocus
                                                error={Boolean(
                                                    formik.touched.email &&
                                                        formik.errors.email
                                                )}
                                                fullWidth
                                                helperText={
                                                    formik.touched.email &&
                                                    formik.errors.email
                                                }
                                                label="Email address"
                                                name="email"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                type="email"
                                                value={formik.values.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputField
                                                error={Boolean(
                                                    formik.touched.password &&
                                                        formik.errors.password
                                                )}
                                                fullWidth
                                                helperText={
                                                    formik.touched.password &&
                                                    formik.errors.password
                                                }
                                                label="Password"
                                                name="password"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                type="password"
                                                value={formik.values.password}
                                            />
                                        </Grid>
                                        {formik.errors.submit && (
                                            <Grid item xs={12}>
                                                <FormHelperText error>
                                                    {formik.errors.submit}
                                                </FormHelperText>
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <Button
                                                color="primary"
                                                disabled={formik.isSubmitting}
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                            >
                                                Log In
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                color="primary"
                                                component={BrowserLink}
                                                to="/password-recovery"
                                                variant="text"
                                            >
                                                Forgot password
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Box>
        </>
    );
};
