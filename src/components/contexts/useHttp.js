// src/hooks/useHttp.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import {BASE_URL} from "../../config/config";
import {useAuth} from "./useAuth";
import {useNavigate} from "react-router-dom";

const useHttp = () => {
    const [error, setError] = useState(null);
    const {accessToken} = useAuth();
    const navigate = useNavigate();

    const http = axios.create({
        baseURL: BASE_URL,
    });
    http.interceptors.request.use(
        config => {
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            config.headers['Content-Type'] = 'application/json';
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

    const get = useCallback(async (url, params) => {
        try {
            const response = await axios.get(`${BASE_URL}/${url}?${params.toString()}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'An unexpected error occurred.');
            throw err;
        }
    }, []);

    const post = useCallback(async (url, data) => {
        try {
            const response = await axios.post(`${BASE_URL}/${url}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'An unexpected error occurred.');
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
            setError(err.response?.data || 'An unexpected error occurred.');
            throw err;
        }
    }, []);

    const del = useCallback(async (url, id) => {
        try {
            await axios.delete(`${BASE_URL}/${url}/${id}`);
        } catch (err) {
            setError(err.response?.data || 'An unexpected error occurred.');
            throw err;
        }
    }, []);

    return { get, post, put, del, error, setError };
};

export default useHttp;
