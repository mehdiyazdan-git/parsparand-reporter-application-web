import React, { createContext, useState, useContext, useEffect } from 'react';

const FilterContext = createContext();



export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState(() => {
        const storedFilters = sessionStorage.getItem('filters');
        return storedFilters
            ? JSON.parse(storedFilters)
            : {
                default: {
                    page: 0,
                    size: 10,
                    sortBy: '',
                    order: '',
                    search: {}
                }
            };
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

    const clearFilters = (listName) => {
        setFilters((prevFilters) => {
            const newFilters = { ...prevFilters };
            delete newFilters[listName];
            sessionStorage.setItem('filters', JSON.stringify(newFilters));
            return newFilters;
        });
    };

    useEffect(() => {
        //initialize the filters with default values
        const initializeFilters = () => {
            const storedFilters = sessionStorage.getItem('filters');
            if (!storedFilters) {
                const defaultFilters = {
                    default: {
                        page: 0,
                        size: 10,
                        sortBy: '',
                        order: '',
                        search: {}
                    }
                };
                setFilters(defaultFilters);
                sessionStorage.setItem('filters', JSON.stringify(defaultFilters));
            }
        };

        initializeFilters();
    }, []);

    return (
        <FilterContext.Provider value={{ filters, setFilter, clearFilters}}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => useContext(FilterContext);
