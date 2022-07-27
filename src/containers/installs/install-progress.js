import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// Material UI
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

// Local Imports
import { useDialog } from '../../hooks/use-dialog';

// Components
import { ActionList } from '../../components/timeline/action-list';
import { ActionListItem } from '../../components/timeline/action-list-item';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { StatusTimeline } from '../../components/timeline/status-timeline';

export const InstallProgress = (props) => {
    const { install, statusOptions, ...other } = props;
    const [
        cancelInstallOpen,
        handleOpenCancelInstall,
        handleCloseCancelInstall,
    ] = useDialog();

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
                    <StatusTimeline
                        data={install}
                        inclusive={install.status.label === 'Complete'}
                        statusList={statusOptions.map((status) => status.name)}
                    />
                </CardContent>
                {install.status.label !== 'Complete' &&
                    install.status.label !== 'Cancelled' && (
                        <>
                            <Divider />
                            <ActionList>
                                <ActionListItem
                                    icon={CancelIcon}
                                    label="Cancel"
                                    onClick={handleOpenCancelInstall}
                                />
                            </ActionList>
                        </>
                    )}
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
