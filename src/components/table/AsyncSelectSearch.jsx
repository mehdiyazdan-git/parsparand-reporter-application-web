import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import {getCustomSelectStyles} from "../../utils/customStyles";
import useHttp from "../contexts/useHttp";

const AsyncSelectSearch = ({url, value, onChange, width}) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const {methods} = useHttp();

    const loadOptions = async (inputValue) => {
        try {
            const res = await methods.get(
                {
                    'url': url,
                    params : {'searchQuery': inputValue},
                    'headers': {}
                });
            if (res && res?.data){
                return res.data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
            }else {
                return [];
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };
    const onInputSelectChange = (inputValue) => {
        if (inputValue === '') {
            setSelectedValue(null);
            if (onChange) {
                onChange(null);
            }
        }
    };
    const handleChange = (selectedOption) => {
        setSelectedValue(selectedOption);
        if (onChange) {
            onChange(selectedOption);
        }
    };
    const handleClear = () => {
        setSelectedValue(null);
        if (onChange) {
            onChange(null);
        }
    };
    useEffect(() => {
        // Set selectedValue based on the value prop when the component mounts or value prop changes
        if (value) {
            setSelectedValue({ value: value.value, label: value.label });
        } else {
            setSelectedValue(null);
        }
    }, [value]);

    return (
        <div width={width}>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue}
                onChange={handleChange}
                loadOptions={loadOptions}
                onInputChange={onInputSelectChange}
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
