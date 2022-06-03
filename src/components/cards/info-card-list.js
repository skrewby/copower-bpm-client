import PropTypes from 'prop-types';
import { List } from '@mui/material';

export const InfoCardList = (props) => {
    const { children } = props;

    return <List disablePadding>{children}</List>;
};

InfoCardList.propTypes = {
    children: PropTypes.node,
};
