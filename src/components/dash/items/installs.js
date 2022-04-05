import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardHeader, Divider } from '@mui/material';
import { InstallPreviewItem } from './install-preview-item';
import { InstallPreviewList } from './install-preview-list';

export const LatestInstalls = (props) => {
    const { installs } = props;

    return (
        <Card variant="outlined" {...props}>
            <CardHeader
                action={
                    <Button
                        color="primary"
                        component={RouterLink}
                        to="#"
                        variant="text"
                    >
                        Go to installs
                    </Button>
                }
                title="Latest Installs"
            />
            <Divider />
            <InstallPreviewList>
                {installs.map((install, index) => (
                    <InstallPreviewItem
                        divider={installs.length > index + 1}
                        key={install.id}
                        install={install}
                    />
                ))}
            </InstallPreviewList>
        </Card>
    );
};

LatestInstalls.propTypes = {
    installs: PropTypes.array,
};
