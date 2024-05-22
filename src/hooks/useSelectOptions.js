// src/hooks/useSelectOptions.js

import { useQuery } from 'react-query';
import useHttp from './useHttp';

export const useYearSelect = () => {
    const http = useHttp();
    return useQuery('yearSelect', async () => {
        const response = await http.get('/years/select');
        return response.data;
    }, {
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export const useCustomerSelect = (searchQuery = '') => {
    const http = useHttp();
    return useQuery(['customerSelect', searchQuery], async () => {
        const response = await http.get(`/customers/select?searchQuery=${searchQuery}`);
        return response.data;
    }, {
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export const useContractSelect = (searchQuery = '') => {
    const http = useHttp();
    return useQuery(['contractSelect', searchQuery], async () => {
        const response = await http.get(`/contracts/select?searchQuery=${searchQuery}`);
        return response.data;
    }, {
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export const useInvoiceStatusSelect = (searchParam = '') => {
    const http = useHttp();
    return useQuery(['invoiceStatusSelect', searchParam], async () => {
        const response = await http.get(`/invoice-statuses/select?searchParam=${searchParam}`);
        return response.data;
    }, {
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};
