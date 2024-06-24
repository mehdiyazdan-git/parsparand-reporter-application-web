import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const FilterContext = createContext();

const initialValues = {
    page: 0,
    size: 5,
    sortBy: "id",
    order: "asc",
    totalPages: 0,
    totalElements: 0,
};

const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState(() => {
        const storedFilters = localStorage.getItem('filters');
        return storedFilters ? JSON.parse(storedFilters) : {};
    });

    const pageable = useMemo(() => ({
        page: 0,
        size: 5,
        sortBy: "id",
        order: "asc",
        totalPages: 0,
        totalElements: 0,
    }), []);

    const setupFilter = useCallback((listName, columns) => {
        if (Array.isArray(columns) && columns.length > 0) {
            const newFilter = columns.reduce((acc, column) => {
                if (column.searchable) {
                    acc[column.name] = '';
                }
                return acc;
            }, {});
            const filterObject = { ...pageable, ...newFilter };
            updateFilter(listName, filterObject);
        }

    }, [pageable]);

    const updateFilter = useCallback((listName, newValues) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [listName]: {
                ...prevFilters[listName],
                ...newValues,
            }
        }));
    }, []);

    const resetFilter = useCallback((listName) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [listName]: initialValues,
        }));
    }, []);

    const getJalaliYear = useCallback((entityName) => {
        return JSON.parse(sessionStorage.getItem(`filter_${entityName}`));
    }, []);

    const getParams = useCallback((entity, excludes = [], subtotal = false) => {
        const params = new URLSearchParams();
        const filter = JSON.parse(sessionStorage.getItem(`filter_${entity}`));
        for (const [key, value] of Object.entries(filter)) {
            if (value !== null && value !== undefined) {
                params.set(key, value);
            }
            if (key === 'jalaliYear' && value !== null && value !== undefined) {
                params.set('jalaliYear', sessionStorage.getItem('jalaliYear'));
            }
        }
        if (subtotal) {
            params.set('size', filter?.totalElements || 1000000);
            params.set('page', '0');
        }
        excludes.forEach(param => params.delete(param));
        return params;
    }, []);

    useEffect(() => {
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);

    return (
        <FilterContext.Provider value={{
            filters,
            setupFilter,
            updateFilter,
            resetFilter,
            getJalaliYear,
            getParams,
            pageable,
            initialValues,
        }}
        >
            {children}
        </FilterContext.Provider>
        );
    };

export default FilterProvider;
