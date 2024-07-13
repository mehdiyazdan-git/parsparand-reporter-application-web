import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import {getCustomSelectStyles} from "../../utils/customStyles";

function YearSelect({ onChange, filter }) {
    const [selectedYear, setSelectedYear] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [yearOptions, setYearOptions] = useState([]);

    useEffect(() => {
        const loadInitialYear = async () => {
            try {
                const response = await axios.get('http://localhost:9090/api/years/select');
                const options = response.data.map(year => ({
                    value: year.name, // Store as number
                    label: year.name.toString()
                }));
                setYearOptions(options);

                // Set initial value logic
                let initialValue = null;
                if (filter?.jalaliYear) {
                    initialValue = options.find(option => option.value === filter.jalaliYear);
                } else if (options.length > 0) {
                    initialValue = options[0];
                }

                setSelectedYear(initialValue);
            } catch (error) {
                console.error('Error fetching years:', error);
                // Handle error gracefully (e.g., display an error message)
            } finally {
                setIsLoading(false); // Finish loading in all cases
            }
        };

        loadInitialYear();
    }, []); // Re-fetch only when filter.jalaliYear changes


    const handleChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        if (onChange) {
            onChange(selectedOption.value); // Use the numeric value directly
        }
    };

    const customStyles = getCustomSelectStyles()



    return (
        <AsyncSelect
            cacheOptions
            defaultOptions={yearOptions}
            isLoading={isLoading} // Show loading state
            value={selectedYear}
            onChange={handleChange}
            placeholder="انتخاب..."
            styles={customStyles}
        />
    );
}

export default YearSelect;


