import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from "../../config/config";

const OptionsContext = createContext(null);

const YEAR_OPTIONS_API = `${BASE_URL}/years/select`;
const CUSTOMER_OPTIONS_API = `${BASE_URL}/customers/select`;
const INVOICE_STATUS_OPTIONS_API = `${BASE_URL}/invoice-statuses/select`;
const WAREHOUSE_RECEIPT_OPTIONS_API = `${BASE_URL}/warehouse-receipts/select`;
const PRODUCT_OPTIONS_API = `${BASE_URL}/products/select`;
const CONTRACT_OPTIONS_API = `${BASE_URL}/contracts/select`;


const OptionsProvider = ({ children }) => {
    const [yearOptions, setYearOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [invoiceStatusOptions, setInvoiceStatusOptions] = useState([]);
    const [warehouseReceiptOptions, setWarehouseReceiptOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [contractOptions, setContractOptions] = useState([]);


    //fixed length array options
    const productTypes = [
        { value: "PRODUCT", label: 'محصول' },
        { value: "INSURANCEDEPOSIT", label: 'سپرده بیمه' },
        { value: "PERFORMANCEBOUND", label: 'حسن انجام کار' },
        { value: "ADVANCEDPAYMENT", label: 'پیش پرداخت' },
    ]


    const changeFormat = (data) => {
           return data.map(item => ({ value: item.id, label: item.name }));
    }

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const years = await axios.get(YEAR_OPTIONS_API).then(response => changeFormat(response.data));
                const customers = await axios.get(CUSTOMER_OPTIONS_API).then(response => changeFormat(response.data));
                const invoiceStatuses = await axios.get(INVOICE_STATUS_OPTIONS_API).then(response => changeFormat(response.data));
                const warehouseReceipts = await axios.get(WAREHOUSE_RECEIPT_OPTIONS_API).then(response => changeFormat(response.data));
                const products = await axios.get(PRODUCT_OPTIONS_API).then(response => changeFormat(response.data));
                const contracts = await axios.get(CONTRACT_OPTIONS_API).then(response => changeFormat(response.data));

                setYearOptions(years);
                setCustomerOptions(customers);
                setInvoiceStatusOptions(invoiceStatuses);
                setWarehouseReceiptOptions(warehouseReceipts);
                setProductOptions(products);
                setContractOptions(contracts);

            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
    }, []);

    const refreshOptions = async (optionKey) => {
        try {
            let newOptions;
            switch (optionKey) {
                case 'year':
                    newOptions = await axios.get(YEAR_OPTIONS_API).then(response => changeFormat(response.data));
                    setYearOptions(newOptions);
                    break;
                case 'customer':
                    newOptions = await axios.get(CUSTOMER_OPTIONS_API).then(response => changeFormat(response.data));
                    setCustomerOptions(newOptions);
                    break;
                case 'invoiceStatus':
                    newOptions = await axios.get(INVOICE_STATUS_OPTIONS_API).then(response => changeFormat(response.data));
                    setInvoiceStatusOptions(newOptions);
                    break;

                case 'warehouseReceipt':
                    newOptions = await axios.get(WAREHOUSE_RECEIPT_OPTIONS_API).then(response => changeFormat(response.data));
                    setWarehouseReceiptOptions(newOptions);
                    break;

                case 'product':
                    newOptions = await axios.get(PRODUCT_OPTIONS_API).then(response => changeFormat(response.data));
                    setProductOptions(newOptions);
                    break;

                case 'contract':
                    newOptions = await axios.get(CONTRACT_OPTIONS_API).then(response => changeFormat(response.data));
                    setContractOptions(newOptions);
                    break;

                default:
                    console.error('Invalid option key:', optionKey);
                    break;
            }
        } catch (error) {
            console.log('Error fetching options:', error)
        }
    }

        return (
            <OptionsContext.Provider value={{
                yearOptions,
                customerOptions,
                invoiceStatusOptions,
                warehouseReceiptOptions,
                productOptions,
                contractOptions,
                refreshOptions,
                productTypes
            }}>
                {children}
            </OptionsContext.Provider>
        );
    }
export default OptionsProvider;
export const useOptions = () => useContext(OptionsContext);

