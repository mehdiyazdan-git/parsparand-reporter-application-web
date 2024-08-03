import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from "./useAuth";
import {BASE_URL} from "../config/config";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authState: { accessToken } } = useAuth();

    const client = axios.create({ baseURL: BASE_URL });

    // Request Interceptor for Authorization Header
    client.interceptors.request.use(
        config => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // Response Interceptor for Error Handling (Global)
    client.interceptors.response.use(
        response => response,
        error => {
            setError(error.response?.data || "An unexpected error occurred.");
            return Promise.reject(error); // Propagate the error
        }
    );

    // Generic Request Function
    const request = useCallback(async (method, url, data = null, params = null) => {
        setIsLoading(true);
        try {
            const response = await client({
                method,
                url,
                data,
                params
            });
            setIsLoading(false);
            return response.data;
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data || 'An unexpected error occurred.');
            throw err; // Re-throw the error for more specific handling elsewhere
        }
    }, [accessToken]); // Dependency on accessToken


    // CRUD Helper Methods
    const get = useCallback(async (url, params) => request('GET', url, null, params), [request]);
    const post = useCallback(async (url, data) => request('POST', url, data), [request]);
    const put = useCallback(async (url, data) => request('PUT', url, data), [request]);
    const del = useCallback(async (url) => request('DELETE', url), [request]);

    return { get, post, put, del, error, setError, isLoading };
};

export default useHttp;
