import {useState} from 'react';


const useFilter = (entityName, initialValues) => {
    const [filter, setFilter] = useState(() => {
        const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
        return {...initialValues, ...storedFilter};
    });

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

    const updateFilter = (entityName, newValues) => {
        const parse = JSON.parse(sessionStorage.getItem(`filter_${entityName}`));
        setFilter(deepMerge(parse, newValues))
        sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(filter));
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
