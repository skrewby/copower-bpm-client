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
  Typography
} from '@mui/material';
import { useDialog } from '../../hooks/use-dialog';
import { ConfirmationDialog } from '../confirmation-dialog';
import toast from 'react-hot-toast';

export const InstallSystemSummary = (props) => {
  const { install: installProp, ...other } = props;
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog();
  const [install, setInstall] = useState(installProp);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteVariant = () => {
    setInstall((prevFiles) => prevFiles
      .filter((file) => file.id !== selectedItem.id));
    setSelectedItem(null);
    handleCloseDeleteDialog();
  };

  const notImplemented = () => {
    toast.error("Not implemented yet");
  }

  useEffect(() => {
    setInstall(installProp);
  }, [installProp]);

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <CardHeader
          action={(
            <Button
              color="primary"
              onClick={notImplemented}
              variant="text"
            >
              Add
            </Button>
          )}
          title="System Details"
        />
        <Divider />
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Type
              </TableCell>
              <TableCell>
                Qty
              </TableCell>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {install.system.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  {file.type}
                </TableCell>
                <TableCell>
                  {file.quantity}
                </TableCell>
                <TableCell>
                  {file.name}
                </TableCell>
                <TableCell sx={{ width: 135 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        toast.error("Not implemented yet");
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
                      color="error"
                      onClick={() => {
                        setSelectedItem(file);
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
      </Card>
      <ConfirmationDialog
        message="Are you sure you want to delete this entry? This can't be undone."
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleDeleteVariant}
        open={deleteDialogOpen}
        title="Delete entry"
        variant="error"
      />
    </>
  );
};

InstallSystemSummary.propTypes = {
  install: PropTypes.array.isRequired
};
