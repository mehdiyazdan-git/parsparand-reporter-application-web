import {useState} from 'react';

const useFilter = (entityName, initialValues) => {
    const storageKey = `filter_${entityName}`;
    const [filter, setFilter] = useState(() => {
        const storedFilter = JSON.parse(sessionStorage.getItem(storageKey)) || {};
        return {...initialValues, ...storedFilter};
    });

    const updateFilter = (entityName, newValues) => {
        setFilter(prevFilter => ({...prevFilter, ...newValues}));
        sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(newValues));
    }


    const getJalaliYear = () => {
        return JSON.parse(sessionStorage.getItem(`filter_${entityName}`));
    }

    const getParams = (entity,excludes = [],subtotal = false) => {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined && !excludes.includes(key)) {
                if (Array.isArray(value)) {
                    value.forEach(val => params.set(key, val));
                }
            }
        });
        if (subtotal) {
            params.set('size', filter?.totalElements || 1000000);
            params.set('page', '0');
            params.delete('totalElements');
            params.delete('totalPages');
        }
        excludes.forEach(param => params.delete(param));
        return params;
    };

    return {
        filter,
        updateFilter,
        getParams,
        getJalaliYear,
    };
};

export default useFilter;
