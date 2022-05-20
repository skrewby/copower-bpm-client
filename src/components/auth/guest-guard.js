import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const GuestGuard = ({ children }) => {
    if (true) {
        return <Navigate to="/bpm/dashboard" />;
    }

    return <>{children}</>;
};

GuestGuard.propTypes = {
    children: PropTypes.node,
};
