
import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
    const [customers, setCustomers] = useState([{ id: '', name: '' }]);
    const [products, setProducts] = useState([{ id: '', name: '' }]);

    useEffect(() => {
        fetch('http://localhost:3000/customers')
            .then((response) => response.json())
            .then((data) => setCustomers(data));
        fetch('http://localhost:3000/products')
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, []);

    return (
        <AppContext.Provider value={{ customers, products }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppProvider, AppContext };

