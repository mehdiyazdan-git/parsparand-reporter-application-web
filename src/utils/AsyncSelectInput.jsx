import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { Controller } from "react-hook-form";
import { ConnectForm } from "./ConnectForm";
import { getCustomSelectStyles } from "./customStyles";

const AsyncSelectInput = ({ name, apiFetchFunction, defaultValue, isDisabled, label }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const response = await apiFetchFunction();
                const newOptions = response.data.map(record => ({ label: record.name, value: record.id }));
                setOptions(newOptions);

                if (defaultValue) {
                    setSelectedOption(newOptions.find(option => option.value === defaultValue));
                }
            } catch (error) {
                console.error('Error loading options:', error);
                // Handle error appropriately (e.g., set error state)
            }
        };
        loadOptions();
    }, [apiFetchFunction, defaultValue]); // Add dependencies

    const promiseOptions = async (inputValue) => {
        return options.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    return (
        <ConnectForm>
            {({ control, setValue }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={selectedOption}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            {label && <label htmlFor={name}>{label}</label>}
                            <AsyncSelect
                                {...field}
                                value={selectedOption}
                                onChange={(option) => {
                                    setValue(name, option); // Update form value directly
                                    handleChange(option);
                                }}
                                cacheOptions
                                loadOptions={promiseOptions}
                                defaultOptions={options} // Pass default options directly
                                placeholder={error ? error.message : "انتخاب کنید"}
                                styles={{
                                    ...getCustomSelectStyles(error),
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                                }}
                                isDisabled={isDisabled}
                            />
                        </div>
                    )}
                />
            )}
        </ConnectForm>
    );
};

export default AsyncSelectInput;
