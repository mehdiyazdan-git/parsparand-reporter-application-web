import {useState, useEffect} from 'react';

const useFilter = (resourcePath,initialFilter) => {
    const storageKey = `filter_${resourcePath}`;

    const [filters, setFilters] = useState(() => {
        const storedFilters = sessionStorage.getItem(storageKey);
        return storedFilters ? JSON.parse(storedFilters) : initialFilter;
    });


    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filters));
    }, [filters, storageKey]);


    const updateSearchParams = (newSearch) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            pagination: {
                ...prevFilters.pagination,
                page : 0,
            },
            search: {
                ...prevFilters.search,
                ...newSearch,
            },
        }));
    };

    const updatePagination = (pagination) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            pagination: {
                ...prevFilters.pagination,
                ...pagination,
            },
        }));
    };

    const updateSorting = (sorting) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sorting: {
                ...prevFilters.sorting,
                ...sorting,
            },
        }));
    };

    const resetFilters = () => {
        setFilters(initialFilter);
    };


    return {
        filters,
        updateSearchParams,
        updatePagination,
        updateSorting,
        resetFilters,
    };
};

export default useFilter;
