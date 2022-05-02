import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
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
import { bpmAPI } from '../../api/bpmAPI';
import { useMounted } from '../../hooks/use-mounted';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { OrganizationInviteDialog } from '../../components/organization/organization-invite-dialog';
import { OrganizationEditUserDialog } from '../../components/organization/organization-edit-user-dialog';
import AddIcon from '@mui/icons-material/Add';

export const OrganizationMembers = () => {
    const mounted = useMounted();
    const [membersState, setMembersState] = useState({ isLoading: true });
    const [rolesState, setRolesState] = useState({ isLoading: true });

    const [openAdd, setOpenAdd] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);

    // The information of the user that will be modified
    const [userEdit, setUserEdit] = useState({});

    const [refresh, setRefresh] = useState(false);

    const getData = useCallback(async () => {
        setMembersState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getUsers();
            const roles = await bpmAPI.getValidRoles();

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
            }
        }
    }, [mounted]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, refresh]);

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
                                    (option) => option.value === member.role
                                );

                                return (
                                    <TableRow key={member.uid}>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Avatar
                                                    alt={member.displayName}
                                                    src={'/static/user.png'}
                                                    sx={{ mr: 1 }}
                                                />
                                                <Typography
                                                    color="textPrimary"
                                                    variant="subtitle2"
                                                >
                                                    {member.displayName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                            {member.phoneNumber}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color:
                                                    member.role === 'sysadmin'
                                                        ? 'text.secondary'
                                                        : 'text.primary',
                                            }}
                                        >
                                            {roleOption.label}
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
                                                {member.role !== 'sysadmin' && (
                                                    <>
                                                        <Divider
                                                            flexItem
                                                            orientation="vertical"
                                                            sx={{ mx: 2 }}
                                                        />
                                                        <Typography
                                                            color="primary"
                                                            sx={{
                                                                cursor: 'pointer',
                                                            }}
                                                            variant="subtitle2"
                                                        >
                                                            Remove
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
                <OrganizationInviteDialog
                    onClose={() => setOpenAdd(false)}
                    roleOptions={rolesState.data}
                    open={openAdd}
                />
                <OrganizationEditUserDialog
                    onClose={() => setOpenEditUser(false)}
                    roleOptions={rolesState.data}
                    open={openEditUser}
                    user={userEdit}
                    refresh={setRefresh}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Organization | Copower BPM</title>
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
