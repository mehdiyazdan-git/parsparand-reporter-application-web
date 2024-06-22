import {useEffect, useMemo, useState} from 'react';
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


    const updateFilter = (target = {}, ...filter) => {
        filter.forEach(source => {
            if (source) {
                Object.keys(source).forEach(key => {
                    let targetValue = target[key];
                    let sourceValue = source[key];
                    target[key] = targetValue instanceof Object && sourceValue instanceof Object ?
                        updateFilter(targetValue, sourceValue) :
                        sourceValue;
                });
            }
        });
        setFilter(target);
        sessionStorage.setItem(storageKey, JSON.stringify(filter));
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
                } else {
                    params.set(key, value);
                }
            }
        });
        if (subtotal) {
            params.set('size', filter?.totalElements || 1000000);
            params.set('page', '0');
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
