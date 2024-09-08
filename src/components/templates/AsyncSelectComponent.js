import React from 'react';
import {useController, useFormContext} from 'react-hook-form';
import AsyncSelect from 'react-select/async';

const AsyncSelectComponent = ({ name, options, defaultValue, isClearable = true }) => {
    const {control} = useFormContext();
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue,
    });
    const filterOptions = (inputValue) => {
        return options.filter((i) =>
            i.includes(inputValue)
        );
    };

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            resolve(filterOptions(inputValue));
        });

    return (<AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        ref={ref}
        isClearable={isClearable}
    />);
};
export default AsyncSelectComponent;
