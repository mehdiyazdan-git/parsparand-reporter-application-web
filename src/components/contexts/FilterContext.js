import React, {createContext, useState, useContext, useEffect} from 'react';

const FilterContext = createContext();

export const FilterProvider = ({children}) => {
    const [filters, setFilters] = useState(() => {
        const storedFilters = sessionStorage.getItem('filters');
        return storedFilters ? JSON.parse(storedFilters) : {};
    });

    const defaultFilter = {
        page: 0,
        size: 10,
        sortBy: 'id',
        order: 'desc',
        search: {}
    }


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
    const createFilter = (listName) => {
        if (!filters[listName]) {
            setFilters(prevFilters => ({
                ...prevFilters,
                [listName]: {
                    ...defaultFilter,
                }
            }));
            sessionStorage.setItem('filters', JSON.stringify({
                    ...filters,
                    [listName]: {
                        ...defaultFilter,
                    }
                }
            ));
        }
    };

// Function to set pagination (page and pageSize) for a list
const setPagination = (listName, page, pageSize) => {
    setFilters(prevFilters => {
        const newFilters = {
            ...prevFilters,
            [listName]: {
                ...prevFilters[listName],
                page: page,
                pageSize: pageSize
            }
        };
        sessionStorage.setItem('filters', JSON.stringify(newFilters));
        return newFilters;
    });
};

// Function to get a specific filter value for a list
const getFilter = (listName, key) => {
    return filters[listName]?.[key];
}

// Function to generate query parameters from the filters for a list
const getParams = (listName) => {
    const queryParams = new URLSearchParams();
    if (filters.years?.jalaliYear && filters.years.jalaliYear.label) {
        queryParams.append('jalaliYear', filters.years.jalaliYear.label);
    }
    queryParams.append('page', filters[listName]?.page || 0);
    queryParams.append('size', filters[listName]?.pageSize || 10);
    queryParams.append('order', filters[listName]?.order || '');
    queryParams.append('sortBy', filters[listName]?.sortBy || '');
    Object.keys(filters[listName]?.search || {}).forEach((key) => {
        queryParams.append(key, filters[listName]?.search[key]);
    });
    return queryParams.toString();
}

// Function to clear all filters for a list
const clearFilters = (listName) => {
    setFilters((prevFilters) => {
        const newFilters = {...prevFilters};
        delete newFilters[listName];
        sessionStorage.setItem('filters', JSON.stringify(newFilters));
        return newFilters;
    });
};

// Initialize filters from sessionStorage on mount
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
    <FilterContext.Provider value={{filters, setFilter, clearFilters, getParams, setPagination, getFilter, createFilter}}>
        {children}
    </FilterContext.Provider>
);
}
;

export const useFilters = () => useContext(FilterContext);
