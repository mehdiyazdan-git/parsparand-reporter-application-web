import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
    const [filter, setFilter] = useState(() => {
        const storedFilter = localStorage.getItem('filter');
        return storedFilter ? JSON.parse(storedFilter) : initialValues;
    });

    const pageable = useMemo(() => ({
        page: 0,
        size: 5,
        sortBy: "id",
        order: "asc",
        totalPages: 0,
        totalElements: 0,
    }), []);

    // Function to prepopulate a filter object by context Table columns
    const setupFilter = useCallback((columns) => {
        if (Array.isArray(columns) && columns.length > 0) {
            const newFilter = columns.reduce((acc, column) => {
                if (column.searchable) {
                    acc[column.name] = '';
                }
                return acc;
            }, {});
            const filterObject = { ...pageable, ...newFilter };
            updateFilter(filterObject);
        }
    }, [pageable]);

    // Function to update filter parameters
    const updateFilter = useCallback((newValues) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            ...newValues,
        }));
    }, []);

    // Function to reset filter to initial values
    const resetFilter = useCallback(() => {
        setFilter(initialValues);
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

    // Save filter values to sessionStorage whenever filter changes
    useEffect(() => {
        sessionStorage.setItem('filter', JSON.stringify(filter));
    }, [filter]);

    return (
        <FilterContext.Provider value={{
            filter,
            updateFilter,
            resetFilter,
            getParams,
            getJalaliYear,
            setupFilterInTableContext: setupFilter,
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

export default FilterProvider;
