import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import {getCustomSelectStyles} from "../../utils/customStyles";

function YearSelect({  onChange, filter  }) {
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        loadOptions().then(options => {
            let initialValue;

            // Check for valid filter.jalaliYear and set it as initialValue if valid
            if (filter?.jalaliYear && filter.jalaliYear.toString().length === 4) {
                initialValue = options.find(option => option.value === filter.jalaliYear);
            } else if (options.length > 0) {
                // Otherwise, set it to the first option
                initialValue = options[0];
            }

            setSelectedYear(initialValue);
        });
    }, [filter?.jalaliYear]);

    const loadOptions = async (inputValue) => {
        try {
            const response = await axios.get('http://localhost:9090/api/years/select');
           //Since react-select primarily works with strings for display, this number is implicitly converted to a string.
            return response.data.map(year => ({
                value: Number(year.name).toString(),
                label: Number(year.name).toString()
            }));

        } catch (error) {
            console.error('Error fetching years:', error);
            return [];
        }
    };

    const handleChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        if (onChange) {
            onChange(Number(selectedOption.value)); // Pass only the numeric value
        }
    };
    const customStyles = getCustomSelectStyles()

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            value={selectedYear}
            onChange={handleChange}
            placeholder="Select a year"
            styles={customStyles}
        />
    );
}

export default YearSelect;
