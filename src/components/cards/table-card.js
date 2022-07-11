import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
import { ConfirmationDialog } from '../dialogs/confirmation-dialog';
import { ResourceUnavailable } from '../tables/resource-unavailable';
import toast from 'react-hot-toast';

export const TableCard = (props) => {
    const { data, title, columns, ...other } = props;
    const [itemDialogOpen, handleOpenVariantDialog, handleCloseVariantDialog] =
        useDialog();
    const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
        useDialog();
    const [items, setItems] = useState(data);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleExitedDialog = () => {
        if (selectedItem) {
            setSelectedItem(null);
        }
    };

    const handleDeleteItem = () => {
        setItems((prevVariants) =>
            prevVariants.filter((variant) => variant.id !== selectedItem.id)
        );
        setSelectedItem(null);
        handleCloseDeleteDialog();
    };

    const handleItemChange = (variant, mode) => {
        let temp = [...items];

        if (mode === 'add') {
            temp = [
                ...temp,
                {
                    ...variant,
                    id: generateResourceId(),
                    createdAt: new Date(),
                },
            ];
        } else {
            const index = items.findIndex(
                (_variant) => _variant.id === variant.id
            );
            temp[index] = variant;
        }

        setItems(temp);
    };

    useEffect(() => {
        setItems(data);
    }, [data]);

    const displayUnavailable = items.length === 0;

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader
                    action={
                        <Button
                            color="primary"
                            onClick={() => toast.error('Not Implemented Yet')}
                            variant="text"
                        >
                            Add
                        </Button>
                    }
                    title={title}
                />
                <Divider />
                <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <React.Fragment key={generateResourceId()}>
                                    <TableCell>{col}</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((variant) => (
                            <TableRow key={variant.id}>
                                <TableCell>{variant.name}</TableCell>
                                <TableCell>{variant.sku}</TableCell>
                                <TableCell>
                                    {format(variant.createdAt, 'MMM dd yyyy')}
                                </TableCell>
                                <TableCell sx={{ width: 135 }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography
                                            color="primary"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedItem(variant);
                                                handleOpenVariantDialog();
                                            }}
                                            variant="subtitle2"
                                        >
                                            Edit
                                        </Typography>
                                        <Divider
                                            flexItem
                                            orientation="vertical"
                                            sx={{ mx: 2 }}
                                        />
                                        <Typography
                                            color="primary"
                                            onClick={() => {
                                                setSelectedItem(variant);
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
                {displayUnavailable && <ResourceUnavailable sx={{ m: 2 }} />}
            </Card>
            <ConfirmationDialog
                message="Are you sure you want to delete this item? This can't be undone."
                onCancel={handleCloseDeleteDialog}
                onConfirm={handleDeleteItem}
                open={deleteDialogOpen}
                title="Delete item"
                variant="error"
            />
        </>
    );
};
