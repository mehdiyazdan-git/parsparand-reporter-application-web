import React, {useEffect, useState} from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import useAsync from "../../hooks/useAsync";
import {useOptions} from "../contexts/OptionsContext";
import PropTypes from "prop-types";
import {getCustomSelectStyles} from "../../utils/customStyles";


const AsyncSelectSearch = (props) => {
    const { noOptionMessages, loadOptions } = useAsync(loadOptionsFn);
    const [selectedOption, setSelectedOption] = useState(null);
    const {customerOptions} = useOptions();

    async function loadOptionsFn(inputValue) {
        if (inputValue.trim() === '') {
            return [];
        }
        try {
            const response = await axios.get(`${props.apiEndpoint}?searchQuery=${inputValue}`);
            return response.data.map((i) => ({
                label: i.name,
                value: i.id,
            }));
        } catch (error) {
            console.error("خطا در واکشی اطلاعات...:", error);
            throw error;
        }
    }

    useEffect(() => {
        if (props.value === null || props.value === undefined) {
            setSelectedOption(null);
        }else if (props.value) {
            if (typeof props.value === 'number') {
                setSelectedOption(customerOptions.find(option => option.value === props.value));
            }else if (typeof props.value === 'string'){
                setSelectedOption(customerOptions.find(option => option.label === Number(props.value)));
            } else
            setSelectedOption(null);
        }
    }, [customerOptions, props.value]);

    useEffect(() => {
        const loadInitialItem = async () => {
            if (props.value === null || props.value === undefined) return;
            if (props.value) {
                try {
                    const response = await axios.get(props.apiEndpoint, {
                        params: {
                            [props.searchQueryParam || 'searchQuery']: props.value
                        },
                    });
                    setSelectedOption(response.data.map(item => ({
                        label: item[props.labelKey || 'name'],
                        value: item[props.valueKey || 'id'],
                    }))[0]);
                } catch (error) {
                    console.error(`Error fetching from ${props.apiEndpoint}:`, error);
                }
            }
        };

        loadInitialItem();
    }, [props.value, props.labelKey, props.valueKey, props.searchQueryParam]);

    return (
        <AsyncSelect
            {...props}
            placeholder={"انتخاب..."}
            onChange={(selected) => props.onChange?.(selected?.value)}
            value={selectedOption}
            noOptionsMessage={noOptionMessages}
            loadOptions={loadOptions} // useAsync handles initial loading
            cacheOptions
            defaultOptions={customerOptions}
            isClearable
            styles={getCustomSelectStyles()}
        />
    );
};
AsyncSelectSearch.propsTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    searchQueryParam: PropTypes.string,
    apiEndpoint: PropTypes.string.isRequired,
};

export default AsyncSelectSearch;
