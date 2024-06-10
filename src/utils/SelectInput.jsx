import React from 'react';
import Select from "react-select";
import { Controller } from "react-hook-form";
import {ConnectForm} from "./ConnectForm";
import {getCustomSelectStyles} from "./customStyles";

const SelectInput = ({ name, options, label }) => {
    const customMessages = {
        noOptionsMessage: () => "هیچ رکوردی یافت نشد.."
    };
    return (
        <ConnectForm>
            {({ control, setValue }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={options[0].value}
                    render={({
                             field,
                             fieldState: { error } }) => {
                        const onSelectChange = (selectedOption) => {
                            setValue(name, selectedOption ? selectedOption.value : '');
                            field.onChange(selectedOption ? selectedOption.value : '');
                        };

                        return (
                            <div>
                                <label style={{fontFamily:"IRANSansBold",fontSize:"0.75rem"}} className="label">{label}</label>
                                <Select
                                    {...field}
                                    options={options}
                                    styles={getCustomSelectStyles(error)}
                                    value={options.find(option => option.value === field.value)}
                                    onChange={onSelectChange}
                                    className={error ? "error text-danger" : ""}
                                    placeholder={error ? error.message : 'انتخاب...'}
                                    noOptionsMessage={customMessages.noOptionsMessage}
                                />
                            </div>
                        );
                    }}
                />
            )}
        </ConnectForm>
    );
};


export default SelectInput;
