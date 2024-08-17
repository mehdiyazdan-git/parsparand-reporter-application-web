import { useState, useEffect } from 'react';

const useAuth = () => {
    const tokenStorageKey = 'auth_token';
    const usernameStorageKey = 'auth_username';
    const userRoleStorageKey = 'auth_userRole';

    // Get initial auth state from sessionStorage
    const getInitialAuthState = () => {
        const storedToken = sessionStorage.getItem(tokenStorageKey);
        const storedUsername = sessionStorage.getItem(usernameStorageKey);
        const storedUserRole = sessionStorage.getItem(userRoleStorageKey);

        return storedToken
            ? {
                isAuthenticated: true,
                token: storedToken,
                username: storedUsername || '',
                userRole: storedUserRole || '',
            }
            : {
                isAuthenticated: false,
                token: null,
                username: '',
                userRole: '',
            };
    };

    const [authState, setAuthState] = useState(getInitialAuthState);

    useEffect(() => {
        if (authState.isAuthenticated) {
            sessionStorage.setItem(tokenStorageKey, authState.token);
            sessionStorage.setItem(usernameStorageKey, authState.username);
            sessionStorage.setItem(userRoleStorageKey, authState.userRole);
        } else {
            sessionStorage.removeItem(tokenStorageKey);
            sessionStorage.removeItem(usernameStorageKey);
            sessionStorage.removeItem(userRoleStorageKey);
        }
    }, [authState]);

    const login = (token, username, userRole) => {
        setAuthState({
            isAuthenticated: true,
            token,
            username,
            userRole,
        });
    };

    const logout = () => {
        setAuthState({
            isAuthenticated: false,
            token: null,
            username: '',
            userRole: '',
        });
    };

    const isAuthenticated = () => authState.isAuthenticated;

    const getToken = () => authState.token;

    const getUsername = () => authState.username;

    const getUserRole = () => authState.userRole;

    return {
        authState,
        login,
        logout,
        isAuthenticated,
        getToken,
        getUsername,
        getUserRole,
    };
};

export default useAuth;
