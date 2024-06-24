import {useEffect, useState} from 'react';


const useFilter = (entityName, initialValues) => {
    const [filter, setFilter] = useState((entityName, initialValues) => {
        const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
        return {...initialValues, ...storedFilter};
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
        const parse = JSON.parse(sessionStorage.getItem(`filter_${entityName}`));
        const merged = deepMerge(parse, newValues)
        sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(merged));
    };




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
            excludes.forEach((exclude) => {
                params.delete(exclude);

            });
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
