/**
 * AsyncSelectComponent
 *
 * A generic async select component that fetches options from an API.
 *
 * Props:
 * - onChange: Function to handle the change event.
 * - filter: an object containing the filter to be applied to the API request.
 * - selectApiUrl: String URL to fetch options from.
 * - labelKey: String key for the label in the option object.
 * - valueKey: String key for the value in the option object.
 * - placeholder: String placeholder for the select input.
 */
import React, {useState, useEffect} from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';


function AsyncSelectComponent({
                                  onChange,
                                  filter,
                                  selectApiUrl,
                                  labelKey,
                                  valueKey,
                                  placeholder,
                              }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const loadInitialOptions = async () => {
            try {
                const response = await axios.get(selectApiUrl);
                const optionsData = response.data.map((item) => ({
                    label: item[labelKey],
                    value: item[valueKey],
                }));
                setOptions(optionsData);

                let initialValue = null;
                if (filter?.[valueKey] && optionsData.length > 0) {
                    initialValue = optionsData.find(
                        (option) => option[valueKey] === filter[valueKey]
                    );
                } else if (optionsData.length > 0) {
                    initialValue = optionsData[0];
                }

                setSelectedOption(initialValue);
            } catch (error) {
                console.error(`Error fetching ${labelKey}s:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialOptions().then(r => r);
    }, [filter?.[valueKey]]);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        if (onChange) {
            onChange(selectedOption[valueKey]);
        }
    };

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions={options}
            isLoading={isLoading}
            value={selectedOption}
            onChange={handleChange}
            placeholder={placeholder}
            styles={getCustomSelectStyles()}
        />
    );
}
export default AsyncSelectComponent;

const getCustomSelectStyles = (error) => {
    return ({
        control: (provided) => ({
            ...provided,
            width: '100%',
            height: "2em",
            fontFamily: 'IRANSans',
            border: error ? "1px red solid" : "1px #ccc solid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            fontSize: "0.7rem",
            color: "#334155",
            "&:focus": {
                outline: "none",
                borderColor: "#86b7fe",
            },
        }),
        option: (provided) => ({
            ...provided,
            fontSize: '0.65rem',
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            fontFamily: 'IRANSans',
            textAlign: 'right',
            fontWeight: 'bold',
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: "0.6rem",
            color: error ? "red" : "#686666"
        }),
    });
};
