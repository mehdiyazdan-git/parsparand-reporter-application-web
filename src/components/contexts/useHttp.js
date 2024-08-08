// src/hooks/useHttp.js
import {useState, useCallback, useRef, useEffect} from 'react';
import axios from 'axios';
import {BASE_URL} from "../../config/config";
import {useAuth} from "./useAuth";
import {useNavigate} from "react-router-dom";

const useHttp = () => {
    const [error, setError] = useState(null);
    const {accessToken} = useAuth();
    const navigate = useNavigate();

    const httpRef = useRef(axios.create({ baseURL: BASE_URL }));

    useEffect(() => {
        // Add interceptors to the stored Axios instance
        httpRef.current.interceptors.request.use(
            config => {
                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            error => {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.log(error.response.data);
                        navigate('/login');
                    }
                }
                if (!error.response && error.request){
                    console.log(error.request);
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
        // Cleanup function to remove interceptors (optional, but good practice)
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            httpRef.current.interceptors.request.eject(0); // Remove the first interceptor
        };
    }, [accessToken, navigate]);

    const get = useCallback(async (url, params = {}) => {
        try {
            const response = await httpRef.current.get(url, {
                params: params, // Automatically handles params as an object or URLSearchParams
                paramsSerializer: (params) => {
                    // Custom serializer for undefined values
                    const searchParams = new URLSearchParams();
                    for (const [key, value] of Object.entries(params)) {
                        if (value !== undefined) {
                            searchParams.append(key, value.toString().trim());
                        }
                    }
                    return searchParams.toString();
                }
            });

            console.log('http get response', response.data);
            return response.data;

        } catch (error) {
            console.error('http get error', error.response?.data || error.message);

            const errorMessage = error.response?.data?.message || error.message || 'خطا در بارگذاری.';
            setError(errorMessage); // Set a user-friendly error message

            if (error.response && error.response.status === 401) {
                navigate('/login'); // Handle 401 (Unauthorized) errors globally
            }

            throw error; // Rethrow the error to allow the calling component to handle it if needed
        }
    },[navigate]);




    const post = useCallback(async (url, data) => {
        try {
            const response = await axios.post(`${BASE_URL}/${url}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'خطا در ایجاد.');
            throw err;
        }
    }, []);

    const put = useCallback(async (url, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${url}/${data.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'خطا در بروز رسانی.');
            throw err;
        }
    }, []);

    const del = useCallback(async (url, id) => {
        try {
            await axios.delete(`${BASE_URL}/${url}/${id}`);
        } catch (err) {
            setError(err.response?.data || 'خطا در حذف.');
            throw err;
        }
    }, []);

    return { get, post, put, del, error, setError };
};

export default useHttp;
