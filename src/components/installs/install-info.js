import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';

export const InstallInfo = (props) => {
  const { install, onEdit, ...other } = props;

  return (
    <Card
      variant="outlined"
      {...other}
    >
      <CardHeader
        action={(
          <Button
            color="primary"
            onClick={onEdit}
            variant="text"
          >
            Edit
          </Button>
        )}
        title="Customer Info"
      />
      <Divider />
      <Grid container>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Customer Name"
              value={install.name}
            />
            <PropertyListItem
              label="Email Address"
              value={install.email}
            />           
          </PropertyList>
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Address"
              value={install.streetAddress}
            />
            <PropertyListItem
              label="Phone Number"
              value={install.contactNum}
            />
          </PropertyList>
        </Grid>
      </Grid>
    </Card>
  );
};

InstallInfo.propTypes = {
  onEdit: PropTypes.func,
  install: PropTypes.object.isRequired
};
