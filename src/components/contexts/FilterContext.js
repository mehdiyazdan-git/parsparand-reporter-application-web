import React, {createContext, useState, useContext, useEffect, Children} from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState(() => {
        const storedFilters = sessionStorage.getItem('filters');
        return storedFilters ? JSON.parse(storedFilters) : {};
    });

    const setFilter = (listName, key, value) => {
        setFilters((prevFilters) => {
            const newFilters = {
                ...prevFilters,
                [listName]: {
                    ...(prevFilters[listName] || {}),
                    [key]: value
                }
            };
            sessionStorage.setItem('filters', JSON.stringify(newFilters));
            return newFilters;
        });
    };

    const getFilter = (listName, key) => {
        return filters[listName]?.[key];
    }
    const getParams = (listName) => {

        const queryParams = new URLSearchParams();
        if (filters.years?.jalaliYear && filters.years.jalaliYear.label) {
            queryParams.append('jalaliYear', filters.years.jalaliYear.label);
        }
        queryParams.append('page', filters[listName]?.page || 0);
        queryParams.append('pageSize', filters[listName]?.pageSize || 10);
        queryParams.append('order', filters[listName]?.order || '');
        queryParams.append('sortBy', filters[listName]?.sortBy || '');
        queryParams.append('search', filters[listName]?.search || '');
        Object.keys(filters[listName]?.search || {}).forEach((key) => {
            queryParams.append(key, filters[listName]?.search[key])
        })
        return queryParams.toString();
    }

    const clearFilters = (listName) => {
        setFilters((prevFilters) => {
            const newFilters = { ...prevFilters };
            delete newFilters[listName];
            sessionStorage.setItem('filters', JSON.stringify(newFilters));
            return newFilters;
        });
    };

    useEffect(() => {
        const initializeFilters = () => {
            const storedFilters = sessionStorage.getItem('filters');
            if (!storedFilters) {
                const defaultFilters = {};
                setFilters(defaultFilters);
                sessionStorage.setItem('filters', JSON.stringify(defaultFilters));
            }
        };
        initializeFilters();
    }, []);

    return (
        <FilterContext.Provider value={{ filters, setFilter, clearFilters, getParams }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => useContext(FilterContext);
