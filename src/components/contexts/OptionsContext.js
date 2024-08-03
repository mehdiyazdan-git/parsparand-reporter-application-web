import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

const OptionsContext = createContext(null);

const API_ENDPOINTS = {
    YEARS: `${BASE_URL}/years/select`,
    CUSTOMERS: `${BASE_URL}/customers/select`,
    INVOICE_STATUSES: `${BASE_URL}/invoice-statuses/select`,
    WAREHOUSE_RECEIPTS: `${BASE_URL}/warehouse-receipts/select`,
    PRODUCTS: `${BASE_URL}/products/select`,
    CONTRACTS: `${BASE_URL}/contracts/select`
};

const OptionsProvider = ({ children }) => {
    // State for Options
    const [options, setOptions] = useState({
        years: [],
        customers: [],
        invoiceStatuses: [],
        warehouseReceipts: [],
        products: [],
        contracts: []
    });

    // State for Error Handling
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fixed Options (No Fetching Required)
    const productTypes = [
        { value: "PRODUCT", label: 'محصول' },
        { value: "INSURANCEDEPOSIT", label: 'سپرده بیمه' },
        { value: "PERFORMANCEBOUND", label: 'حسن انجام کار' },
        { value: "ADVANCEDPAYMENT", label: 'پیش پرداخت' },
    ];

    // Data Transformation Function
    const changeFormat = (data) => data.map(item => ({ value: item.id, label: item.name }));


    // Fetch Options on Mount
    useEffect(() => {
        const fetchOptions = async () => {
            setIsLoading(true);

            try {
                const optionPromises = Object.keys(API_ENDPOINTS).map(key =>
                    axios.get(API_ENDPOINTS[key]).then(response => changeFormat(response.data))
                );

                const results = await Promise.all(optionPromises);

                setOptions(prevOptions => ({
                    ...prevOptions,
                    years: results[0],
                    customers: results[1],
                    invoiceStatuses: results[2],
                    warehouseReceipts: results[3],
                    products: results[4],
                    contracts: results[5],
                }));

            } catch (error) {
                console.error('Error fetching options:', error);
                setError(error); // Store error for display in the UI
            } finally {
                setIsLoading(false);
            }
        };

        fetchOptions();
    }, []); // Empty dependency array ensures this runs only once on mount



    // Refresh Function
    const refreshOptions = useCallback(async (optionKey) => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS[optionKey.toUpperCase()]);
            setOptions(prevOptions => ({
                ...prevOptions,
                [optionKey]: changeFormat(response.data)
            }));
        } catch (error) {
            console.error(`Error refreshing ${optionKey}:`, error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Context Value
    const contextValue = {
        ...options,
        productTypes,
        refreshOptions,
        isLoading,
        error // Provide the error state to consuming components
    };


    return (
        <OptionsContext.Provider value={contextValue}>
            {children}
        </OptionsContext.Provider>
    );
};

export default OptionsProvider;
export const useOptions = () => useContext(OptionsContext);

