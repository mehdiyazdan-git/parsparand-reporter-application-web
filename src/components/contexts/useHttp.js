import {createContext, useContext, useState} from "react";
import axios from "axios";
import {useAuth} from "./useAuth";
import {IPADDRESS, PORT} from "../../config/config";

const HttpContext = createContext();

const useHttp = (entityName) => {

    const {accessToken} = useAuth();
    const baseUrl = `http://${IPADDRESS}:${PORT}/api`;

    const http = axios.create({ baseURL: baseUrl });

    http.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers['Content-Type'] = 'application/json';
        return config;
    });
    const findAll = async (params) => {
        return await http.get(`${entityName}?${params.toString()}`);
    }

    const getEntity = async () => {
      return await http.get(`${entityName}`)
    };

    const postEntity = async (data) => {
      return await http.post(`${entityName}`, data)
    };

    const updateEntity = async (data) => {
       return await http.put(`${entityName}`, data)
    };

    const deleteEntity = async (id) => {
       return await http.delete(`${entityName}/${id}`)
    };

    const downloadExcelFile = async (data) => {
        return await http.post(`${entityName}/download`, data, {responseType: 'blob'});
    }

    return {
        findAll,
        getEntity,
        postEntity,
        updateEntity,
        deleteEntity,
        downloadExcelFile
    };
};

export { useHttp, HttpContext };
