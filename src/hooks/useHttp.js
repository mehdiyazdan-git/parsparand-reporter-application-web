import axios from 'axios';
import { BASE_URL } from '../config/config';
import { useAuth } from './useAuth';
import {useLocation, useNavigate} from "react-router-dom";

const useHttp = () => {
    const navigate = useNavigate()
    const auth = useAuth();
    const location = useLocation();



    const instance = axios.create({
        baseURL: BASE_URL,
    });

    instance.interceptors.request.use(function (config) {
        let queryParams = new URLSearchParams(location.search);
        let paramsObject = {};
        queryParams.forEach((value, key) => {
            paramsObject[key] = value;
        });
        // Store query params in location.state
        navigate(location.pathname, { state: paramsObject, replace: true });

        config.headers.Authorization = `Bearer ${auth.accessToken}`;
        if (config.headers['Content-Type'] === null){
            config.headers['Content-Type'] = 'application/json';
        }
        if (config.headers['Accept'] === null){
            config.headers['Accept'] = 'application/json';
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });


    instance.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response){
            if (error.response.status === 401 || error.response.status === 403) {
                auth.logout();
                navigate("/login");
            }
        }
        return Promise.reject(error);
    });

    return instance;
};

export default useHttp;
