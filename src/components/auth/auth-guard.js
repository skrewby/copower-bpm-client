import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Local imports
import { Login } from '../../containers/auth/login';
import { useAuth } from '../../hooks/use-auth';
import { SocketContext, socket } from '../../contexts/socket-context';

export const AuthGuard = (props) => {
    const { children } = props;
    const location = useLocation();
    const [requestedLocation, setRequestedLocation] = useState(null);
    const { isAuthenticated, user } = useAuth();

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

    // We add the SocketContext here instead of at the BPMLayout because we only want users
    // that can send a valid JWT to connect to the socket server
    socket.emit('join-room', user.role_id);
    socket.emit('join-room', user.account_id);
    return (
        <SocketContext.Provider value={socket}>
            <>{children}</>
        </SocketContext.Provider>
    );
};

AuthGuard.propTypes = {
    children: PropTypes.node,
};
