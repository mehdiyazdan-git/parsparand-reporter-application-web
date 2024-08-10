// src/hooks/useHttp.js
import {useState, useRef} from 'react';
import axios from 'axios';
import {BASE_URL, IPADDRESS, PORT} from "../../config/config";
import {useAuth} from "./useAuth";
import {useNavigate} from "react-router-dom";
import serializeParams from "./serializeParams";



const useHttp = () => {
    const {accessToken} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const baseURL = `http://${IPADDRESS}:${PORT}/api`; // Replace with your API base URL

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
                url: `${baseURL}/${url}?${serializeParams(params)}`,
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

    const upload = async ({url, file, headers}) => {
        const formData = new FormData();
        formData.append('file', file);
        return request({url, method: 'POST', body: formData, headers});
    }

    const download = async ({ url, params, fileName, headers = {} }) => {
        try {
            // eslint-disable-next-line no-use-before-define
            const response = await fetch(`${baseURL}/${url}?${serializeParams(params)}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error.message);
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
        upload,
        download,
        abortRequest: () => abortControllerRef.current?.abort(), // Optional chaining in case abortControllerRef is not yet set
    };
};

export default useHttp;