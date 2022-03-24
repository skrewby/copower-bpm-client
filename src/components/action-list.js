import { List } from '@mui/material';

export const ActionList = (props) => (
  <List
    dense
    sx={{
      backgroundColor: 'neutral.100',
      width: '100%'
    }}
    {...props}
  />
);
