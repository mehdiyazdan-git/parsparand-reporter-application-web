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
                    defaultValue={options[0]?.value} // Provide a default value if available
                    render={({
                                 field: controlledField,
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
                                    {...(field || controlledField)}
                                    options={options}
                                    styles={getCustomSelectStyles(error)} // Pass the error state to your styling function
                                    value={options.find(option => option.value === (field?.value || controlledField.value))}
                                    onChange={onSelectChange}
                                    noOptionsMessage={customMessages.noOptionsMessage}
                                    {...rest}
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