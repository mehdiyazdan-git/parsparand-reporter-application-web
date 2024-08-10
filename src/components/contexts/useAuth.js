import {createContext, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../config/config";

const AuthContext = createContext();

const useAuth = (
) => {
    const [accessToken, setAccessToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const api = axios.create({
        baseURL: BASE_URL, // Replace with your backend URL
    });

    const login = async (username, password) => {
        try {
            const response = await api.post("/auth/login", { username, password });
            setAccessToken(response.data.accessToken);
            setUsername(response.data.username);
            setUserRole(response.data.role);

            // Store the values in session storage
            sessionStorage.setItem("accessToken", response.data.accessToken);
            sessionStorage.setItem("username", response.data.username);
            sessionStorage.setItem("userRole", response.data.role);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setUsername(null);
        setUserRole(null);

        // Remove the values from session storage
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userRole");
    };

    return {
        accessToken,
        username,
        userRole,
        login,
        logout
    };
};

export { useAuth, AuthContext };
