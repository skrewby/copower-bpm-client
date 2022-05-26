import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

// Material UI
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArchiveIcon from '@mui/icons-material/Archive';

// Local imports
import { useDialog } from '../../hooks/use-dialog';
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useAuth } from '../../hooks/use-auth';

// Components
import { ActionList } from './action-list';
import { ActionListItem } from './action-list-item';
import { ConfirmationDialog } from '../dialogs/confirmation-dialog';
import { StatusSelect } from './status-select';
import { StatusTimeline } from './status-timeline';
import { StatusDisplay } from './status-display';
import { CommentDialog } from '../dialogs/comment-dialog';

export const LeadProgress = (props) => {
    const { lead, refresh, statusOptions, ...other } = props;
    const { user } = useAuth();
    const [
        sendToOperationsOpen,
        handleOpenSendToOperations,
        handleCloseSendToOperations,
    ] = useDialog();
    const [rejectLeadOpen, handleOpenRejectLead, handleCloseRejectLead] =
        useDialog();
    const [closeLeadOpen, handleOpenCloseLead, handleCloseCloseLead] =
        useDialog();
    const [
        rejectLeadApproveOpen,
        handleOpenRejectLeadApprove,
        handleCloseRejectLeadApprove,
    ] = useDialog();
    const [
        reviewLeadApproveOpen,
        handleOpenReviewLeadApprove,
        handleCloseReviewLeadApprove,
    ] = useDialog();
    const [openLeadRejectDialog, setOpenLeadRejectDialog] = useState(false);
    const [openLeadRejectDenyDialog, setOpenLeadRejectDenyDialog] =
        useState(false);
    const [openLeadReviewDenyDialog, setOpenLeadReviewDenyDialog] =
        useState(false);

    const handleStatusChange = (event) => {
        const new_status_id = event.target.value;
        bpmAPI.createLeadLog(
            lead.lead_id,
            `Changed status to ${statusOptions[event.target.value - 1].name}`,
            true
        );
        bpmAPI
            .updateLead(lead.lead_id, { status_id: new_status_id })
            .then(refresh(true));
    };

    const handleSendToOperations = () => {
        handleCloseSendToOperations();
        bpmAPI.createLeadLog(
            lead.lead_id,
            `Marked lead as Win - Awaiting review`,
            true
        );
        bpmAPI.updateLead(lead.lead_id, { status_id: 6 }).then(refresh(true));
    };

    const handleRejectLead = () => {
        handleCloseRejectLead();
        setOpenLeadRejectDialog(true);
    };

    const handleRejectDenyLead = () => {
        setOpenLeadRejectDenyDialog(true);
    };

    const handleCloseLead = () => {
        handleCloseCloseLead();
        bpmAPI.createLeadLog(lead.lead_id, `Closed lead`, true);
        bpmAPI.updateLead(lead.lead_id, { status_id: 10 }).then(refresh(true));
    };

    const handleRejectLeadApproved = () => {
        bpmAPI.createLeadLog(lead.lead_id, `Approved reject request`, true);
        bpmAPI.updateLead(lead.lead_id, { status_id: 7 }).then(refresh(true));
        handleCloseRejectLeadApprove();
    };

    const handleReviewDeny = () => {
        setOpenLeadReviewDenyDialog(true);
    };

    const handleReviewApprove = () => {
        handleCloseReviewLeadApprove();
        bpmAPI.createInstall(lead).then((res) => {
            bpmAPI.createInstallLog(res.install_id, `Install created`, true);
            bpmAPI.createLeadLog(
                lead.lead_id,
                `Lead approved. Sent to installs`,
                true
            );
            bpmAPI
                .updateLead(lead.lead_id, { status_id: 5 })
                .then(refresh(true));
        });
    };

    const ActionListDefault = () => {
        return (
            <ActionList>
                <ActionListItem
                    icon={CheckCircleIcon}
                    label="Win"
                    onClick={handleOpenSendToOperations}
                />
                <ActionListItem
                    icon={CancelIcon}
                    label="Reject"
                    onClick={handleOpenRejectLead}
                />
                <ActionListItem
                    icon={ArchiveIcon}
                    label="Close"
                    onClick={handleOpenCloseLead}
                />
            </ActionList>
        );
    };

    const ActionListRejectPending = () => {
        if (user.role === 'sales') {
            return <Box />;
        } else {
            return (
                <ActionList>
                    <ActionListItem
                        icon={CheckCircleIcon}
                        label="Approve"
                        onClick={handleOpenRejectLeadApprove}
                    />
                    <ActionListItem
                        icon={CancelIcon}
                        label="Deny"
                        onClick={handleRejectDenyLead}
                    />
                </ActionList>
            );
        }
    };

    const ActionListReview = () => {
        if (user.role === 'sales') {
            return <Box />;
        } else {
            return (
                <ActionList>
                    <ActionListItem
                        icon={CheckCircleIcon}
                        label="Approve"
                        onClick={handleOpenReviewLeadApprove}
                    />
                    <ActionListItem
                        icon={CancelIcon}
                        label="Deny"
                        onClick={handleReviewDeny}
                    />
                </ActionList>
            );
        }
    };

    const ActionListNothing = () => {
        return null;
    };

    const ChooseActionList = () => {
        switch (lead.status_id) {
            case 5:
                return <ActionListNothing />;
            case 6:
                return <ActionListReview />;
            case 7:
                return <ActionListNothing />;
            case 9:
                return <ActionListRejectPending />;
            case 10:
                return <ActionListNothing />;
            default:
                return <ActionListDefault />;
        }
    };

    const statusList = [
        'Created',
        'New',
        'Attempting Contact',
        'Park',
        'Quotation',
        'Review',
        'Win',
    ];

    // Called when someone rejects a lead and provides a comment
    const leadRejectFunction = async (comment) => {
        await bpmAPI.createLeadLog(
            lead.lead_id,
            `Rejected lead. Comment: ${comment}`,
            true
        );
        const res = await bpmAPI
            .updateLead(lead.lead_id, { status_id: 9 })
            .then(refresh(true));

        return res;
    };

    // Called when someone denys a lead reject and provides a comment
    const leadRejectDenyFunction = async (comment) => {
        await bpmAPI.createLeadLog(
            lead.lead_id,
            `Denied reject request. Comment: ${comment}`,
            true
        );
        const res = await bpmAPI
            .updateLead(lead.lead_id, { status_id: 1 })
            .then(refresh(true));

        return res;
    };

    // Called when a lead review is failed after marking it as a win
    const leadReviewDenyFunction = async (comment) => {
        await bpmAPI.createLeadLog(
            lead.lead_id,
            `More information required. Comment: ${comment}`,
            true
        );
        const res = await bpmAPI
            .updateLead(lead.lead_id, { status_id: 4 })
            .then(refresh(true));

        return res;
    };

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader title="Lead Progress" />
                <Divider />
                <CardContent>
                    {lead.status_id < 5 && (
                        <StatusSelect
                            onChange={handleStatusChange}
                            options={statusOptions.filter((row) => row.id < 5)}
                            value={
                                statusOptions.filter(
                                    (status) => status.id === lead.status_id
                                )[0]?.id || ''
                            }
                        />
                    )}
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            display: 'block',
                        }}
                        variant="caption"
                    >
                        {`Updated ${format(
                            parseISO(lead.last_updated),
                            'dd MMM yyyy HH:mm'
                        )}`}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {lead.status_id < 7 ? (
                        <StatusTimeline data={lead} statusList={statusList} />
                    ) : (
                        <StatusDisplay
                            status={lead.status}
                            status_colour={lead.status_colour}
                        />
                    )}
                </CardContent>
                <Divider />
                {ChooseActionList()}
            </Card>
            <ConfirmationDialog
                message="Are you sure you want to mark this lead as Win?"
                onCancel={handleCloseSendToOperations}
                onConfirm={handleSendToOperations}
                open={sendToOperationsOpen}
                title="Mark as Win"
                variant="warning"
            />
            <ConfirmationDialog
                message="Are you sure you want to reject this lead?"
                onCancel={handleCloseRejectLead}
                onConfirm={handleRejectLead}
                open={rejectLeadOpen}
                title="Reject Lead"
                variant="warning"
            />
            <ConfirmationDialog
                message="Are you sure you want to close this lead?"
                onCancel={handleCloseCloseLead}
                onConfirm={handleCloseLead}
                open={closeLeadOpen}
                title="Close Lead"
                variant="warning"
            />
            <ConfirmationDialog
                message="Approve reject request?"
                onCancel={handleCloseRejectLeadApprove}
                onConfirm={handleRejectLeadApproved}
                open={rejectLeadApproveOpen}
                title="Approve reject request"
                variant="warning"
            />
            <ConfirmationDialog
                message="Approve lead submission?"
                onCancel={handleCloseReviewLeadApprove}
                onConfirm={handleReviewApprove}
                open={reviewLeadApproveOpen}
                title="Approve lead submission"
                variant="warning"
            />
            <CommentDialog
                open={openLeadRejectDialog}
                onClose={() => setOpenLeadRejectDialog(false)}
                id={lead.lead_id}
                title="Reject Lead"
                refresh={refresh}
                submitFunction={leadRejectFunction}
            />
            <CommentDialog
                open={openLeadRejectDenyDialog}
                onClose={() => setOpenLeadRejectDenyDialog(false)}
                id={lead.lead_id}
                title="Deny Reject Request"
                refresh={refresh}
                submitFunction={leadRejectDenyFunction}
            />
            <CommentDialog
                open={openLeadReviewDenyDialog}
                onClose={() => setOpenLeadReviewDenyDialog(false)}
                id={lead.lead_id}
                title="Deny Lead Win"
                refresh={refresh}
                submitFunction={leadReviewDenyFunction}
            />
        </>
    );
};

LeadProgress.propTypes = {
    lead: PropTypes.object,
};
