import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {getCustomSelectStyles} from "./customStyles";

const ProductTypeSelect = ({ value, onProductTypeChange, options }) => {
    const [selectedOption, setSelectedOption] = useState(
        options.find(option => option.value === value)
    );

    useEffect(() => {
        setSelectedOption(options.find(option => option.value === value));
    }, [value]);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onProductTypeChange(selectedOption); // Pass the whole selectedOption
    };

    return (
        <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            placeholder="Select Product Type"
            styles={getCustomSelectStyles()}
        />
    );
};

export default ProductTypeSelect;
