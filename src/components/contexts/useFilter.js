import {useCallback, useEffect, useMemo, useState} from 'react';


const useFilter = (entityName, initialValues) => {

    const storageKey = `filter_${entityName}`;
    // Load filter values from sessionStorage on component mount
    const storedFilter = sessionStorage.getItem(storageKey);
    const initialFilter = (storedFilter !== "undefined" && storedFilter !== null) ? JSON.parse(storedFilter) : initialValues;

    const [filter, setFilter] = useState(initialFilter);


     const pageable = useMemo(() => ({
         page: 0,
         size: 5,
         sortBy: "id",
         order: "asc",
         totalPages: 0,
         totalElements: 0,
     }), [])

    const setupFilterInTableContext = useCallback((columns) => {
        if (Array.isArray(columns) && columns.length > 0)  {
            const newFilter = {};
            columns.forEach(column => {
                if (column.searchable){
                    newFilter[column.name] = '';
                }
            });
            const filterObject = Object.assign({}, pageable, newFilter);
            updateFilter(filterObject);
        }
    }, [pageable])
    // Function to update filter parameters
    const updateFilter = (newValues) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            ...newValues,
        }));
    };
     const getFilterFromOtherEntities = (otherKey) => {
         if (sessionStorage.getItem(`filter_${otherKey}`)){
             return JSON.parse(sessionStorage.getItem(`filter_${otherKey}`));
         }
         return{};
    }

    // Function to reset filter to initial values
    const resetFilter = () => {
        setFilter(initialValues);
    };
    const getJalaliYear = () => {
        return JSON.parse(sessionStorage.getItem(`filter_${entityName}`));
    }

    const getParams = (entity,excludes = [],subtotal = false) => {
        const params = new URLSearchParams();
        const filter = JSON.parse(sessionStorage.getItem(`filter_${entity}`));
        for (const [key, value] of Object.entries(filter)) {
            if (value !== null && value !== undefined) {
                params.set(key, value);
            }
            if (key === 'jalaliYear' && value !== null && value !== undefined) {
                params.set('jalaliYear', sessionStorage.getItem(`jalaliYear`));
            }
        }
        if (subtotal) {
            params.set('size', filter?.totalElements || 1000000);
            params.set('page', '0');
        }
        excludes.forEach(param => params.delete(param));
        return params;
    };

    // Save filter values to sessionStorage whenever filter changes
    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filter));
    }, [filter, storageKey]);

    return {
        filter,
        updateFilter,
        resetFilter,
        getParams,
        getJalaliYear,
        setupFilterInTableContext,
        getFilterFromOtherEntities
    };
};

export default useFilter;
