import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
} from '@mui/material';
import { useDialog } from '../../hooks/use-dialog';
import { Archive as ArchiveIcon } from '../../icons/archive';
import { CheckCircle as CheckCircleIcon } from '../../icons/check-circle';
import { Duplicate as DuplicateIcon } from '../../icons/duplicate';
import { ReceiptRefund as ReceiptRefundIcon } from '../../icons/receipt-refund';
import { XCircle as XCircleIcon } from '../../icons/x-circle';
import { ActionList } from '../action-list';
import { ActionListItem } from '../action-list-item';
import { ConfirmationDialog } from '../confirmation-dialog';
import { StatusSelect } from '../status-select';
import { LeadTimeline } from './lead-timeline';
import { LeadRejectDialog } from './lead-reject-dialog';
import { LeadRejectDenyDialog } from './lead-reject-deny-dialog';
import { LeadStatusDisplay } from './lead-status-display';
import { bpmAPI } from '../../api/bpmAPI';
import { useMounted } from '../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const LeadProgress = (props) => {
    const { lead, refresh, ...other } = props;
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
    const [openLeadRejectDialog, setOpenLeadRejectDialog] = useState(false);
    const [openLeadRejectDenyDialog, setOpenLeadRejectDenyDialog] =
        useState(false);

    const mounted = useMounted();
    const [statusOptions, setStatusOptions] = useState({
        isLoading: true,
        data: [],
    });
    const getData = useCallback(async () => {
        setStatusOptions(() => ({ isLoading: true, data: [] }));

        try {
            const statusAPI = await bpmAPI.getLeadStatusOptions();
            const statusFiltered = statusAPI.filter((row) => row.status_id < 4);
            const statusResult = statusFiltered.map((row) => {
                return {
                    status_id: row.status_id,
                    status_name: row.status_name,
                    status_colour: row.status_colour,
                };
            });

            if (mounted.current) {
                setStatusOptions(() => ({
                    isLoading: false,
                    data: statusResult,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setStatusOptions(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const handleStatusChange = (event) => {
        const new_status_id = event.target.value;
        bpmAPI.createLeadLog(
            lead.lead_id,
            `Changed status to ${
                statusOptions.data[event.target.value - 1].status_name
            }`,
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
        bpmAPI.updateLead(lead.lead_id, { status_id: 5 }).then(refresh(true));
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
        toast.error('Not implemented yet');
    };

    const handleRejectLeadApproved = () => {
        bpmAPI.createLeadLog(lead.lead_id, `Approved reject request`, true);
        bpmAPI.updateLead(lead.lead_id, { status_id: 6 }).then(refresh(true));
        handleCloseRejectLeadApprove();
    };

    const handleRejectLeadDenied = () => {
        bpmAPI.createLeadLog(lead.lead_id, `Denied reject request`, true);
        bpmAPI.updateLead(lead.lead_id, { status_id: 1 }).then(refresh(true));
        handleCloseRejectLeadApprove();
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
                    icon={XCircleIcon}
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
        return (
            <ActionList>
                <ActionListItem
                    icon={CheckCircleIcon}
                    label="Approve"
                    onClick={handleOpenRejectLeadApprove}
                />
                <ActionListItem
                    icon={XCircleIcon}
                    label="Deny"
                    onClick={handleRejectDenyLead}
                />
            </ActionList>
        );
    };

    const ActionListRejected = () => {
        return null;
    };

    const ChooseActionList = () => {
        switch (lead.status_id) {
            case 6:
                return <ActionListRejected />;
            case 8:
                return <ActionListRejectPending />;
            default:
                return <ActionListDefault />;
        }
    };

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader title="Lead Progress" />
                <Divider />
                <CardContent>
                    {lead.status_id < 4 && (
                        <StatusSelect
                            onChange={handleStatusChange}
                            options={statusOptions.data}
                            value={
                                statusOptions.data.filter(
                                    (status) =>
                                        status.status_id === lead.status_id
                                )[0]?.status_id || ''
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
                    {lead.status_id < 6 ? (
                        <LeadTimeline lead={lead} />
                    ) : (
                        <LeadStatusDisplay lead={lead} />
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
            <LeadRejectDialog
                onClose={() => setOpenLeadRejectDialog(false)}
                open={openLeadRejectDialog}
                leadID={lead.lead_id}
                refresh={refresh}
            />
            <LeadRejectDenyDialog
                onClose={() => setOpenLeadRejectDenyDialog(false)}
                open={openLeadRejectDenyDialog}
                leadID={lead.lead_id}
                refresh={refresh}
            />
        </>
    );
};

LeadProgress.propTypes = {
    lead: PropTypes.object,
};
