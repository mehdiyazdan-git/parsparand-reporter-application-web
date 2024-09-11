import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';
import {getCustomSelectStyles} from "./customStyles";

const SelectInput = ({ name, options, label, field, ...rest }) => {
    const { control } = useFormContext();

    return (
        <div>
            {label && <label>{label}</label>}
            <Controller
                name={name}
                control={control}
                defaultValue={field?.value || options[0].value}
                rules={{ required: field?.required }}
                render={({ field: { onChange, value },fieldState : {error} }) => (
                    <Select
                        options={options}
                        value={options.find(option => option.value === value) || options[0]}
                        onChange={option => onChange(option?.value)}
                        styles={getCustomSelectStyles(error)}
                        {...rest}
                    />
                )}
            />
        </div>
    );
};

export default SelectInput;