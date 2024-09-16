import React, {useEffect, useRef} from 'react';
import AsyncSelect from "react-select/async";
import {getCustomSelectStyles} from "../../utils/customStyles";
import {labelStyle} from "../styles/styles";

const AsyncSelectSearchInput = ({options,resetTrigger,label,name,isClearable = true,value,onChange}) => {
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

        <>
            {label && <label style={labelStyle} htmlFor={name}>{label}</label>}
            <AsyncSelect
                cacheOptions
                defaultOptions={options}
                loadOptions={promiseOptions}
                ref={ref}
                isClearable={isClearable}
                loadingMessage={() => 'در حال بارگذاری...'}
                noOptionsMessage={() => 'هیچ رکوردی یافت نشد.'}
                placeholder='انتخاب...'
                menuPortalTarget={document.body}
                menuPosition="fixed"
                onChange={(selectedOption) => onChange(selectedOption)}
                value={options.find(option => option.value === value)}
                styles={{
                    ...getCustomSelectStyles(),
                    border : '1px solid #ced4da',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    menuPortal: (base) => ({...base, zIndex: 9999}),
                }}
            />
        </>
    );
};

export default AsyncSelectSearchInput;
