import PropTypes from 'prop-types';

// Material UI
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

// Local imports
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { StatusSelect } from '../../components/timeline/status-select';
import { StatusTimeline } from '../../components/timeline/status-timeline';

/**
 * Container to be used within other containers therefore props need to be passed to it
 * as if it was a component.
 */
export const ServiceProgress = (props) => {
    const { service, refresh, statusOptions, ...other } = props;

    const handleStatusChange = (event) => {
        const new_status_id = event.target.value;
        bpmAPI.createServiceLog(
            service.id,
            `Changed status to ${statusOptions[event.target.value - 1].name}`,
            true
        );
        bpmAPI
            .updateService(service.id, { status_id: new_status_id })
            .then(refresh(true));
    };

    const ActionListNothing = () => {
        return null;
    };

    const ChooseActionList = () => {
        switch (service.status_id) {
            default:
                return <ActionListNothing />;
        }
    };

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader title="Progress" />
                <Divider />
                <CardContent>
                    <StatusSelect
                        onChange={handleStatusChange}
                        options={statusOptions}
                        value={
                            statusOptions.filter(
                                (status) => status.id === service.status_id
                            )[0]?.id || ''
                        }
                    />
                    <Divider sx={{ my: 2 }} />
                    <StatusTimeline
                        data={{ status: { label: service.status_label } }}
                        statusList={statusOptions.map((status) => status.name)}
                        inclusive
                    />
                </CardContent>
                <Divider />
                {ChooseActionList()}
            </Card>
        </>
    );
};

ServiceProgress.propTypes = {
    lead: PropTypes.object,
};
