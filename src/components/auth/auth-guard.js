import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Local imports
import { Login } from '../../containers/auth/login';
import { useAuth } from '../../hooks/use-auth';

export const AuthGuard = (props) => {
    const { children } = props;
    const location = useLocation();
    const [requestedLocation, setRequestedLocation] = useState(null);
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        if (location.pathname !== requestedLocation) {
            setRequestedLocation(location.pathname);
        }

        return <Login />;
    }

    // This is done so that in case the route changes by any chance through other
    // means between the moment of request and the render we navigate to the initially
    // requested route.
    if (requestedLocation && location.pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }

    return <>{children}</>;
};

AuthGuard.propTypes = {
    children: PropTypes.node,
};
