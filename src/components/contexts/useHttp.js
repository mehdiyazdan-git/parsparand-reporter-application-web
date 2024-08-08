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
    }, [accessToken, navigate, httpRef]);

    const serializeParams = (params) => {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        searchParams.append(key, item.toString().trim());
                    });
                } else {
                    searchParams.append(key, value.toString().trim());
                }
            }
        }
        return searchParams.toString();
    }


    const get = async (url, params = {}) => {
           return await httpRef.current.get(`${BASE_URL}/${url}?${serializeParams(params)}`);
     }

    const post = useCallback(async (url, data) => {
      return  await httpRef.current.post(`${BASE_URL}/${url}`, data);

    }, []);

    const put = async (url, data) => {
        return await httpRef.current.put(`${BASE_URL}/${url}/${data.id}`, data);
    }

    const del = useCallback(async (url, id) => {
        await httpRef.current.delete(`${BASE_URL}/${url}/${id}`);
    }, []);

    return { get, post, put, del, error, setError };
};

export default useHttp;
