import { useState, useCallback, useEffect } from 'react';
import {useOptions} from "../components/contexts/OptionsContext";


const useDynamicAsyncSelect = (
    apiEndpoint,
    searchQueryParam = 'searchQuery',
    labelKey = 'name',
    valueKey = 'id',
    defaultValue = null,
    dependency = [],
) => {
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const { options, refreshOptions, isLoading, setIsLoading} = useOptions();


    const filterOptions = useCallback((options, inputValue, searchQueryParam, labelKey, valueKey) => {
        if (inputValue.trim() === '') return options;
        return options.filter(item =>
            item[labelKey].toLowerCase().includes(inputValue.toLowerCase())
        );
    }, []);

    // Memoized function to get options from context
    const getOptionsFromContext = useCallback(
        (inputValue) => {
            const allOptions = options[apiEndpoint];
            if (!allOptions) {
                refreshOptions(apiEndpoint)
            }
            return filterOptions(allOptions || [], inputValue, searchQueryParam, labelKey, valueKey);
        },
        [apiEndpoint, options, refreshOptions, searchQueryParam, labelKey, valueKey, filterOptions]
    );

    // Load the initial option based on defaultValue
    useEffect(() => {
        if (defaultValue) {
            const initialOption = getOptionsFromContext('').find(o => o.value === defaultValue);
            setSelectedOption(initialOption || null);
        }
    }, [defaultValue, getOptionsFromContext]);


    useEffect(() => {
        if (!options[apiEndpoint]) {
            refreshOptions(apiEndpoint)
        }
    }, [dependency, apiEndpoint, refreshOptions, options]);

    // Memoized loadOptions function to pass to AsyncSelect
    const loadOptions = useCallback(
        (inputValue, callback) => {
            const filteredOptions = getOptionsFromContext(inputValue);
            callback(filteredOptions);
        },
        [getOptionsFromContext]
    );

    return {
        isLoading,
        selectedOption,
        loadOptions,
    };
};

export default useDynamicAsyncSelect;
