import React, {useEffect, useRef} from 'react';
import AsyncSelect from 'react-select/async';
import styled from "styled-components";
import {getCustomSelectStyles} from "../../utils/customStyles";

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.1rem;
    width: 100%;
`;

const AsyncSelectComponent = ({value, options = [], onChange,name, isClearable = true, resetTrigger}) => {

    const ref = useRef();

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            resolve(options.filter((option) => option.label.includes(inputValue)));
        });

    useEffect(() => {
        if (resetTrigger) ref.current.clearValue();
    }, [resetTrigger]);

    return (
        <SelectContainer>
            <AsyncSelect
                cacheOptions
                defaultOptions={options}
                loadOptions={promiseOptions}
                onChange={onChange}
                value={value}
                name={name}
                ref={ref}
                isClearable={isClearable}
                loadingMessage={() => 'در حال بارگذاری...'}
                noOptionsMessage={() => 'هیچ رکوردی یافت نشد.'}
                placeholder="انتخاب..."
                styles={{...getCustomSelectStyles()}}
            />
        </SelectContainer>

    );
};

export default AsyncSelectComponent;
