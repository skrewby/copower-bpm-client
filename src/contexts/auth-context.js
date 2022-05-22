import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

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
    createUserWithEmailAndPassword: () => Promise.resolve(),
    signInWithEmailAndPassword: () => Promise.resolve(),
    logout: () => Promise.resolve(),
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
                            user: null,
                        },
                    });
                } else {
                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            }),
        [dispatch]
    );

    const signInWithEmailAndPassword = (email, password) => {};
    //firebase.auth().signInWithEmailAndPassword(email, password);

    const createUserWithEmailAndPassword = async (email, password) => {};
    //firebase.auth().createUserWithEmailAndPassword(email, password);

    const logout = async () => {
        //await firebase.auth().signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'BPM',
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
