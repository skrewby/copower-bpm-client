import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
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

const statusOptions = [
  {
    color: 'info.main',
    label: 'New',
    value: 'new'
  },
  {
    color: 'error.main',
    label: 'Contacted',
    value: 'contacted'
  },
  {
    color: 'warning.main',
    label: 'Quotation',
    value: 'quotation'
  },
  {
    color: 'success.main',
    label: 'Complete',
    value: 'complete'
  }
];

export const LeadProgress = (props) => {
  const { lead, ...other } = props;
  const [sendToOperationsOpen, handleOpenSendToOperations, handleCloseSendToOperations] = useDialog();
  const [rejectLeadOpen, handleOpenRejectLead, handleCloseRejectLead] = useDialog();
  const [closeLeadOpen, handleOpenCloseLead, handleCloseCloseLead] = useDialog();
  const [status, setStatus] = useState(lead?.progress || '');
  const [newStatus, setNewStatus] = useState(lead?.progress || '');

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleSaveChanges = () => {
    setStatus(newStatus);
    lead.progress = newStatus;
    toast.success('Changes saved');
  };

  const handleSendToOperations = () => {
    handleCloseSendToOperations();
    toast.error('Not implemented yet');
  };

  const handleRejectLead = () => {
    handleCloseRejectLead();
    toast.error('Not implemented yet');
  };

  const handleCloseLead = () => {
    handleCloseCloseLead();
    toast.error('Not implemented yet');
  };

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <CardHeader title="Lead Progress" />
        <Divider />
        <CardContent>
          <StatusSelect
            onChange={handleStatusChange}
            options={statusOptions}
            value={newStatus}
          />
          <Button
            color="primary"
            onClick={handleSaveChanges}
            sx={{ my: 2 }}
            variant="contained"
          >
            Save Changes
          </Button>
          <Typography
            sx={{
              color: 'text.secondary',
              display: 'block'
            }}
            variant="caption"
          >
            {`Updated ${format(new Date(), 'dd/MM/yyyy HH:mm')}`}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <LeadTimeline status={status} />
        </CardContent>
        <Divider />
        <ActionList>
          <ActionListItem
            disabled={lead.progress !== "complete"}
            icon={CheckCircleIcon}
            label="Send to Operations"
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
      </Card>
      <ConfirmationDialog
        message="You cannot send this lead to operations yet. Missing: Meterbox photo"
        onCancel={handleCloseSendToOperations}
        onConfirm={handleSendToOperations}
        open={sendToOperationsOpen}
        title="Send to Operations"
        variant="error"
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
    </>
  );
};

LeadProgress.propTypes = {
  lead: PropTypes.object
};
