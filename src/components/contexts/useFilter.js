import { useState } from 'react';

const useFilter = (entityName, initialValues) => {
    const [filter, setFilter] = useState(() => {
        if ((sessionStorage.getItem(`filter_${entityName}`) !== 'undefined')){
            const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
            return { ...initialValues, ...storedFilter };
        }else {
            return initialValues;
        }
    });

    function deepMerge(obj1, obj2) {
        const result = { ...obj1 };

        for (let key in obj2) {
            if (Object.prototype.hasOwnProperty.call(obj2, key)) {
                if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
                    result[key] = deepMerge(obj1[key], obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }

        return result;
    }

    const updateFilter = (entityName, newValues) => {
        if (sessionStorage.getItem(`filter_${entityName}`) !== 'undefined') {
            const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
            const merged = deepMerge(storedFilter, newValues);
            sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(merged));
            setFilter(merged);
        }else {
            setFilter(newValues);
        }

    };

    const getJalaliYear = () => {
        return JSON.parse(sessionStorage.getItem(`filter_${entityName}`))?.jalaliYear || null;
    };

    const getParams = (entity, excludes = [], subtotal = false) => {
        const params = new URLSearchParams();
        if (filter === null || filter === undefined) {
            return params;
        }
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
            params.set('size', filter?.totalElements || 1000000);
        }
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
