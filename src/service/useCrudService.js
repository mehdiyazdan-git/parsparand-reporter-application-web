
import axios from 'axios';
import { BASE_URL } from '../config/config';

const useHttp = () => {
    const http = axios.create({
        baseURL: BASE_URL,
      });

    http.interceptors.request.use(config => {
        // Add token or other auth headers here if needed
        return config;
    });

    http.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                // Handle auth errors
            }
        }
        return Promise.reject(error);
    });

    return http;
};

export const useCrudService = (entityName) => {
    const http = useHttp();
    /***
     getAll( queryParams) - get all entities with optional query params
       queryParams: { page: '0', size: 10 }
     ***/
    const getAll = async (queryParams) => {
        return await http.get(`/${entityName}`,{
            params : queryParams
        });
    }

    const create = async (data) => {
        return await http.post(`/${entityName}`, data);
    }

    const update = async (id, data) => {
        return await http.put(`/${entityName}/${id}`, data);
    }

    const remove = async (id) => {
        return await http.delete(`/${entityName}/${id}`);
    }

    const download = async (queryParams) => {
        return await http.get(`/${entityName}/download-all.xlsx`, {
            responseType: 'blob',
            params : queryParams ? queryParams : ''
        });
    }

    const importData = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return await http.post(`/${entityName}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    return {
        getAll,
        create,
        update,
        remove,
        download,
        importData
    };
};
