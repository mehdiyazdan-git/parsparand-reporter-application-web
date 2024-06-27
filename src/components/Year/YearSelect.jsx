import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import {getCustomSelectStyles} from "../../utils/customStyles";

function YearSelect({ value, onChange }) {
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        if (value) {
            loadOptions(value).then(options => {
                const matchingOption = options.find(option => option.value === value);
                setSelectedYear(matchingOption);
            });
        }
    }, [value]);

    const loadOptions = async (inputValue) => {
        try {
            const response = await axios.get('http://localhost:9090/api/years/select');
            return response.data.map(year => ({
                value: year.name,
                label: year.name
            }));
        } catch (error) {
            console.error('Error fetching years:', error);
            return [];
        }
    };

    const handleChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        if (onChange) {
            onChange(selectedOption);
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
