import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider } from '@mui/material';
import { LeadSystemSummary } from './lead-system-summary';

export const LeadSystemItems = (props) => {
    const { onEdit, lead, ...other } = props;

    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                action={
                    <Button color="primary" onClick={onEdit} variant="text">
                        Edit
                    </Button>
                }
                title="Quotation"
            />
            <Divider />
            <LeadSystemSummary lead={lead} />
        </Card>
    );
};

LeadSystemItems.propTypes = {
    lead: PropTypes.object,
};
