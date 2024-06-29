import React, {useEffect, useState} from 'react';
import AsyncSelect from "react-select/async";
import {getCustomSelectStyles} from "../../utils/customStyles";

const AsyncSelectSearchInput = ({fetchFunction,defaultValue,value,onChange}) => {
    const [options, setOptions] = useState([]);
    const [_defaultValue,_setDefaultValue] = useState(defaultValue)

    const fetchAPI = async (inputValue) => {
        return await fetchFunction(inputValue)
    };
    const promiseOptions = async (inputValue) => {
        try {
            const response = await fetchAPI(inputValue);
            const data = response.data; // Make sure this is an array.
            if (!Array.isArray(data)) {
                throw new Error('Data is not an array');
            }
            const newOptions = data.map((record) => ({
                label: record.name,
                value: record.id,
            }));
            setOptions(newOptions);
            return newOptions;
        } catch (error) {
            console.error('There was an error fetching the options: ', error);
            return []; // Return an empty array if there's an error.
        }
    };


    useEffect(() => {
        async function loadOptions() {
            try {
                const response = await fetchAPI();
                const data = response.data; // Make sure this is an array.
                if (!Array.isArray(data)) {
                    throw new Error('Data is not an array');
                }
                const newOptions = data.map((record) => ({
                    label: record.name,
                    value: record.id,
                }));
                setOptions(newOptions);
                _setDefaultValue(defaultValue ? options.find((o)=> o?.value === defaultValue) : null)
            } catch (error) {
                console.error('There was an error in the initial options load: ', error);
                // You might want to handle this error state appropriately.
            }
        }
        loadOptions();
    }, []);
    return (
        <div>
            <AsyncSelect

                value={value ? options.find((o)=> o?.value === value) : null}
                onChange={(option) =>
                    onChange(option ? option.value : null)}
                cacheOptions
                loadOptions={promiseOptions}
                defaultOptions
                placeholder={"جستجو..."}
                styles={getCustomSelectStyles()}
            />
        </div>
    );
};

export default AsyncSelectSearchInput;
