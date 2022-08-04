import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

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
import { ActionList } from '../../components/timeline/action-list';
import { ActionListItem } from '../../components/timeline/action-list-item';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { StatusSelect } from '../../components/timeline/status-select';
import { StatusTimeline } from '../../components/timeline/status-timeline';
import { StatusDisplay } from '../../components/timeline/status-display';
import { CommentDialog } from '../../components/dialogs/comment-dialog';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { getRoleID } from '../../utils/get-role-id';

/**
 * Container to be used within other containers therefore props need to be passed to it
 * as if it was a component.
 */
export const LeadProgress = (props) => {
    const { lead, systemItems, customers, refresh, statusOptions, ...other } =
        props;
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
    const [openLeadReviewApproveDialog, setOpenLeadReviewApproveDialog] =
        useState(false);
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

    const handleSendToOperations = async () => {
        handleCloseSendToOperations();
        const roles = await bpmAPI.getValidRoles();
        await bpmAPI.createNotification({
            icon: 'success',
            title: `Sale marked for review`,
            details: `${lead.name}: ${lead.address}`,
            role: getRoleID(roles, 'Operations'),
            href: `/bpm/leads/${lead.lead_id}`,
        });
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

    const handleCloseLead = async () => {
        handleCloseCloseLead();
        bpmAPI.createLeadLog(lead.lead_id, `Closed lead`, true);
        bpmAPI.updateLead(lead.lead_id, { status_id: 10 }).then(refresh(true));
    };

    const handleRejectLeadApproved = async () => {
        bpmAPI.createLeadLog(lead.lead_id, `Approved reject request`, true);
        bpmAPI.updateLead(lead.lead_id, { status_id: 7 }).then(refresh(true));
        bpmAPI.createNotification({
            icon: 'failure',
            title: `Lead Rejection Approved`,
            details: `${lead.address}`,
            user: `${lead.sales_id}`,
            href: `/bpm/leads/${lead.lead_id}`,
        });
        handleCloseRejectLeadApprove();
    };

    const handleReviewDeny = () => {
        setOpenLeadReviewDenyDialog(true);
    };

    const approveLeadFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            customer_id: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            customer_id: Yup.number().required(
                'Select a customer to assign the install to'
            ),
        }),
        onSubmit: async (values, helpers) => {
            const install = lead;
            install.customer_id = values.customer_id;

            try {
                // The Form will return a -1 if the user chose to create a new customer
                if (install.customer_id === -1) {
                    const customer = await bpmAPI.createCustomer(lead);
                    install.customer_id = customer.id;
                }
                await bpmAPI.createInstall(install).then(async (res) => {
                    await bpmAPI.createInstallLog(
                        res.id,
                        `Install created`,
                        true
                    );
                    for (const item of systemItems) {
                        await bpmAPI.addItemToInstall(res.id, item);
                    }
                    const leadExtras = await bpmAPI.getLeadExtras(lead.lead_id);
                    for (const extra of leadExtras) {
                        console.log(extra);
                        await bpmAPI.addExtraToInstall(res.id, extra);
                    }
                    await bpmAPI.createLeadLog(
                        lead.lead_id,
                        `Lead approved. Sent to installs`,
                        true
                    );
                    const roles = await bpmAPI.getValidRoles();
                    bpmAPI.createNotification({
                        icon: 'success',
                        title: `${lead.sales}: New Sale`,
                        details: `${lead.name} - ${lead.address}`,
                        role: getRoleID(roles, 'Administration Officer'),
                        href: `/bpm/installs/${res.id}`,
                    });
                    bpmAPI.createNotification({
                        icon: 'success',
                        title: `${lead.sales}: New Sale`,
                        details: `${lead.name} - ${lead.address}`,
                        role: getRoleID(roles, 'Manager'),
                        href: `/bpm/installs/${res.id}`,
                    });
                    bpmAPI.createNotification({
                        icon: 'success',
                        title: `${lead.sales}: New Sale`,
                        details: `${lead.name} - ${lead.address}`,
                        role: getRoleID(roles, 'Sales Manager'),
                        href: `/bpm/installs/${res.id}`,
                    });
                    await bpmAPI
                        .updateLead(lead.lead_id, { status_id: 5 })
                        .then(() => {
                            toast.success('Install Created');
                            refresh(true);
                        });
                });
                helpers.resetForm();
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const approveLeadFormFields = [
        {
            id: 1,
            variant: 'Customer Search',
            width: 12,
            label: 'Assign Customer',
            touched: approveLeadFormik.touched.customer_id,
            errors: approveLeadFormik.errors.customer_id,
            allowCreate: true,
            name: 'customer_id',
        },
    ];

    const ActionListDefault = () => {
        if (user.role === 'Sales') {
            return (
                <ActionList>
                    <ActionListItem
                        icon={CheckCircleIcon}
                        label="Mark as Win"
                        onClick={handleOpenSendToOperations}
                    />
                    <ActionListItem
                        icon={CancelIcon}
                        label="Reject"
                        onClick={handleOpenRejectLead}
                    />
                </ActionList>
            );
        } else {
            return (
                <ActionList>
                    <ActionListItem
                        icon={CheckCircleIcon}
                        label="Mark as Win"
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
        }
    };

    const ActionListRejectPending = () => {
        if (user.role === 'Sales') {
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
        if (user.role === 'Sales') {
            return <Box />;
        } else {
            return (
                <ActionList>
                    <ActionListItem
                        icon={CheckCircleIcon}
                        label="Approve"
                        onClick={() => setOpenLeadReviewApproveDialog(true)}
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

        const roles = await bpmAPI.getValidRoles();
        bpmAPI.createNotification({
            icon: 'failure',
            title: `${user.name}: Lead Rejected`,
            details: `${lead.address}`,
            role: getRoleID(roles, 'Administration Officer'),
            href: `/bpm/leads/${lead.lead_id}`,
        });
        return res;
    };

    // Called when someone denys a lead reject and provides a comment
    const leadRejectDenyFunction = async (comment) => {
        await bpmAPI.createLeadLog(
            lead.lead_id,
            `Info requested: Reject Lead. Comment: ${comment}`,
            true
        );
        await bpmAPI.createNotification({
            icon: 'failure',
            title: `Info requested: Reject Lead`,
            details: `${lead.address}`,
            user: `${lead.sales_id}`,
            href: `/bpm/leads/${lead.lead_id}`,
        });
        const res = await bpmAPI
            .updateLead(lead.lead_id, { status_id: 1 })
            .then(refresh(true));

        return res;
    };

    // Called when a lead review is failed after marking it as a win
    const leadReviewDenyFunction = async (comment) => {
        await bpmAPI.createLeadLog(
            lead.lead_id,
            `Info requested: Sale Review. Comment: ${comment}`,
            true
        );
        await bpmAPI.createNotification({
            icon: 'failure',
            title: `Info requested: Sale Review`,
            details: `${lead.address}`,
            user: `${lead.sales_id}`,
            href: `/bpm/leads/${lead.lead_id}`,
        });
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
                        lead.status_id === 5 ? (
                            <StatusTimeline
                                data={{ status: { label: lead.status } }}
                                statusList={statusOptions
                                    .filter((status) => status.id < 6)
                                    .map((status) => status.name)}
                                inclusive
                            />
                        ) : (
                            <StatusTimeline
                                data={{ status: { label: lead.status } }}
                                statusList={statusOptions.map(
                                    (status) => status.name
                                )}
                            />
                        )
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
            <FormDialog
                onClose={() => setOpenLeadReviewApproveDialog(false)}
                open={openLeadReviewApproveDialog}
                formik={approveLeadFormik}
                title="Send Lead to Installs"
                fields={approveLeadFormFields}
                submitName="Submit"
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
