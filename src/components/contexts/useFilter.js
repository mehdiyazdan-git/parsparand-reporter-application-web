import {useCallback, useEffect, useMemo, useState} from 'react';
import useHttp from "../../hooks/useHttp";



const useFilter = (entityName, initialValues) => {
    const storageKey = `filter_${entityName}`;
    const [filter, setFilter] = useState(
        {...initialValues,
            'jalaliYear' : JSON.parse(sessionStorage.getItem('jalaliYear')),
            ...JSON.parse(sessionStorage.getItem(storageKey) || '{}')}
    );
    const http = useHttp();
    const years = async() => {
        return await http.get('/years/select').then(res => res.data);
    };

     const pageable = useMemo(() => ({
         page: 0,
         size: 10,
         sortBy: "id",
         order: "asc",
         totalPages: 0,
         totalElements: 0,
     }), [])

    useEffect(() => {
            let jalaliYear;
            if (!filter.jalaliYear){
                if (sessionStorage.getItem('jalaliYear')){
                    jalaliYear = sessionStorage.getItem('jalaliYear');
                }else {
                    jalaliYear = years().then(res => res[0]);
                }
            }

            if (!sessionStorage.getItem(storageKey)) {
                const filterObject = { ...pageable,
                    ...initialValues,
                    'jalaliYear' : jalaliYear,
                };
                updateFilter(filterObject);

            }
        }, [initialValues]);

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
    }, []);


    // Function to update filter parameters
    const updateFilter = (newValues) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            ...newValues,
        }));
    };


     const findFilterItemByItemKey = useCallback((itemKey) => {
         if (sessionStorage.getItem(`filter_${entityName}`)){
             const filter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`));
             if (filter && filter[itemKey]) {
                 return filter[itemKey];
             }
         }
         return{}
    },[entityName])

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
        setupFilterInTableContext: setupFilter,
        findFilterByKey: findFilterItemByItemKey
    };
};

export default useFilter;
