import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode';

// Local imports
import { bpmServer } from '../api/bpm/bpm-server';

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    AUTH_STATE_CHANGED: (state, action) => {
        const { isAuthenticated, user } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
};

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
    ...initialState,
    method: 'BPM',
});

export const AuthProvider = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(
        () =>
            bpmServer.subscribe((user) => {
                if (user) {
                    // Here you should extract the complete user profile to make it available in your entire app.
                    // The auth state only provides basic information.
                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: {
                            isAuthenticated: true,
                            idToken: user.idToken,
                            user: jwt_decode(user.idToken),
                        },
                    });
                } else {
                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: {
                            isAuthenticated: false,
                            idToken: null,
                            user: null,
                        },
                    });
                }
            }),
        [dispatch]
    );

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'BPM',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
