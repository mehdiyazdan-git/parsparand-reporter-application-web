import { useState, useEffect } from 'react';

const useFilter = (entityListName,initialFilter) => {
    const storageKey = `filter_${entityListName}`;

    const filterSchema = {
        search: {},
        pagination: {
            page: 0,
            size: 10,
        },
        sorting: {
            order: 'asc',
            sortBy: 'id',
        },
    };

    const getInitialFilters = (storageKey) => {
        const storedFilters = sessionStorage.getItem(storageKey);
        return storedFilters ? JSON.parse(storedFilters) : initialFilter || filterSchema; // if initialFilter is passed then use it else use filterSchema
    };

    const [filters, setFilters] = useState(getInitialFilters(storageKey,initialFilter));


    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filters));
    }, [filters, storageKey]);




    const updateSearchParams = (newSearch) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
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
        setFilters(filterSchema);
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
