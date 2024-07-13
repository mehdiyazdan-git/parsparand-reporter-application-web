import { useCallback } from 'react';
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

export const useGetAllProducts = () => {
    const http = useHttp();
    return useCallback((queryParams) => {
        return http.get(`/products?${queryParams}`);
    }, [http]);
};

export const useCreateProduct = () => {
    const http = useHttp();
    return useCallback((data) => {
        return http.post('/products', data);
    }, [http]);
};

export const useUpdateProduct = () => {
    const http = useHttp();
    return useCallback((id, data) => {
        return http.put(`/products/${id}`, data);
    }, [http]);
};

export const useDeleteProduct = () => {
    const http = useHttp();
    return useCallback((id) => {
        return http.delete(`/products/${id}`);
    }, [http]);
};

export const useDownloadProducts = () => {
    const http = useHttp();
    return useCallback(() => {
        return http.get('/products/download-all-products.xlsx', { responseType: 'blob' });
    }, [http]);
};

export const useImportProducts = () => {
    const http = useHttp();
    return useCallback((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return http.post('/products/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }, [http]);
};
