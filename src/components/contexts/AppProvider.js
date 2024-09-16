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
   const [VATRates, setVATRates] = useState([]);



    const BASE_URL = 'http://localhost:9090/api';

    const api = axios.create({
        baseURL: BASE_URL
    });

    const formatArray = (data) => data.map(option => ({value: option.id, label: option.name}));

    const persistInSessionStorage = (storageKey, value) => {
        sessionStorage.setItem(storageKey, JSON.stringify(value));
    };

    // Individual fetch functions
    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers/select');
            const formattedData = formatArray(response.data);
            setCustomers(formattedData);
            persistInSessionStorage('customers', formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/select', {params: {searchQuery: ""}});
            const formattedData = response.data.map(option => ({
                value: option.id,
                label: option.name,
                advancePayment : option.advancePayment,
                insuranceDeposit: option.insuranceDeposit,
                performanceBond: option.performanceBond
            }))
            setProducts(formattedData);
            persistInSessionStorage('products', formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWarehouseReceipts = async () => {
        try {
            const response = await api.get('/warehouse-receipts/select');
            const formattedData = formatArray(response.data);
            setWarehouseReceipts(formattedData);
            persistInSessionStorage('warehouseReceipts', formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/invoices/select', {params: {searchQuery: ""}});
            const formattedData = formatArray(response.data);
            setInvoices(formattedData);
            persistInSessionStorage('invoices', formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchContracts = async () => {
        try {
            const response = await api.get('/contracts/select', {params: {searchQuery: ""}});
            const formattedData = formatArray(response.data);
            setContracts(formattedData);
            persistInSessionStorage('contracts', formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchYears = async () => {
        try {
            const response = await api.get('/years/select');
            const formattedData = formatArray(response.data);
            setYears(formattedData);
            persistInSessionStorage('years', formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInvoiceStatuses = async () => {
        try {
            const response = await api.get('/invoice-statuses/select');
            const formattedData = formatArray(response.data);
            setInvoiceStatuses(formattedData);
            persistInSessionStorage('invoiceStatuses', formattedData);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchVATRates = async () => {
        try {
            const response = await api.get('/vat-rates/select');
            console.log(response.data);
            setVATRates(response.data);
        }catch (error) {
            console.error(error);
        }
    }
        const sourcePath = [
            { id: 'customers', func: fetchCustomers },
            { id: 'products', func: fetchProducts },
            { id: 'warehouse-receipts', func: fetchWarehouseReceipts },
            { id: 'invoices', func: fetchInvoices },
            { id: 'contracts', func: fetchContracts },
            { id: 'years', func: fetchYears },
            { id: 'invoice-statuses', func: fetchInvoiceStatuses },
            { id: 'vat-rates', func: fetchVATRates }
        ];

        const refreshSource = (source) => {
        const sourceFunc = sourcePath.find(item => item.id === source)?.func;
        if (sourceFunc) {
            sourceFunc();
        }
    }


useEffect(() => {
    // Fetch all data initially
    fetchCustomers();
    fetchProducts();
    fetchWarehouseReceipts();
    fetchInvoices();
    fetchContracts();
    fetchYears();
    fetchInvoiceStatuses();
    fetchVATRates()
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
        VATRates,
        refreshSource,
        refreshCustomers: fetchCustomers,
        refreshProducts: fetchProducts,
        refreshWarehouseReceipts: fetchWarehouseReceipts,
        refreshInvoices: fetchInvoices,
        refreshContracts: fetchContracts,
        refreshYears: fetchYears,
        refreshInvoiceStatuses: fetchInvoiceStatuses
    }}>
        {children}
    </AppContext.Provider>
);
}
;

export {AppProvider, AppContext};
