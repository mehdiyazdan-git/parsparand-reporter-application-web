import React, { useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";
import {getCustomSelectStyles} from "./customStyles";
import {labelStyle} from "../components/styles/styles";

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.1rem;
    width: 100%;
    position: relative;
    overflow: visible; /* Ensure container allows overflow */
`;

const AsyncSelectInput = ({ name, options = [], isClearable = true, resetTrigger ,isDisabled,label}) => {
    const { control } = useFormContext();
    const ref = useRef();

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            resolve(options.filter((option) =>
                option.label.includes(inputValue)
            ));
        });

    useEffect(() => {
        if (resetTrigger) ref.current.clearValue();
    }, [resetTrigger]);

    return (

            <Controller
                name={name}
                control={control}
                render={({ field,fieldState: {error} }) => (
                   <SelectContainer>
                       {label && <label style={labelStyle} htmlFor={name}>{label}</label>}
                       <AsyncSelect
                           {...field}
                           cacheOptions
                           defaultOptions={options}
                           loadOptions={promiseOptions}
                           ref={ref}
                           isClearable={isClearable}
                           loadingMessage={() => 'در حال بارگذاری...'}
                           noOptionsMessage={() => 'هیچ رکوردی یافت نشد.'}
                           placeholder={error ? error?.message : 'مقدار را انتخاب کنید.'}
                           menuPortalTarget={document.body}
                           menuPosition="fixed"
                           isDisabled={isDisabled}
                           onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                           value={options.find(option => option.value === field.value)}
                           styles={{
                               ...getCustomSelectStyles(error),
                               border : error ? '1px solid red' : '1px solid #ced4da',
                               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                               menuPortal: (base) => ({...base, zIndex: 9999}),
                           }}
                       />
                   </SelectContainer>
                )}
            />
    );
};

export default AsyncSelectInput;
