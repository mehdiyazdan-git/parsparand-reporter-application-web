import { useState } from 'react';

const useFilter = (entityName, initialValues) => {
    const defaultFilter = {
        ...initialValues
    };

    const [filter, setFilter] = useState(() => {} );

    function deepMerge(obj1, obj2) {
        const result = { ...obj1 };

        for (let key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
                    result[key] = deepMerge(obj1[key], obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }
        return result;
    }

    const updateFilter = (newValues) => {
        const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
        const merged = deepMerge(storedFilter, newValues);
        sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(merged));
        setFilter(merged);
    };

    const getJalaliYear = () => {
        return JSON.parse(sessionStorage.getItem(`filter_${entityName}`))?.jalaliYear || null;
    };

    const getParams = (excludes = [], subtotal = false) => {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined && !excludes.includes(key)) {
                if (Array.isArray(value)) {
                    value.forEach(val => params.set(key, val));
                } else {
                    params.set(key, value);
                }
            }
        });
        excludes.forEach((exclude) => {
            params.delete(exclude);
        });
        if (subtotal) {
            params.set('size', 1000000);
            params.set('page', 0);
        }
        return params;
    };

    const resetFilter = () => {
        setFilter(defaultFilter);
        sessionStorage.removeItem(`filter_${entityName}`);
    };

    return {
        filter,
        updateFilter,
        getParams,
        getJalaliYear,
        resetFilter
    };
};

export default useFilter;
