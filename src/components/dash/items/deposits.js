import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardHeader, Divider } from '@mui/material';
import { InstallPreviewItem } from './deposit-preview-item';
import { InstallPreviewList } from './install-preview-list';

export const LatestInstall = (props) => {
  const { installs } = props;

  return (
    <Card
      variant="outlined"
      {...props}
    >
      <CardHeader
        action={(
          <Button
            color="primary"
            component={RouterLink}
            to="#"
            variant="text"
          >
            Go to customers
          </Button>
        )}
        title="Recent Deposits"
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

LatestInstall.propTypes = {
  installs: PropTypes.array
};
