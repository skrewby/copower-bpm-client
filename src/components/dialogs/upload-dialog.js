import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@mui/material';

// Components
import { UploadField } from '../form/upload-field';

export const UploadDialog = (props) => {
    const { open, onClose, title, field } = props;

    return (
        <Dialog
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    width: '100%',
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <React.Fragment key={field.id}>
                        <Grid item xs={field.width}>
                            <UploadField
                                allowMultiple={field.multiple}
                                onUpload={field.onUpload}
                                onDelete={field.onDelete}
                                label={field.label}
                            />
                        </Grid>
                    </React.Fragment>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose} variant="text">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UploadDialog.defaultProps = {
    open: false,
};

UploadDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    title: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
};
