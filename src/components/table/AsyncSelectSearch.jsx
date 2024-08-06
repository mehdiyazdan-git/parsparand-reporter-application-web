import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import {getCustomSelectStyles} from "../../utils/customStyles";
import useHttp from "../contexts/useHttp";

const AsyncSelectSearch = ({ url, value, onChange, width }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const http = useHttp();

    useEffect(() => {
        if (value) {
            loadOptions(value.label) // Fetch options using the label
                .then((options) => {
                    const matchingOption = options.find((option) => option.value === value.value);
                    setSelectedValue(matchingOption);
                });
        }
    }, [value]);


    const loadOptions = async (inputValue) => {
        try {
            const data = await http.get(url,`searchQuery=${inputValue}`);
            return data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    const handleChange = (newValue) => {
        setSelectedValue(newValue);
        onChange(newValue);
    };

    const handleClear = () => {
        setSelectedValue(null);
    };

    return (
        <div width={width}>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue ? [selectedValue] : []}
                onChange={handleChange}
                loadOptions={loadOptions}
                placeholder="جستجو..."
                styles={getCustomSelectStyles()} // Enable clear button styling
                isClearable
                onClear={handleClear}
                className="select-input"
                classNamePrefix="react-select"
                noOptionsMessage={() => "موردی یافت نشد"}
                loadingMessage={() => "در حال بارگذاری"}
            />
        </div>
    );
};

export default AsyncSelectSearch;
