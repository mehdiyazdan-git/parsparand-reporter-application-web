import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({});

    const setFilter = (listName, key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [listName]: {
                ...(prevFilters[listName] || {}),
                [key]: value
            }
        }));
    };

    const createFilter = (listName, initialFilter) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [listName]: initialFilter
        }));
    };

    const clearFilters = (listName) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            delete newFilters[listName];
            return newFilters;
        });
    };

    const getParams = (listName) => {
        const queryParams = new URLSearchParams();
        const filter = filters[listName] || {};
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                queryParams.append(key, value);
            }
        });
        return queryParams.toString();
    };

    return (
        <FilterContext.Provider value={{
            filters,
            setFilter,
            createFilter,
            clearFilters,
            getParams
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => useContext(FilterContext);
