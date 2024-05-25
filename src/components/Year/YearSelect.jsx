import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { getCustomSelectStyles } from "../../utils/customStyles";
import useHttp from "../../hooks/useHttp";
import moment from "jalali-moment";
import {useFilters} from "../contexts/FilterContext";


const YearSelect = () => {
    const listName= 'years';
    const http = useHttp();
    const [_defaultValue, _setDefaultValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const { filters, setFilter } = useFilters();

    const yearSelect = async (inputValue) => {
        const searchQuery = inputValue ? `?searchQuery=${inputValue}` : '';
        return await http.get(`/years/select${searchQuery}`);
    };

    const fetchAPI = async (inputValue) => {
        return await yearSelect(inputValue);
    };

    const promiseOptions = async (inputValue) => {
        try {
            const response = await fetchAPI(inputValue);
            const data = response.data;
            if (!Array.isArray(data)) {
                console.error('Data is not an array');
                return [];
            }
            return data.map((record) => ({
                label: record.name,
                value: record.id,
            }));
        } catch (error) {
            console.error('There was an error fetching the options: ', error);
            return [];
        }
    };

    const onChange = (value) => {
        _setDefaultValue(value);
        setFilter(listName, 'jalaliYear', value);
    };

    useEffect(() => {
        async function loadOptions() {
            try {
                const response = await fetchAPI('');
                const data = response.data;
                if (!Array.isArray(data)) {
                    console.error('Data is not an array');
                    return;
                }
                const newOptions = data.map((record) => ({
                    label: record.name,
                    value: record.id,
                }));

                let defaultYear = null;

                if (filters[listName]?.jalaliYear) {
                    defaultYear = newOptions.find((o) => o.value === filters[listName].jalaliYear.value);
                } else {
                    const currentYear = newOptions.find((item) => item.label === Number(moment(new Date()).format('jYYYY')));
                    if (currentYear) {
                        defaultYear = currentYear;
                    } else {
                        defaultYear = newOptions.find((o) => o.value === Math.max(...newOptions.map((o) => o.value)));
                    }
                }

                _setDefaultValue(defaultYear);
                setFilter(listName, 'jalaliYear', defaultYear);

            } catch (error) {
                console.error('There was an error in the initial options load: ', error);
            }
        }
        loadOptions();
    }, []);

    return (
        <AsyncSelect
            value={_defaultValue}
            onChange={onChange}
            onInputChange={(input, { action, type }) => {
                if (action === 'input-change' && type !== 'blur') {
                    setInputValue(input);
                }
            }}
            inputValue={inputValue}
            cacheOptions
            loadOptions={promiseOptions}
            defaultOptions
            placeholder={"جستجو..."}
            styles={getCustomSelectStyles()}
        />
    );
};

export default YearSelect;
