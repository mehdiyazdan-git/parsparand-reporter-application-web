
import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import AsyncSelect from 'react-select/async';

const AsyncSelectComponent = ({ value, name, onChange, options, control }) => {
    const {
        field: { ref, ...inputProps },
    } = useController({
        name,
        control,
        defaultValue: value,
    });

    const [selectedOption, setSelectedOption] = useState(null);

    const loadOptions = async (inputValue) => {
        const response = await options;
        const data = await response;
        return data.filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleOnChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption);
    };

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            value={selectedOption}
            onChange={handleOnChange}
            {...inputProps}
        />
    );
};

export default AsyncSelectComponent;

