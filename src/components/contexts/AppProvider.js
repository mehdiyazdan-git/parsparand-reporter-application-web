import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';

const AppContext = createContext(null);

const AppProvider = ({children}) => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouseReceipts, setWarehouseReceipts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [years, setYears] = useState([]);
    const [invoiceStatuses, setInvoiceStatuses] = useState([]);

    const BASE_URL = 'http://localhost:9090/api';

    const api = axios.create({
        baseURL: BASE_URL
    });
    const formatArray = (data) => {
        return data.map(option => ({value: option.id , label: option.name}))
    }

    const persistInSessionStorage = (storageKey, value) => {
        sessionStorage.setItem(storageKey, JSON.stringify(value));
    };


    useEffect(() => {

        const fetchAllData = async () => {
            try {
                const responses = await Promise.all([
                    api.get('/customers/select'),
                    api.get('/products/select',{params : {'searchQuery' : ""}}),
                    api.get('/warehouse-receipts/select'),
                    api.get('/invoices/select',{params : {'searchQuery' : ""}}),
                    api.get('/contracts/select',{params : {'searchQuery' : ""}}),
                    api.get('/years/select'),
                    api.get('/invoice-statuses/select'),
                ]);

                setCustomers(formatArray(responses[0].data));
                setProducts(formatArray(responses[1].data));
                setWarehouseReceipts(formatArray(responses[2].data));
                setInvoices(formatArray(responses[3].data));
                setContracts(formatArray(responses[4].data));
                setYears(formatArray(responses[5].data));
                setInvoiceStatuses(formatArray(responses[6].data));

                persistInSessionStorage('customers', formatArray(responses[0].data));
                persistInSessionStorage('products', formatArray(responses[1].data));
                persistInSessionStorage('warehouseReceipts', formatArray(responses[2].data));
                persistInSessionStorage('invoices', formatArray(responses[3].data));
                persistInSessionStorage('contracts', formatArray(responses[4].data));
                persistInSessionStorage('years', formatArray(responses[5].data));
                persistInSessionStorage('invoiceStatuses', formatArray(responses[6].data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllData();
    }, []);

    return (
        <AppContext.Provider value={{
            customers,
            products,
            warehouseReceipts,
            invoices,
            contracts,
            years,
            invoiceStatuses,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export {AppProvider, AppContext};