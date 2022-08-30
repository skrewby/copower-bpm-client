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

export const OrganisationMembers = () => {
    const mounted = useMounted();
    const [membersState, setMembersState] = useState({ isLoading: true });
    const [rolesState, setRolesState] = useState({ isLoading: true });

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
        setMembersState(() => ({ isLoading: true }));
        setRolesState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getUsers();
            const rolesAPI = await bpmAPI.getValidRoles();
            const roles = rolesAPI.map((role) => ({
                id: role.role_id,
                name: role.name,
            }));

            if (mounted.current) {
                setMembersState(() => ({
                    isLoading: false,
                    data: result,
                }));

                setRolesState(() => ({
                    isLoading: false,
                    data: roles,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setMembersState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setRolesState(() => ({
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
        bpmAPI.updateUser(userEdit.account_id, { disabled: true });
        setRefresh(true);
    };

    const handleEnableUser = () => {
        handleCloseEnableUser();
        bpmAPI.updateUser(userEdit.account_id, { disabled: false });
        setRefresh(true);
    };

    const addMemberFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
            phone: '',
            role_id: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            password: Yup.string().max(255).required('Password is required'),
            name: Yup.string().max(255).required('Name is required'),
            phone: Yup.string().max(255).required('Phone number required'),
            role_id: Yup.number().required('Must choose role'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.createUser(values);
                toast.success('User created');
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
            label: 'Display Name',
            name: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addMemberFormik.touched.password,
            errors: addMemberFormik.errors.password,
            value: addMemberFormik.values.password,
            label: 'Password',
            name: 'password',
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
            width: 6,
            touched: addMemberFormik.touched.email,
            errors: addMemberFormik.errors.email,
            value: addMemberFormik.values.email,
            label: 'Email',
            name: 'email',
        },
        {
            id: 5,
            variant: 'Select',
            width: 6,
            touched: addMemberFormik.touched.role_id,
            errors: addMemberFormik.errors.role_id,
            value: addMemberFormik.values.role_id,
            label: 'Roles',
            name: 'role_id',
            options: rolesState.data,
        },
    ];

    const editMemberFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            email: userEdit.email,
            name: userEdit.name,
            phone: userEdit.phone,
            role_id: userEdit.role_id,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            name: Yup.string().max(255).required('Name is required'),
            phone: Yup.string().max(255).required('Phone number required'),
            role_id: Yup.number().required('Must choose role'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.updateUser(userEdit.account_id, values);
                toast.success('User updated');
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
            label: 'Display Name',
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
            width: 6,
            touched: editMemberFormik.touched.email,
            errors: editMemberFormik.errors.email,
            value: editMemberFormik.values.email,
            label: 'Email',
            name: 'email',
        },
        {
            id: 5,
            variant: 'Select',
            width: 6,
            touched: editMemberFormik.touched.role_id,
            errors: editMemberFormik.errors.role_id,
            value: editMemberFormik.values.role_id,
            label: 'Roles',
            name: 'role_id',
            options: rolesState.data,
        },
    ];

    const renderContent = () => {
        if (membersState.isLoading || rolesState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (membersState.error || rolesState.error) {
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
                            {membersState.error}
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
                        title="Members"
                    />
                    <Divider />
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {membersState.data.map((member) => {
                                const roleOption = rolesState.data.find(
                                    (option) => option.name === member.role
                                );

                                const textColour = member.disabled
                                    ? 'text.secondary'
                                    : 'text.primary';

                                return (
                                    <TableRow key={member.account_id}>
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
                                            {roleOption.name}
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
                    title="Disable User"
                    variant="warning"
                />
                <ConfirmationDialog
                    message="Are you sure you want to enable this user?"
                    onCancel={handleCloseEnableUser}
                    onConfirm={handleEnableUser}
                    open={enableUserOpen}
                    title="Enable User"
                    variant="warning"
                />
                <FormDialog
                    onClose={() => setOpenAdd(false)}
                    open={openAdd}
                    formik={addMemberFormik}
                    title="Add Member"
                    fields={addMemberFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditUser(false)}
                    open={openEditUser}
                    formik={editMemberFormik}
                    title="Edit Member"
                    fields={editMemberFormFields}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Organisation | Solar BPM</title>
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
