import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useDialog } from '../../hooks/use-dialog';
import { generateResourceId } from '../../utils/generate-resource-id';
import { ConfirmationDialog } from '../confirmation-dialog';
import { ResourceUnavailable } from '../resource-unavailable';
import { LeadAddFileDialog } from './lead-add-file-dialog';
import toast from 'react-hot-toast';

export const LeadFiles = (props) => {
    const { files: filesProp, ...other } = props;
    const [fileDialogOpen, handleOpenFileDialog, handleCloseFileDialog] =
        useDialog();
    const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
        useDialog();
    const [files, setFiles] = useState(filesProp);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleExitedDialog = () => {
        if (selectedFile) {
            setSelectedFile(null);
        }
    };

    const handleDeleteVariant = () => {
        setFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== selectedFile.id)
        );
        setSelectedFile(null);
        handleCloseDeleteDialog();
    };

    const notImplemented = () => {
        toast.error('Not implemented yet');
    };

    const handleVariantsChange = (file, mode) => {
        let temp = [...files];

        if (mode === 'add') {
            temp = [
                ...temp,
                {
                    ...file,
                    id: generateResourceId(),
                    createdAt: new Date(),
                },
            ];
        } else {
            const index = files.findIndex((_file) => _file.id === file.id);
            temp[index] = file;
        }

        setFiles(temp);
    };

    useEffect(() => {
        setFiles(filesProp);
    }, [filesProp]);

    const displayUnavailable = files.length === 0;

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader
                    action={
                        <Button
                            color="primary"
                            onClick={notImplemented}
                            variant="text"
                        >
                            Add
                        </Button>
                    }
                    title="Files"
                />
                <Divider />
                <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>File Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell>{file.type}</TableCell>
                                <TableCell>{file.name}</TableCell>
                                <TableCell sx={{ width: 135 }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography
                                            color="primary"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                toast.success(
                                                    'Downloaded file'
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
                                                setSelectedFile(file);
                                                handleOpenDeleteDialog();
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                            variant="subtitle2"
                                        >
                                            Delete
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {displayUnavailable && (
                    <ResourceUnavailable
                        onCreate={handleOpenFileDialog}
                        sx={{ m: 2 }}
                    />
                )}
            </Card>
            <LeadAddFileDialog
                onClose={handleCloseFileDialog}
                onExited={handleExitedDialog}
                onVariantsChange={handleVariantsChange}
                open={fileDialogOpen}
                variant={selectedFile}
            />
            <ConfirmationDialog
                message="Are you sure you want to delete this file? This can't be undone."
                onCancel={handleCloseDeleteDialog}
                onConfirm={handleDeleteVariant}
                open={deleteDialogOpen}
                title="Delete file"
                variant="error"
            />
        </>
    );
};

LeadFiles.propTypes = {
    files: PropTypes.array.isRequired,
};
