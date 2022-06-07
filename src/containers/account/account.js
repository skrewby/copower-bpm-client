import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Material UI
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    FormHelperText,
    Avatar,
    Skeleton,
} from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Components
import { InputField } from '../../components/form/input-field';
import { useCallback, useEffect, useState } from 'react';
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';

export const AccountChangePassword = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { userDetails, refresh } = props;

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            retypePassword: '',
            password: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            newPassword: Yup.string()
                .min(7, 'Must be at least 7 characters')
                .max(255, 'Maximum length is 255')
                .required('New password is required'),
            retypePassword: Yup.string()
                .min(7, 'Must be at least 7 characters')
                .max(255, 'Maximum length is 255')
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Retype new password'),
            password: Yup.string()
                .min(7, 'Must be at least 7 characters')
                .max(255, 'Maximum length is 255')
                .required('Old password is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.changePassword(values);
                refresh(true);
                await bpmAPI.logout();
                helpers.resetForm();
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
            } catch (err) {
                toast.error('Something went wrong');
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item md={5} xs={12}>
                        <Typography color="textPrimary" variant="h6">
                            Change password
                        </Typography>
                    </Grid>
                    <Grid item md={7} xs={12}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
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
                                        label="Old password"
                                        name="password"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="password"
                                        value={formik.values.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputField
                                        error={Boolean(
                                            formik.touched.newPassword &&
                                                formik.errors.newPassword
                                        )}
                                        fullWidth
                                        helperText={
                                            formik.touched.newPassword &&
                                            formik.errors.newPassword
                                        }
                                        label="New password"
                                        name="newPassword"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="password"
                                        value={formik.values.newPassword}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputField
                                        error={Boolean(
                                            formik.touched.retypePassword &&
                                                formik.errors.retypePassword
                                        )}
                                        fullWidth
                                        helperText={
                                            formik.touched.retypePassword &&
                                            formik.errors.retypePassword
                                        }
                                        label="Retype password"
                                        name="retypePassword"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="password"
                                        value={formik.values.retypePassword}
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
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                    >
                                        Change password
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export const AccountDetails = (props) => {
    const { userDetails, refresh } = props;

    const formik = useFormik({
        initialValues: {
            email: userDetails.email || '',
            name: userDetails.name || '',
            role: userDetails.role || '',
            phone: userDetails.phone || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            name: Yup.string().max(255).required('Display name is required'),
            phone: Yup.string().max(255).required('Phone number is required'),
            role: Yup.string().max(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.updateCurrentUser(values);
                refresh(true);
                toast.success('Settings saved');
                helpers.resetForm();
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item md={5} xs={12}>
                        <Typography color="textPrimary" variant="h6">
                            Settings
                        </Typography>
                    </Grid>
                    <Grid item md={7} xs={12}>
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        pb: 3,
                                    }}
                                >
                                    <Avatar
                                        src="/static/user.png"
                                        sx={{
                                            height: 64,
                                            mr: 2,
                                            width: 64,
                                        }}
                                    />
                                    <div>
                                        <Grid
                                            container
                                            spacing={1}
                                            sx={{ pb: 1 }}
                                        >
                                            <Grid item>
                                                <Button
                                                    color="primary"
                                                    size="small"
                                                    type="button"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        toast.error(
                                                            'Not implemented yet'
                                                        )
                                                    }
                                                >
                                                    Upload new picture
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    color="primary"
                                                    size="small"
                                                    type="button"
                                                    variant="text"
                                                    onClick={() =>
                                                        toast.error(
                                                            'Not implemented yet'
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Typography
                                            color="textSecondary"
                                            variant="caption"
                                        >
                                            Recommended dimensions: 200x200,
                                            maximum file size: 5MB
                                        </Typography>
                                    </div>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <InputField
                                            error={Boolean(
                                                formik.touched.name &&
                                                    formik.errors.name
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.name &&
                                                formik.errors.name
                                            }
                                            label="Display Name"
                                            name="name"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputField
                                            error={Boolean(
                                                formik.touched.email &&
                                                    formik.errors.email
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.email &&
                                                formik.errors.email
                                            }
                                            label="Email Address"
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
                                                formik.touched.phone &&
                                                    formik.errors.phone
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.phone &&
                                                formik.errors.phone
                                            }
                                            label="Phone"
                                            name="phone"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputField
                                            error={Boolean(
                                                formik.touched.role &&
                                                    formik.errors.role
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.role &&
                                                formik.errors.role
                                            }
                                            label="Role"
                                            name="role"
                                            disabled
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.role}
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
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Save settings
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </form>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export const Account = () => {
    const [refresh, setRefresh] = useState(false);
    const [userDetails, setUserDetails] = useState({ isLoading: true });
    const mounted = useMounted();

    const getUserDetails = useCallback(async () => {
        setUserDetails(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getCurrentUser();
            if (mounted.current) {
                setUserDetails(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setUserDetails(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        setRefresh(false);
        getUserDetails().catch(console.error);
    }, [getUserDetails, refresh]);

    const renderContent = () => {
        if (userDetails.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (userDetails.error) {
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
                            {userDetails.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

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
                            Account Settings
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ backgroundColor: 'background.default' }}>
                    <AccountDetails
                        userDetails={userDetails.data}
                        refresh={setRefresh}
                    />
                    <AccountChangePassword refresh={setRefresh} />
                </Box>
            </>
        );
    };

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                flexGrow: 1,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                {renderContent()}
            </Container>
        </Box>
    );
};
