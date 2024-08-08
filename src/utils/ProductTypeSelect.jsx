import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {getCustomSelectStyles} from "./customStyles";

const ProductTypeSelect = ({ value, onChange, options }) => {
    const [selectedOption, setSelectedOption] = useState(()=> {
        if (value){
            return options.find(option => option.value === value);
        }else {
            return options[0];
        }
    });
    const handleChange = (option) => {
        setSelectedOption(option);
        onChange(option.value);
    };
    useEffect(() => {
        if (value){
            setSelectedOption(options.find(option => option.value === value));
        }
    }, [value]);

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
