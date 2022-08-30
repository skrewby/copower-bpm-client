import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Material UI
import {
    Box,
    Container,
    Divider,
    Grid,
    Skeleton,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { format, parseISO } from 'date-fns';
import { TableCard } from '../../components/cards/table-card';
import { useDialog } from '../../hooks/use-dialog';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { UploadDialog } from '../../components/dialogs/upload-dialog';

export const InstallerSummary = () => {
    const [installerState, setRefresh, files] = useOutletContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
    const [
        deleteFileDialogOpen,
        handleOpenDeleteFileDialog,
        handleCloseDeleteFileDialog,
    ] = useDialog();

    const onFileUpload = async (file, id) => {
        await bpmAPI.addFileToInstaller(installerState.data.installer_id, id);
    };

    const onFileDelete = (pondID) => {};

    const handleDeleteFile = async () => {
        await bpmAPI.deleteFileFromInstaller(
            installerState.data.installer_id,
            selectedFile.file_id
        );
        setRefresh(true);
    };

    const AddFileField = {
        id: 1,
        width: 12,
        label: '',
        multiple: true,
        onUpload: onFileUpload,
        onDelete: onFileDelete,
    };

    const fileRows = (item) => {
        return (
            <TableRow key={item.id}>
                <TableCell>{item.file_name}</TableCell>
                <TableCell sx={{ width: 135 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                                bpmAPI.downloadFile(
                                    item.file_id,
                                    item.file_name
                                );
                            }}
                            variant="subtitle2"
                        >
                            Download
                        </Typography>
                        <Divider
                            flexItem
                            orientation="vertical"
                            sx={{ mx: 2 }}
                        />
                        <Typography
                            color="error"
                            onClick={() => {
                                setSelectedFile(item);
                                handleOpenDeleteFileDialog();
                            }}
                            sx={{ cursor: 'pointer' }}
                            variant="subtitle2"
                        >
                            Delete
                        </Typography>
                    </Box>
                </TableCell>
            </TableRow>
        );
    };

    const renderContent = () => {
        if (installerState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installerState.error) {
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
                            Error Ocurred
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid
                        container
                        item
                        lg={11}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => {
                                    toast.error('Not Implemented');
                                }}
                                title="Details"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Name',
                                        value: installerState.data.name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Email Address',
                                        value: installerState.data.email,
                                    },
                                    {
                                        id: 3,
                                        label: 'Accreditation',
                                        value: installerState.data.address,
                                    },
                                    {
                                        id: 4,
                                        label: 'Licence',
                                        value: installerState.data.licence,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Address',
                                        value: installerState.data.address,
                                    },
                                    {
                                        id: 2,
                                        label: 'Phone Number',
                                        value: installerState.data.phone,
                                    },
                                    {
                                        id: 3,
                                        label: 'State Issued',
                                        value: installerState.data.state,
                                    },
                                    {
                                        id: 4,
                                        label: 'Expiry',
                                        value: installerState.data.expiry
                                            ? format(
                                                  parseISO(
                                                      installerState.data.expiry
                                                  ),
                                                  'dd MMM yyyy - p'
                                              )
                                            : '',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TableCard
                                data={files}
                                title="Files"
                                columns={['File', 'Actions']}
                                rows={fileRows}
                                buttonLabel="Add Files"
                                buttonOnClick={() => setOpenAddFileDialog(true)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <ConfirmationDialog
                    message="Are you sure you want to delete this file? This can't be undone."
                    onCancel={handleCloseDeleteFileDialog}
                    onConfirm={handleDeleteFile}
                    open={deleteFileDialogOpen}
                    title="Delete file"
                    variant="error"
                />
                <UploadDialog
                    onClose={() => {
                        setRefresh(true);
                        setOpenAddFileDialog(false);
                    }}
                    open={openAddFileDialog}
                    title="Upload Files"
                    field={AddFileField}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Installer | Solar BPM</title>
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
