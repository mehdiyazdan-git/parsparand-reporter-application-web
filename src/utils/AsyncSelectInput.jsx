import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import {Controller} from "react-hook-form";
import {ConnectForm} from "./ConnectForm";
import {getCustomSelectStyles} from "./customStyles";

export const STYLE_BASED_ON_WRAPPER_COMPONENT = {
        control: (base, state) => ({
            ...base,
            background: 'white',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            boxShadow: state.isFocused ? '0 0 0 1px #5352a5' : '0 0 0 1px #ced4da',
            '&:hover': {
                borderColor: '#5352a5',
            },
        }),
        menu: (base) => ({
            ...base,
            background: 'white',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        }),
        option: (base) => ({
            ...base,
            background: 'white',
            color: 'black',
            '&:hover': {
                background: '#e9ecef',
            },
        }),
}


const AsyncSelectInput = ({name,apiFetchFunction,defaultValue,isDisabled,label}) => {
    const [options, setOptions] = useState([]);
    const [_defaultValue,_setDefaultValue] = useState(defaultValue)

    const fetchAPI = async (inputValue) => {
       return await apiFetchFunction(inputValue)
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
        <ConnectForm>
            {({ control,setValue}) =>
                <Controller
                    name={name}
                    control={control}
                    render={({ field,fieldState : {error} }) => (
                        <div>
                            {label && <label style={{fontFamily:"IRANSansBold",fontSize:"0.7rem"}} htmlFor={name}>{label}</label>}
                            <AsyncSelect
                                {...field}
                                value={field.value ? options.find((o)=> o?.value === field.value) : null}
                                onChange={(option) =>
                                    field.onChange(option ? option.value : null)}
                                cacheOptions
                                loadOptions={promiseOptions}
                                name={name}
                                defaultOptions
                                placeholder={error ? error.message : "انتخاب کنید"}
                                styles={{
                                    ...getCustomSelectStyles(error),
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                            }}
                                isDisabled={isDisabled}
                            />
                        </div>
                    )}
            />}
        </ConnectForm>
    );
};
export default AsyncSelectInput;

