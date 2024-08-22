import axios from 'axios';
import {IPADDRESS, PORT} from "../../config/config";
import useAuth from "./useAuth";

const baseURL = `http://${IPADDRESS}:${PORT}/api`;

const useHttp = () => {
    const {token} = useAuth();

    const getAll = async (endpoint,params = {}) => {
        return await axios.get(`${baseURL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params
        });
    };
    const post = async (endpoint, data) => {
        return await axios.post(`${baseURL}/${endpoint}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };
    const put = async (endpoint, data) => {
        return await axios.put(`${baseURL}/${endpoint}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };
    const del = async (endpoint) => {
        return await axios.delete(`${baseURL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };
    const upload = async (endpoint, data) => {
        const formData = new FormData();
        formData.append('file', data.file); // Assuming 'file' is the key expected by your backend

        try {
            return await axios.post(`${baseURL}/${endpoint.url}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            // Handle Axios errors here and re-throw for the component to handle
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw new Error(error.response.data.message

                    || 'خطا در آپلود فایل. لطفا مجددا تلاش کنید.');
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('مشکل در شبکه. لطفا اتصال اینترنت خود را بررسی کنید.');
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error('خطایی رخ داده است. لطفا مجددا تلاش کنید.');
            }
        }
    };
    const download = async (endpoint) => {
        return await axios.get(`${baseURL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob' // Important for downloading files
        });
    }

    return {getAll, post, put, del, upload, download};

}
export default useHttp;
