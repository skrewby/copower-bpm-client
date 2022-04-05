import PropTypes from 'prop-types';
import { List } from '@mui/material';

export const InstallPreviewList = (props) => {
  const { children, ...other } = props;

  return (
    <List
      disablePadding
      sx={{ width: '100%' }}
      {...other}
    >
      {children}
    </List>
  );
};

InstallPreviewList.propTypes = {
  children: PropTypes.node
};
