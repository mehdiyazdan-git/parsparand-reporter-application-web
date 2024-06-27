import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import useHttp from "../../hooks/useHttp";
import {getCustomSelectStyles} from "../../utils/customStyles";


const TableYear = ({ jalaliYear, onChange }) => {
    const [selectedYear, setSelectedYear] = useState(null);
    const http = useHttp();

    useEffect(() => {
        if (jalaliYear) {
            // Fetch year options and set the initial value based on jalaliYear
            loadOptions().then(options => {
                const matchingOption = options.find(option => option.label === jalaliYear);
                setSelectedYear(matchingOption);
            });
        }
    }, [jalaliYear]);

    const loadOptions = async () => {
        try {
            const response = await http.get('/years/select'); // Assuming your API endpoint
            return response.data.map(year => ({
                value: year.id,
                label: year.name,
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

    return (
        <div className="col">
            <AsyncSelect
                value={selectedYear}
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                onChange={handleChange}
                placeholder="سال را انتخاب کنید"
                styles={getCustomSelectStyles()}
            />
        </div>
    );
};

export default TableYear;
