import React, { useEffect, useState } from 'react';
import useHttp from "../components/contexts/useHttp";

const SelectServices = () => {
    const http = useHttp();
    const [customerOptions, setCustomerOptions] = useState([]);

    useEffect(() => {
        const fetchAndStoreOptions = async () => {
            try {
                const optionsFromStorage = sessionStorage.getItem('customerOptions');
                if (optionsFromStorage) {
                    setCustomerOptions(JSON.parse(optionsFromStorage));
                } else {
                    const freshOptions = await customerSelect();
                    sessionStorage.setItem('customerOptions', JSON.stringify(freshOptions));
                    setCustomerOptions(freshOptions);
                }
            } catch (err) {
                console.error("Error fetching or storing customer options:", err.message);
            }
        };

        fetchAndStoreOptions();
    }, []); // Empty dependency array ensures this runs only once on mount

    const customerSelect = async (searchQuery = '') => {
        try {
            const response = await http.get(`/customers/select`, {
                params: { searchQuery }
            });
            const formattedOptions = response.data.map(item => ({
                value: item.id,
                label: item.name
            }));

            // Update session storage with the new search results
            sessionStorage.setItem('customerOptions', JSON.stringify(formattedOptions));
            return formattedOptions;
        } catch (err) {
            console.error("Error fetching customer options:", err.message);
            throw err;
        }
    };

    return (
        // Your component's JSX, now using customerOptions
        {/* ... your JSX (e.g., a dropdown or similar component) ... */}
    );
};

export default SelectServices;

