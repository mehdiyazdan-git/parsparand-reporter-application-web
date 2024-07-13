import {useCallback, useState} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import useDeepCompareEffect from './useDeepCompareEffect';
import {BASE_URL} from "../config/config";
import {useDataContext} from "../components/contexts/DataContext";

const defaultResponse = {
    content: [],
    pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
            empty: false,
            sorted: true,
            unsorted: false
        },
        offset: 0,
        unpaged: false,
        paged: true
    },
    last: false,
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    numberOfElements: 0,
    first: true,
    empty: false
};



const useData = (entityName, initialFilter) => {
    const {setDataState} = useDataContext()
    const [data, setData] = useState(defaultResponse);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deepMerge = useCallback(function deepMerge(obj1, obj2) {
        const result = {...obj1};

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
    }, [])

    const [filter, setFilter] = useState(() => {
        if (!(entityName === undefined || entityName === null || entityName === '')) {
            const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
            const merge = deepMerge(initialFilter, storedFilter);
            sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(merge));
            return merge;
        }
    });




    // getParams is used to get the params from the filter object
    const getParams = (added = {}, excludes = {}) => {
        const params = new URLSearchParams();
        Object.keys(filter).forEach(key => {
            if (filter[key] && !excludes[key]) {
                params.append(key, filter[key]);
            }
        });
        return params;
    }

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            Object.keys(filter).forEach(key => {
                if (filter[key]) {
                    params.append(key, filter[key]);
                }
            });

            if (!(entityName === undefined || entityName === null || entityName === '')) {
                const url = `${BASE_URL}/${entityName}?${params.toString()}`;
                const response = await axios.get(url, {

                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                });
                setData(response.data)
                setDataState(response.data)
            }

        } catch (error) {
                console.log(error)
                setError(error);
            } finally {
                setLoading(false);
            }
    }, [filter, entityName])

    useDeepCompareEffect(() => {
        if (!(entityName === undefined || entityName === null || entityName === '')) {
            fetchData();
        }
    }, [filter, fetchData]);

    const updateFilter = useCallback((newValues) => {
        if (!(entityName === undefined || entityName === null || entityName === '')) {
            const storedFilter = JSON.parse(sessionStorage.getItem(`filter_${entityName}`)) || {};
            const merged = deepMerge(storedFilter, newValues);
            sessionStorage.setItem(`filter_${entityName}`, JSON.stringify(merged));
            setFilter(merged);
        }
    },[deepMerge, entityName]);

    const handleSizeChange = useCallback((newSize) => {
        updateFilter({size: newSize, page: 0});
    }, [updateFilter]);

    const goToFirstPage = () => updateFilter({page: 0});
    const goToPrevPage  = () => updateFilter({page: filter.page - 1});
    const goToNextPage  = () => updateFilter({page: filter.page + 1});
    const goToLastPage  = () => updateFilter({page: data.totalPages - 1});

    return {
        data,
        loading,
        error,
        fetchData,
        filter,
        getParams,
        updateFilter,
        handleSizeChange,
        goToFirstPage,
        goToPrevPage,
        goToNextPage,
        goToLastPage
    };
};

useData.propTypes = {
    initialUrl: PropTypes.string.isRequired,
    initialFilter: PropTypes.object,
    initialPaginateParams: PropTypes.object.isRequired,
    defaultResponse: PropTypes.object.isRequired,
};

useData.defaultProps = {
    initialUrl: '',
    initialFilter: {page: 0, size: 10}
};

export default useData;
