import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const AsyncSelectSearchInput = ({ name, fetchFunction, defaultValue, onChange }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (defaultValue) {
            fetchFunction('').then((response) => {
                const formattedOptions = response.data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setOptions(formattedOptions);
                setSelectedOption(formattedOptions.find(option => option.value === defaultValue));
            });
        }
    }, [defaultValue, fetchFunction]);

    const loadOptions = async (inputValue) => {
        try {
            const response = await fetchFunction(inputValue);
            const formattedOptions = response.data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setOptions(formattedOptions);
            return formattedOptions;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Select
            isSearchable
            placeholder="Search..."
            value={selectedOption}
            loadOptions={loadOptions}
            options={options}
            onChange={(selectedOption) => {
                setSelectedOption(selectedOption);
                onChange(selectedOption ? selectedOption.value : null);
            }}
        />
    );
};

export default AsyncSelectSearchInput;
