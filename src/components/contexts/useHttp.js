import {useState} from 'react';
import axios from 'axios';
import {IPADDRESS, PORT} from "../../config/config";
import useAuth from "./useAuth";

const baseURL = `http://${IPADDRESS}:${PORT}/api`;

const useHttp = () => {
    const [error, setError] = useState(null);
    const {token} = useAuth();

    const getAll = async (endpoint,params = {}) => {
        try {
            return await axios.get(`${baseURL}/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params
            });
        } catch (err) {
            setError(err.message);
        }
    };
    const post = async (endpoint, data) => {
        try {
            return await axios.post(`${baseURL}/${endpoint}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            setError(err.message);
        }
    };
    const put = async (endpoint, data) => {
        try {
            return await axios.put(`${baseURL}/${endpoint}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            setError(err.message);
        }
    };
    const del = async (endpoint) => {
        try {
            return await axios.delete(`${baseURL}/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return {getAll, post, put, del, error};

}
export default useHttp;
