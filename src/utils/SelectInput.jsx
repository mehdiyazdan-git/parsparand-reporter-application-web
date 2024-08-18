import React, { useMemo } from 'react';
import Select from "react-select";
import { Controller } from "react-hook-form";
import { ConnectForm } from "./ConnectForm";
import { getCustomSelectStyles } from "./customStyles";

const SelectInput = ({ name, options, label, field, ...rest }) => {
    const customMessages = {
        noOptionsMessage: () => "هیچ رکوردی یافت نشد.."
    };

    const isInFieldArray = useMemo(() => (
        field?.name?.includes('[') && field?.name?.includes(']')
    ), [field?.name]);

    return (
        <ConnectForm>
            {({ control, setValue }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={options[0].value}
                    render={({
                                 field: controlledField, // Rename to avoid shadowing
                                 fieldState: { error }
                             }) => {
                        const onSelectChange = (selectedOption) => {
                            if (!isInFieldArray) {
                                setValue(name, selectedOption ? selectedOption.value : '');
                            }
                            (field || controlledField).onChange(selectedOption ? selectedOption.value : '');
                        };

                        return (
                            <div>
                                <label style={{ fontFamily: "IRANSansBold", fontSize: "0.75rem" }} className="label">{label}</label>
                                <Select
                                    {...(field || controlledField)} // Use 'field' if available, otherwise 'controlledField'
                                    options={options}
                                    styles={getCustomSelectStyles(error)}
                                    value={options.find(option => option.value === (field?.value || controlledField.value))}
                                    onChange={onSelectChange}
                                    className={error ? "error text-danger" : ""}
                                    placeholder={error ? error.message : 'انتخاب...'}
                                    noOptionsMessage={customMessages.noOptionsMessage}
                                    {...rest} // Pass any additional props
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