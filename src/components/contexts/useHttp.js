// src/hooks/useHttp.js
import {useState, useRef} from 'react';
import axios from 'axios';
import {BASE_URL} from "../../config/config";
import {useAuth} from "./useAuth";
import {useNavigate} from "react-router-dom";

const serializeParams = (params) => {
    return Object.keys(params)
        .map((key) => {
            if (Array.isArray(params[key])) {
                return params[key].map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            } else if (typeof params[key] === 'object') {
                return Object.keys(params[key]).map((subKey) => `${encodeURIComponent(key)}[${subKey}]=${encodeURIComponent(params[key][subKey])}`).join('&');
            } else if (params[key] !== null && params[key] !== undefined) {
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            } else if (params[key] === null || params[key] === undefined) {
                return `${encodeURIComponent(key)}=${encodeURIComponent('')}`;
            } else {
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
            }
        })
        .join('&');
}

const useHttp = () => {
    const {accessToken} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);


    const request = async ({
                                           url,
                                           method = 'GET',
                                           body = null,
                                           params = null,
                                           headers = {}
                                       }) => {
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        setIsLoading(true);
        setError(null);
        abortControllerRef.current = new AbortController();

        try {
            const response = await axios({
                url: `${BASE_URL}/${url}?${serializeParams(params)}`,
                method,
                data: body,
                headers,
                signal: abortControllerRef.current.signal,
            });

            setIsLoading(false);
            return response;

        } catch (err) {
            setIsLoading(false);

            if (err.response) {
                // Handle specific error statuses
                if (err.response.status === 401) navigate('/login');
                else if (err.response.status === 403) navigate('/forbidden');
                else if (err.response.status === 404) navigate('/not-found');
                else if (err.response.status === 500) navigate('/internal-server-error');
                // Handle other error statuses or generic API errors here
                else setError(err.response.data || 'An error occurred during the request.');
            } else if (err.request) {
                // Handle network errors (e.g., no internet connection)
                setError(() => 'Network error. Please check your internet connection.');
            } else {
                // Handle other unexpected errors
                setError(() => 'An unexpected error occurred.');
            }
            throw err;
        }
    }

    const methods = {
        get: ({url, params, headers}) => request({url, method: 'GET', params, headers}),
        post: ({url, body, headers}) => request({url, method: 'POST', body, headers}),
        update: ({url, body, headers}) => request({url, method: 'PUT', body, headers}),
        remove: ({url, body, headers}) => request({url, method: 'DELETE', body, headers}),
    }

    return {
        isLoading,
        error,
        methods,
        abortRequest: () => abortControllerRef.current?.abort(), // Optional chaining in case abortControllerRef is not yet set
    };
};

export default useHttp;
