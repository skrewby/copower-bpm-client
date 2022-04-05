import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useDialog } from '../../hooks/use-dialog';
import { XCircle as XCircleIcon } from '../../icons/x-circle';
import { ActionList } from '../action-list';
import { ActionListItem } from '../action-list-item';
import { ConfirmationDialog } from '../confirmation-dialog';
import { InstallTimeline } from './install-timeline';

export const InstallProgress = (props) => {
    const { install, ...other } = props;
    const [
        cancelInstallOpen,
        handleOpenCancelInstall,
        handleCloseCancelInstall,
    ] = useDialog();
    const [status, setStatus] = useState(install?.status);

    const handleCancelInstall = () => {
        handleCloseCancelInstall();
        toast.error('Not implemented yet');
    };

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader title="Progress" />
                <Divider />
                <CardContent>
                    <InstallTimeline status={status} />
                </CardContent>
                <Divider />
                <ActionList>
                    <ActionListItem
                        icon={XCircleIcon}
                        label="Cancel"
                        onClick={handleOpenCancelInstall}
                    />
                </ActionList>
            </Card>
            <ConfirmationDialog
                message="Are you sure you want to cancel this install?"
                onCancel={handleCloseCancelInstall}
                onConfirm={handleCancelInstall}
                open={cancelInstallOpen}
                title="Cancel Install"
                variant="warning"
            />
        </>
    );
};

InstallProgress.propTypes = {
    install: PropTypes.object,
};
