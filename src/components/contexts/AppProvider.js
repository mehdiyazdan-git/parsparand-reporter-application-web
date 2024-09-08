import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
    const [customers, setCustomers] = useState([{ id: '', name: '' }]);
    const [products, setProducts] = useState([{ id: '', name: '' }]);
    const [warehouseReceipts, setWarehouseReceipts] = useState([{ id: '', name: '' }]);
    const [invoices, setInvoices] = useState([{ id: '', name: '' }]);
    const [contracts, setContracts] = useState([{ id: '', name: '' }]);

    const BASE_URL = 'http://localhost:9090/api';

    const api = axios.create({
        baseURL: BASE_URL
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const responses = await Promise.all([
                    api.get('/customers/select'),
                    api.get('/products/select'),
                    api.get('/warehouse-receipts'),
                    api.get('/invoices'),
                    api.get('/contracts')
                ]);

                setCustomers(responses[0].data);
                setProducts(responses[1].data);
                setWarehouseReceipts(responses[2].data);
                setInvoices(responses[3].data);
                setContracts(responses[4].data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllData();
    }, []);

    return (
        <AppContext.Provider value={{ customers, products, warehouseReceipts, invoices, contracts }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppProvider, AppContext };