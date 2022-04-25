import PropTypes from 'prop-types';
import { Card, CardHeader, Divider, Box, TextField } from '@mui/material';
import { LeadSystemSummary } from './lead-system-summary';
import { useFormik } from 'formik';
import { useOutletContext } from 'react-router-dom';

export const LeadSystemItems = (props) => {
    const { onEdit, lead, ...other } = props;
    const [leadState] = useOutletContext();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          id: '#DEV5438',
          sale: 'Reece Valvo',
        },
      });
    return (
        <Card variant="outlined" {...other}>
            <CardHeader
                subheader={
                    <Box>
                    <TextField
                      disabled
                      label="Invoice #"
                      name="id"
                      value={leadState.data.lead_id}
                      sx={{
                        mt: 1,
                        width: 100
                    }}
                    />
                    <TextField
                      disabled
                      label="Assigned Sales"
                      name="sales"
                      value={leadState.data.sales}
                      sx={{
                        mt: 1,
                        ml: 1,
                        width: 150
                    }}
                    />
                    </Box>
                }
                
                title="Quotation"
            />
            <Divider />
            <LeadSystemSummary lead={leadState.data} />
        </Card>
    );
};

LeadSystemItems.propTypes = {
    lead: PropTypes.object,
};
