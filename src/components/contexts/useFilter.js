import {createContext, useEffect, useState} from "react";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";

const FilterContext = createContext();

const useFilter = (entityName,initialValues = {
    search: {},
    pageable: {
        page: 0,
        size: 10
    },
    sort: {
        order: 'asc',
        sortBy: 'id',
    },
    subTotals: []
},

    storageKey = `filter-${entityName}`) => {

    const [filter, setFilter] = useState(
        JSON.parse(sessionStorage.getItem(storageKey)) || initialValues
    );

    useDeepCompareEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filter));
    }, [filter, storageKey]);

    const updateSearch = (newSearch) => {
        setFilter({...filter, search: {...filter.search, ...newSearch}});
    }

    const updatePageable = (newFilter) => {
        setFilter({...filter, pageable: {...filter.pageable, ...newFilter}});
    }

    const updateSort = (newSort) => {
        setFilter({...filter, sort: {...filter.sort, ...newSort}});
    }


    const getParams = () => {
        const params = new URLSearchParams();
        filter.search && Object.keys(filter.search).forEach(key => {
            params.append(key, filter.search[key])
        });
        params.append('page', filter.pageable.page);
        params.append('size', filter.pageable.size);
        params.append('sort', `${filter.sort.sortBy},${filter.sort.order}`);
        return params;
    }

    return {
        filter,
        updateSearch,
        updatePageable,
        updateSort,
        getParams
    };
};

export { useFilter, FilterContext };
