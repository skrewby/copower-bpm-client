import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Material UI
import {
    Box,
    Button,
    Container,
    Skeleton,
    Typography,
    Divider,
    Avatar,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';
import { useDialog } from '../../hooks/use-dialog';

// Components
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { FormDialog } from '../../components/dialogs/form-dialog';

export const OrganisationInstallers = () => {
    const mounted = useMounted();
    const [installersState, setInstallersState] = useState({ isLoading: true });

    const [openAdd, setOpenAdd] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);

    const [disableUserOpen, handleOpenDisableUser, handleCloseDisableUser] =
        useDialog();
    const [enableUserOpen, handleOpenEnableUser, handleCloseEnableUser] =
        useDialog();

    // The information of the user that will be modified
    const [userEdit, setUserEdit] = useState({});

    const [refresh, setRefresh] = useState(false);

    const getData = useCallback(async () => {
        setInstallersState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getInstallers();

            if (mounted.current) {
                setInstallersState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInstallersState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, refresh]);

    const handleDisableUser = () => {
        handleCloseDisableUser();
        bpmAPI.updateInstaller(userEdit.installer_id, { disabled: true });
        setRefresh(true);
    };

    const handleEnableUser = () => {
        handleCloseEnableUser();
        bpmAPI.updateInstaller(userEdit.installer_id, { disabled: false });
        setRefresh(true);
    };

    const addMemberFormik = useFormik({
        initialValues: {
            email: '',
            name: '',
            phone: '',
            accreditation: '',
            licence: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            name: Yup.string().max(255).required('Name is required'),
            phone: Yup.string().max(255).required('Phone number required'),
            accreditation: Yup.string()
                .max(255)
                .required('Accreditation is required'),
            licence: Yup.string().max(255).required('Licence is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.createInstaller(values);
                toast.success('Installer created');
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenAdd(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const addMemberFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: addMemberFormik.touched.name,
            errors: addMemberFormik.errors.name,
            value: addMemberFormik.values.name,
            label: 'Name',
            name: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addMemberFormik.touched.phone,
            errors: addMemberFormik.errors.phone,
            value: addMemberFormik.values.phone,
            label: 'Phone',
            name: 'phone',
        },
        {
            id: 4,
            variant: 'Input',
            width: 12,
            touched: addMemberFormik.touched.email,
            errors: addMemberFormik.errors.email,
            value: addMemberFormik.values.email,
            label: 'Email',
            name: 'email',
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: addMemberFormik.touched.accreditation,
            errors: addMemberFormik.errors.accreditation,
            value: addMemberFormik.values.accreditation,
            label: 'Accreditation',
            name: 'accreditation',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: addMemberFormik.touched.licence,
            errors: addMemberFormik.errors.licence,
            value: addMemberFormik.values.licence,
            label: 'Licence',
            name: 'licence',
        },
    ];

    const editMemberFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            email: userEdit.email,
            name: userEdit.name,
            phone: userEdit.phone,
            accreditation: userEdit.accreditation,
            licence: userEdit.licence,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            name: Yup.string().max(255).required('Name is required'),
            phone: Yup.string().max(255).required('Phone number required'),
            accreditation: Yup.string()
                .max(255)
                .required('Accreditation is required'),
            licence: Yup.string().max(255).required('Licence is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.updateInstaller(userEdit.installer_id, values);
                toast.success('Installer updated');
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenEditUser(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const editMemberFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: editMemberFormik.touched.name,
            errors: editMemberFormik.errors.name,
            value: editMemberFormik.values.name,
            label: 'Name',
            name: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: editMemberFormik.touched.phone,
            errors: editMemberFormik.errors.phone,
            value: editMemberFormik.values.phone,
            label: 'Phone',
            name: 'phone',
        },
        {
            id: 4,
            variant: 'Input',
            width: 12,
            touched: editMemberFormik.touched.email,
            errors: editMemberFormik.errors.email,
            value: editMemberFormik.values.email,
            label: 'Email',
            name: 'email',
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: editMemberFormik.touched.accreditation,
            errors: editMemberFormik.errors.accreditation,
            value: editMemberFormik.values.accreditation,
            label: 'Accreditation',
            name: 'accreditation',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: editMemberFormik.touched.licence,
            errors: editMemberFormik.errors.licence,
            value: editMemberFormik.values.licence,
            label: 'Licence',
            name: 'licence',
        },
    ];

    const renderContent = () => {
        if (installersState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installersState.error) {
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
                            {installersState.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Card variant="outlined">
                    <CardHeader
                        action={
                            <Button
                                color="primary"
                                onClick={() => setOpenAdd(true)}
                                size="small"
                                startIcon={<AddIcon />}
                                variant="contained"
                            >
                                Add
                            </Button>
                        }
                        title="Installers"
                    />
                    <Divider />
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Accreditation</TableCell>
                                <TableCell>Licence</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {installersState.data.map((member) => {
                                const textColour = member.disabled
                                    ? 'text.secondary'
                                    : 'text.primary';

                                return (
                                    <TableRow key={member.installer_id}>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Avatar
                                                    alt={member.name}
                                                    src={'/static/user.png'}
                                                    sx={{ mr: 1 }}
                                                />
                                                <Typography
                                                    color={
                                                        member.disabled
                                                            ? 'textSecondary'
                                                            : 'textPrimary'
                                                    }
                                                    variant="subtitle2"
                                                >
                                                    {member.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color: textColour,
                                            }}
                                        >
                                            {member.email}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color: textColour,
                                            }}
                                        >
                                            {member.phone}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color: textColour,
                                            }}
                                        >
                                            {member.accreditation}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color: textColour,
                                            }}
                                        >
                                            {member.licence}
                                        </TableCell>
                                        <TableCell sx={{ width: 145 }}>
                                            <Box sx={{ display: 'flex' }}>
                                                <Typography
                                                    color="primary"
                                                    onClick={() => {
                                                        setUserEdit(member);
                                                        setOpenEditUser(true);
                                                    }}
                                                    sx={{
                                                        cursor: 'pointer',
                                                    }}
                                                    variant="subtitle2"
                                                >
                                                    Edit
                                                </Typography>
                                                <>
                                                    <Divider
                                                        flexItem
                                                        orientation="vertical"
                                                        sx={{ mx: 2 }}
                                                    />
                                                    {member.disabled ? (
                                                        <Typography
                                                            color="error"
                                                            onClick={() => {
                                                                setUserEdit(
                                                                    member
                                                                );
                                                                handleOpenEnableUser();
                                                            }}
                                                            sx={{
                                                                cursor: 'pointer',
                                                            }}
                                                            variant="subtitle2"
                                                        >
                                                            Enable
                                                        </Typography>
                                                    ) : (
                                                        <Typography
                                                            color="error"
                                                            onClick={() => {
                                                                setUserEdit(
                                                                    member
                                                                );
                                                                handleOpenDisableUser();
                                                            }}
                                                            sx={{
                                                                cursor: 'pointer',
                                                            }}
                                                            variant="subtitle2"
                                                        >
                                                            Disable
                                                        </Typography>
                                                    )}
                                                </>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
                <ConfirmationDialog
                    message="Are you sure you want to disable this user?"
                    onCancel={handleCloseDisableUser}
                    onConfirm={handleDisableUser}
                    open={disableUserOpen}
                    title="Disable Installer"
                    variant="warning"
                />
                <ConfirmationDialog
                    message="Are you sure you want to enable this user?"
                    onCancel={handleCloseEnableUser}
                    onConfirm={handleEnableUser}
                    open={enableUserOpen}
                    title="Enable Installer"
                    variant="warning"
                />
                <FormDialog
                    onClose={() => setOpenAdd(false)}
                    open={openAdd}
                    formik={addMemberFormik}
                    title="Add Installer"
                    fields={addMemberFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditUser(false)}
                    open={openEditUser}
                    formik={editMemberFormik}
                    title="Edit Installer"
                    fields={editMemberFormFields}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Organisation | Copower BPM</title>
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
