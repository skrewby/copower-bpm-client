import PropTypes from 'prop-types';
import { Button, Card, CardHeader, Divider, Grid } from '@mui/material';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';

const phasesOptions = [
  {
    value: 1,
    label: '1'
  },
  {
    value: 2,
    label: '2'
  },
  {
    value: 3,
    label: '3'
  }
];

const storyOptions = [
  {
    value: '1',
    label: '1'
  },
  {
    value: '2',
    label: '2'
  },
  {
    value: '3+',
    label: '3+'
  }
];

const roofTypeOptions = [
  {
    value: 'Tile',
    label: 'Tile'
  },
  {
    value: 'Colourbond',
    label: 'Colourbond'
  },
  {
    value: 'Klip-Lok',
    label: 'Klip-Lok'
  }
];

const existingSystemOptions = [
  {
    value: 'New',
    label: 'New'
  },
  {
    value: 'Additional',
    label: 'Additional'
  },
  {
    value: 'Replace',
    label: 'Replace'
  }
];

export const InstallPropertyDetails = (props) => {
  const { onEdit, install, ...other } = props;
  const phaseOption = phasesOptions
    .find((option) => option.value === install.phase);
  const storyOption = storyOptions
    .find((option) => option.value === install.story);
  const roofTypeOption = roofTypeOptions
    .find((option) => option.value === install.roof);
  const existingSystemOption = existingSystemOptions
    .find((option) => option.value === install.existingSystem);

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
        title="Property Details"
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
              label="Phases"
              value={phaseOption.label}
            />
            <PropertyListItem
              label="Story"
              value={storyOption.label}
            />
            <PropertyListItem
              label="Roof Type"
              value={roofTypeOption.label}
            />
            <PropertyListItem
              label="NMI"
              value={install.nmi}
            />
            <PropertyListItem
              label="Comment"
              value={install.propertyComment}
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
              label="Existing System"
              value={existingSystemOption.label}
            />
            <PropertyListItem
              label="Retailer"
              value={install.retailer}
            />
            <PropertyListItem
              label="Distributor"
              value={install.distributor}
            />
            <PropertyListItem
              label="Meter Number"
              value={install.meterNum}
            />
          </PropertyList>
        </Grid>
      </Grid>
    </Card>
  );
};

InstallPropertyDetails.propTypes = {
  onEdit: PropTypes.func,
  install: PropTypes.object.isRequired
};
