import { useCallback, useEffect, useState } from 'react';
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
import { bpmAPI } from '../../api/bpmAPI';
import { useMounted } from '../../hooks/use-mounted';
import parseISO from 'date-fns/parseISO';

export const LeadProgress = (props) => {
  const { lead, refresh, ...other } = props;
  const [sendToOperationsOpen, handleOpenSendToOperations, handleCloseSendToOperations] = useDialog();
  const [rejectLeadOpen, handleOpenRejectLead, handleCloseRejectLead] = useDialog();
  const [closeLeadOpen, handleOpenCloseLead, handleCloseCloseLead] = useDialog();

  const mounted = useMounted();
  const [statusOptions, setStatusOptions] = useState({ isLoading: true, data: [] });
  const getData = useCallback(async () => {
    setStatusOptions(() => ({ isLoading: true, data: [] }));

    try {
      const statusAPI = await bpmAPI.getLeadStatusOptions();
      const statusResult = statusAPI.map((row) => {
        return ({
          status_id: row.status_id,
          status_name: row.status_name,
          status_colour: row.status_colour
        });
      });

      if (mounted.current) {
        setStatusOptions(() => ({
          isLoading: false,
          data: statusResult
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setStatusOptions(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [mounted]);

  useEffect(() => {
    getData().catch(console.error);
  }, [getData]);

  const handleStatusChange = (event) => {
    const new_status_id = event.target.value;
    bpmAPI.updateLead(lead.lead_id, {status_id: new_status_id});
    refresh(true);
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
            options={statusOptions.data}
            value={statusOptions.data.filter(status => status.status_id === lead.status_id)[0]?.status_id || ''}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              display: 'block'
            }}
            variant="caption"
          >
            {`Updated ${format(parseISO(lead.last_updated), 'dd MMM yyyy HH:mm')}`}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <LeadTimeline lead={lead} />
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
